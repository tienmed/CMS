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
     * Lấy danh sách phiếu mượn đang hoạt động (chưa trả)
     */
    async getActiveTickets(): Promise<RentalTicket[]> {
        try {
            const [rows] = await pool.query('SELECT * FROM rental_ticket WHERE completed_date IS NULL');
            return rows as RentalTicket[];
        } catch (err) {
            throw new AppError('Không thể lấy danh sách phiếu mượn', 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Lấy lịch sử sử dụng chi tiết giúp theo dõi lộ trình thiết bị
     */
    async getUsageHistory(): Promise<UsageHistory[]> {
        try {
            const query = `
        SELECT 
          rt.rented_date as date, 
          rt.ticket_no, 
          e.name as equipment_name, 
          ei.barcode_stt as barcode, 
          rt.rented_full_name as renter,
          CASE WHEN rt.completed_date IS NULL THEN 'rented' ELSE 'returned' END as status
        FROM rental_ticket rt
        JOIN rental_detail rd ON rt.id = rd.rental_ticket_id
        JOIN equipment_item ei ON rd.equipment_item_id = ei.id
        JOIN equipment e ON ei.equipment_id = e.id
        ORDER BY rt.rented_date DESC
        LIMIT 100
      `;
            const [rows] = await pool.query(query);
            return rows as UsageHistory[];
        } catch (err: any) {
            throw new AppError(`Không thể lấy lịch sử sử dụng: ${err.message}`, 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Tạo phiếu mượn mới (Transaction)
     */
    async createRentalTicket(ticket: Omit<RentalTicket, 'id'>, itemIds: number[]): Promise<number> {
        return await withTransaction(async (connection) => {
            try {
                const [ticketResult] = await connection.query(
                    'INSERT INTO rental_ticket (ticket_no, note, due_date, rented_date, created_by, rented_full_name, rented_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [ticket.ticket_no, ticket.note, ticket.due_date, ticket.rented_date, ticket.created_by, ticket.rented_full_name, ticket.rented_by]
                ) as any;

                const ticketId = ticketResult.insertId;

                for (const itemId of itemIds) {
                    await connection.query(
                        'INSERT INTO rental_detail (rental_ticket_id, equipment_item_id, due_date, condition_id) VALUES (?, ?, ?, ?)',
                        [ticketId, itemId, ticket.due_date, 1] // Giả định condition_id 1 là 'Bình thường'
                    );

                    // Cập nhật trạng thái item (equipment_status_id)
                    await connection.query('UPDATE equipment_item SET equipment_status_id = (SELECT id FROM equipment_status WHERE is_rentable = 0 LIMIT 1) WHERE id = ?', [itemId]);
                }

                return ticketId;
            } catch (err) {
                throw new AppError('Lỗi khi mượn thiết bị', 500, 'RENTAL_CREATION_ERROR');
            }
        });
    }
}

export const rentalService = RentalService.getInstance();
