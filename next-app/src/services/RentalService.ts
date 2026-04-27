import pool, { withTransaction } from '@/lib/db';
import { RentalTicket, UsageHistory } from '@/types/rental';
import { AppError } from '@/lib/error';

class RentalService {
    private static instance: RentalService;

    private constructor() { }

    public static getInstance(): RentalService {
        if (!RentalService.instance) {
            RentalService.instance = new RentalService();
        }
        return RentalService.instance;
    }

    /**
     * Lấy danh sách phiếu mượn đang hoạt động (chưa trả xong)
     */
    async getActiveTickets(): Promise<RentalTicket[]> {
        try {
            const [rows] = await pool.query('SELECT * FROM rental_ticket WHERE completed_date IS NULL ORDER BY rented_date DESC');
            return rows as RentalTicket[];
        } catch (err) {
            throw new AppError('Không thể lấy danh sách phiếu mượn', 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Lấy lịch sử sử dụng chi tiết, gộp theo phiếu mượn
     */
    async getUsageHistory(): Promise<UsageHistory[]> {
        try {
            const query = `
                SELECT 
                    rt.id,
                    rt.rented_date as date, 
                    rt.completed_date,
                    rt.ticket_no, 
                    rt.rented_full_name as renter,
                    rt.note,
                    COALESCE(d.name, 'N/A') as department_name,
                    CASE WHEN rt.completed_date IS NULL THEN 'rented' ELSE 'returned' END as status,
                    rd.id as detail_id,
                    rd.returned_at as item_returned_at,
                    e.name as equipment_name,
                    e.barcode as equipment_barcode,
                    ei.id as item_id,
                    ei.barcode_stt,
                    es.name as item_status
                FROM rental_ticket rt
                LEFT JOIN department d ON rt.rented_by = d.id
                JOIN rental_detail rd ON rt.id = rd.rental_ticket_id
                JOIN equipment_item ei ON rd.equipment_item_id = ei.id
                JOIN equipment e ON ei.equipment_id = e.id
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                WHERE rt.deleted_at IS NULL
                ORDER BY rt.rented_date DESC
                LIMIT 500
            `;
            const [rows] = await pool.query(query) as any;

            const ticketsMap = new Map<number, UsageHistory>();

            for (const row of rows) {
                if (!ticketsMap.has(row.id)) {
                    ticketsMap.set(row.id, {
                        id: row.id,
                        date: row.date,
                        completed_date: row.completed_date,
                        ticket_no: row.ticket_no,
                        department_name: row.department_name,
                        renter: row.renter,
                        note: row.note,
                        status: row.status,
                        items: []
                    });
                }

                const ticket = ticketsMap.get(row.id)!;
                ticket.items.push({
                    id: row.item_id,
                    detail_id: row.detail_id,
                    equipment_name: row.equipment_name,
                    barcode: row.equipment_barcode,
                    barcode_stt: row.barcode_stt,
                    status: row.item_status,
                    returned_at: row.item_returned_at
                });
            }

            return Array.from(ticketsMap.values()).slice(0, 50);
        } catch (err: any) {
            throw new AppError(`Không thể lấy lịch sử sử dụng: ${err.message}`, 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Generate next ticket number in format RT-YYYYMMLL
     * where LL is the sequence number for the current month
     */
    async generateNextTicketNo(): Promise<string> {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const prefix = `RT-${year}${month}`;

            // Tìm mã lớn nhất có cùng prefix trong tháng này
            const [rows] = await pool.query(
                "SELECT ticket_no FROM rental_ticket WHERE ticket_no LIKE ? ORDER BY ticket_no DESC LIMIT 1",
                [`${prefix}%`]
            ) as any;

            let nextSequence = 1;
            if (rows.length > 0) {
                const lastTicketNo = rows[0].ticket_no;
                // Lấy phần số thứ tự ở cuối (có thể nhiều hơn 2 chữ số nếu vượt quá 99)
                const lastSequenceStr = lastTicketNo.replace(prefix, '');
                const lastSequence = parseInt(lastSequenceStr);
                if (!isNaN(lastSequence)) {
                    nextSequence = lastSequence + 1;
                }
            }

            return `${prefix}${String(nextSequence).padStart(2, '0')}`;
        } catch (error) {
            console.error('Error generating ticket number:', error);
            // Fallback to timestamp if DB error
            return `RT-${Date.now().toString().slice(-6)}`;
        }
    }

    /**
     * Tạo phiếu mượn mới (Transaction)
     */
    async createRentalTicket(ticket: Omit<RentalTicket, 'id'>, itemIds: number[]): Promise<number> {
        return await withTransaction(async (connection) => {
            try {
                // Kiểm tra ràng buộc mượn đồ (Status & Condition)
                const [invalidItems] = await connection.query(`
                    SELECT ei.barcode_stt, es.name as status_name, c.name as condition_name, c.rental_reject_msg
                    FROM equipment_item ei
                    JOIN equipment_status es ON ei.equipment_status_id = es.id
                    JOIN \`condition\` c ON ei.condition_id = c.id
                    WHERE ei.id IN (?) AND (es.is_rentable = 0 OR c.is_rentable = 0)
                `, [itemIds]) as any[];

                if (invalidItems.length > 0) {
                    const names = invalidItems.map((i: any) =>
                        `${i.barcode_stt} (Tình trạng: ${i.condition_name}${i.rental_reject_msg ? ` - ${i.rental_reject_msg}` : ''})`
                    ).join(', ');
                    throw new AppError(`Các thiết bị sau không thể mượn: ${names}`, 400, 'RENTAL_CONSTRAINT_ERROR');
                }

                const [ticketResult] = await connection.query(
                    'INSERT INTO rental_ticket (ticket_no, note, due_date, rented_date, created_by, rented_full_name, rented_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [ticket.ticket_no, ticket.note, ticket.due_date, ticket.rented_date, ticket.created_by, ticket.rented_full_name, ticket.rented_by]
                ) as any;

                const ticketId = ticketResult.insertId;

                for (const itemId of itemIds) {
                    await connection.query(
                        'INSERT INTO rental_detail (rental_ticket_id, equipment_item_id, due_date, condition_id) VALUES (?, ?, ?, ?)',
                        [ticketId, itemId, ticket.due_date, 1]
                    );

                    await connection.query('UPDATE equipment_item SET equipment_status_id = (SELECT id FROM equipment_status WHERE is_rentable = 0 LIMIT 1) WHERE id = ?', [itemId]);
                }

                return ticketId;
            } catch (err: any) {
                if (err instanceof AppError) throw err;
                throw new AppError('Lỗi khi mượn thiết bị', 500, 'RENTAL_CREATION_ERROR');
            }
        });
    }

    /**
     * Lấy chi tiết phiếu mượn kèm danh sách món
     */
    async getTicketDetails(ticketId: number): Promise<UsageHistory | null> {
        try {
            const query = `
                SELECT 
                    rt.id,
                    rt.rented_date as date, 
                    rt.ticket_no, 
                    rt.rented_full_name as renter,
                    rt.note,
                    rt.due_date as ticket_due_date,
                    COALESCE(d.name, 'N/A') as department_name,
                    CASE WHEN rt.completed_date IS NULL THEN 'rented' ELSE 'returned' END as status,
                    rd.id as detail_id,
                    rd.returned_at,
                    rd.due_date as item_due_date,
                    e.name as equipment_name,
                    e.barcode as equipment_barcode,
                    ei.id as item_id,
                    ei.barcode_stt,
                    es.name as item_status
                FROM rental_ticket rt
                LEFT JOIN department d ON rt.rented_by = d.id
                JOIN rental_detail rd ON rt.id = rd.rental_ticket_id
                JOIN equipment_item ei ON rd.equipment_item_id = ei.id
                JOIN equipment e ON ei.equipment_id = e.id
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                WHERE rt.id = ? AND rt.deleted_at IS NULL
            `;
            const [rows] = await pool.query(query, [ticketId]) as any;

            if (rows.length === 0) return null;

            const ticket: UsageHistory = {
                id: rows[0].id,
                date: rows[0].date,
                ticket_no: rows[0].ticket_no,
                department_name: rows[0].department_name,
                renter: rows[0].renter,
                note: rows[0].note,
                status: rows[0].status,
                items: rows.map((row: any) => ({
                    id: row.item_id,
                    detail_id: row.detail_id,
                    equipment_name: row.equipment_name,
                    barcode: row.equipment_barcode,
                    barcode_stt: row.barcode_stt,
                    status: row.item_status,
                    returned_at: row.returned_at,
                    due_date: row.item_due_date || row.ticket_due_date
                }))
            };

            return ticket;
        } catch (err) {
            throw new AppError('Không thể lấy chi tiết phiếu mượn', 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Ghi nhận trả thiết bị (Partial Return)
     * Trả về số thứ tự lần trả (xx)
     */
    async returnItems(ticketId: number, detailIds: number[]): Promise<number> {
        return await withTransaction(async (connection) => {
            try {
                const now = new Date();

                await connection.query(
                    'UPDATE rental_detail SET returned_at = ? WHERE id IN (?)',
                    [now, detailIds]
                );

                await connection.query(`
                    UPDATE equipment_item 
                    SET equipment_status_id = (SELECT id FROM equipment_status WHERE is_rentable = 1 LIMIT 1)
                    WHERE id IN (SELECT equipment_item_id FROM rental_detail WHERE id IN (?))
                `, [detailIds]);

                // Đếm số lần trả hiện tại (số cụm returned_at khác nhau)
                const [countRows] = await connection.query(`
                    SELECT COUNT(DISTINCT returned_at) as session_count 
                    FROM rental_detail 
                    WHERE rental_ticket_id = ? AND returned_at IS NOT NULL
                `, [ticketId]) as any;

                const sessionCount = countRows[0].session_count;

                const [remaining] = await connection.query(
                    'SELECT COUNT(*) as count FROM rental_detail WHERE rental_ticket_id = ? AND returned_at IS NULL',
                    [ticketId]
                ) as any;

                if (remaining[0].count === 0) {
                    await connection.query(
                        'UPDATE rental_ticket SET completed_date = ? WHERE id = ?',
                        [now, ticketId]
                    );
                }

                return sessionCount;
            } catch (err: any) {
                throw new AppError(`Lỗi khi ghi nhận trả: ${err.message}`, 500, 'DB_UPDATE_ERROR');
            }
        });
    }
}

export const rentalService = RentalService.getInstance();
