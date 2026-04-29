import pool from '@/lib/db';
import { Equipment, EquipmentItem } from '@/types/equipment';
import { AppError } from '@/lib/error';
import { z } from 'zod';

const EquipmentSchema = z.object({
    name: z.string().min(1, 'Tên thiết bị không được để trống'),
    type_id: z.number().int(),
    barcode: z.string().optional(),
    note: z.string().optional(),
    url: z.string().optional(),
});

class EquipmentService {
    private static instance: EquipmentService;

    private constructor() { }

    public static getInstance(): EquipmentService {
        if (!EquipmentService.instance) {
            EquipmentService.instance = new EquipmentService();
        }
        return EquipmentService.instance;
    }

    /**
     * Lấy danh sách toàn bộ thiết bị kèm phân loại
     */
    async getAllEquipment(): Promise<Equipment[]> {
        try {
            const [rows] = await pool.query(`
                SELECT e.*,
                       COUNT(ei.id) as item_count
                FROM equipment e
                LEFT JOIN equipment_item ei ON ei.equipment_id = e.id AND ei.deleted_at IS NULL
                WHERE e.deleted_at IS NULL
                GROUP BY e.id
                ORDER BY e.id DESC
            `);
            return rows as Equipment[];
        } catch (err) {
            throw new AppError('Không thể lấy danh sách thiết bị', 500, 'DB_QUERY_ERROR', false);
        }
    }

    /**
     * Lấy chi tiết thiết bị theo ID
     */
    async getEquipmentById(id: number): Promise<Equipment | null> {
        try {
            const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ? AND deleted_at IS NULL', [id]) as any;
            return rows[0] || null;
        } catch (err) {
            throw new AppError(`Lỗi khi truy vấn thiết bị id: ${id}`, 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Lấy danh sách các mẫu vật (items) của một thiết bị kèm trạng thái
     */
    async getItemsByEquipmentId(equipmentId: number): Promise<(EquipmentItem & { status_name: string; is_rentable: boolean })[]> {
        try {
            const [rows] = await pool.query(`
                SELECT ei.*, 
                       es.name as status_name, es.is_rentable as status_is_rentable,
                       c.name as condition_name, c.is_rentable as condition_is_rentable, c.rental_reject_msg as condition_reject_msg
                FROM equipment_item ei
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                JOIN \`condition\` c ON ei.condition_id = c.id
                WHERE ei.equipment_id = ? AND ei.deleted_at IS NULL
            `, [equipmentId]);
            return rows as any[];
        } catch (err) {
            throw new AppError('Không thể lấy danh sách mẫu vật', 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Cập nhật thông tin thiết bị
     */
    async updateEquipmentDetails(id: number, data: Partial<Equipment>): Promise<boolean> {
        try {
            const [result] = await pool.query(
                'UPDATE equipment SET name = ?, note = ?, url = ? WHERE id = ?',
                [data.name, data.note, data.url, id]
            ) as any;
            return result.affectedRows > 0;
        } catch (err) {
            throw new AppError('Lỗi khi cập nhật thông tin thiết bị', 500, 'DB_UPDATE_ERROR');
        }
    }

    /**
     * Lấy danh sách toàn bộ mẫu vật có thể cho mượn (đang ở trạng thái is_rentable = 1)
     * Kèm theo thống kê sử dụng và gợi ý thông minh
     */
    async getRentableItems(): Promise<(EquipmentItem & { equipment_name: string; status_name: string; condition_name: string; condition_reject_msg: string })[]> {
        try {
            const [rows] = await pool.query(`
                SELECT ei.*, e.name as equipment_name, 
                       es.name as status_name, es.is_rentable as status_is_rentable,
                       c.name as condition_name, c.is_rentable as condition_is_rentable, c.rental_reject_msg as condition_reject_msg,
                       (SELECT COUNT(*) FROM rental_detail rd WHERE rd.equipment_item_id = ei.id) as usage_count
                FROM equipment_item ei
                JOIN equipment e ON ei.equipment_id = e.id
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                JOIN \`condition\` c ON ei.condition_id = c.id
                WHERE es.is_rentable = 1 AND ei.deleted_at IS NULL
                ORDER BY e.name, ei.barcode_stt
            `);

            const items = rows as EquipmentItem[];

            // Tính toán gợi ý thông minh (Smart Rotation)
            // Tìm usage_count thấp nhất cho mỗi nhóm equipment_id
            const minUsageByEquipment: Record<number, number> = {};
            items.forEach(item => {
                const eid = item.equipment_id;
                if (minUsageByEquipment[eid] === undefined || (item.usage_count || 0) < minUsageByEquipment[eid]) {
                    minUsageByEquipment[eid] = item.usage_count || 0;
                }
            });

            // Gắn cờ is_recommended cho các thiết bị có usage_count = min (và có ít nhất 2 thiết bị trong nhóm để so sánh)
            const equipmentCounts: Record<number, number> = {};
            items.forEach(item => {
                equipmentCounts[item.equipment_id] = (equipmentCounts[item.equipment_id] || 0) + 1;
            });

            return items.map(item => ({
                ...item,
                is_recommended: equipmentCounts[item.equipment_id] > 1 && (item.usage_count || 0) === minUsageByEquipment[item.equipment_id]
            })) as any;
        } catch (err) {
            throw new AppError('Không thể lấy danh sách mẫu vật sẵn sàng', 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Kiểm tra trạng thái chi tiết của một thiết bị qua barcode (phục vụ quét QR)
     */
    async checkItemAvailability(barcode: string): Promise<{
        available: boolean;
        reason?: 'rented' | 'broken' | 'not_found';
        item?: any;
        activeTicket?: { id: number; ticket_no: string; renter: string };
    }> {
        try {
            // 1. Tìm thiết bị
            const [itemRows] = await pool.query(`
                SELECT ei.*, e.name as equipment_name, 
                       es.is_rentable as status_is_rentable,
                       c.is_rentable as condition_is_rentable, c.name as condition_name, c.rental_reject_msg
                FROM equipment_item ei
                JOIN equipment e ON ei.equipment_id = e.id
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                JOIN \`condition\` c ON ei.condition_id = c.id
                WHERE ei.barcode_stt = ? AND ei.deleted_at IS NULL
            `, [barcode]) as any;

            if (itemRows.length === 0) {
                return { available: false, reason: 'not_found' };
            }

            const item = itemRows[0];

            // 2. Kiểm tra nếu đang bị hỏng/không cho mượn (Condition)
            if (!item.condition_is_rentable) {
                return {
                    available: false,
                    reason: 'broken',
                    item: {
                        barcode_stt: item.barcode_stt,
                        name: item.equipment_name,
                        condition_name: item.condition_name,
                        reject_msg: item.rental_reject_msg
                    }
                };
            }

            // 3. Kiểm tra nếu đang bận (Status)
            if (!item.status_is_rentable) {
                // Tìm phiếu mượn đang giữ món này
                const [ticketRows] = await pool.query(`
                    SELECT rt.id, rt.ticket_no, rt.rented_full_name as renter
                    FROM rental_detail rd
                    JOIN rental_ticket rt ON rd.rental_ticket_id = rt.id
                    WHERE rd.equipment_item_id = ? AND rd.returned_at IS NULL AND rt.deleted_at IS NULL
                    ORDER BY rt.rented_date DESC
                    LIMIT 1
                `, [item.id]) as any;

                return {
                    available: false,
                    reason: 'rented',
                    item: { barcode_stt: item.barcode_stt, name: item.equipment_name },
                    activeTicket: ticketRows[0] || undefined
                };
            }

            return { available: true, item };
        } catch (err) {
            throw new AppError('Lỗi khi kiểm tra trạng thái thiết bị', 500, 'DB_QUERY_ERROR');
        }
    }

    /**
     * Lấy thông tin chi tiết theo barcode_stt (mã QR của từng mẫu vật)
     */
    async getItemDetailByBarcode(barcode: string): Promise<{
        item: (EquipmentItem & {
            equipment_name: string;
            equipment_barcode: string | null;
            equipment_note: string | null;
            equipment_image_url: string | null;
            status_name: string;
            status_is_rentable: boolean;
            condition_name: string;
            condition_is_rentable: boolean;
            condition_reject_msg: string | null;
            usage_count: number;
        }) | null;
        activeTicket?: { id: number; ticket_no: string; renter: string; rented_date: Date };
    }> {
        try {
            const [rows] = await pool.query(`
                SELECT
                    ei.*,
                    e.name as equipment_name,
                    e.barcode as equipment_barcode,
                    e.note as equipment_note,
                    e.url as equipment_image_url,
                    es.name as status_name,
                    es.is_rentable as status_is_rentable,
                    c.name as condition_name,
                    c.is_rentable as condition_is_rentable,
                    c.rental_reject_msg as condition_reject_msg,
                    COALESCE(usage.usage_count, 0) as usage_count
                FROM equipment_item ei
                JOIN equipment e ON ei.equipment_id = e.id
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                JOIN \`condition\` c ON ei.condition_id = c.id
                LEFT JOIN (
                    SELECT equipment_item_id, COUNT(*) as usage_count
                    FROM rental_detail
                    GROUP BY equipment_item_id
                ) usage ON usage.equipment_item_id = ei.id
                WHERE ei.barcode_stt = ? AND ei.deleted_at IS NULL
                LIMIT 1
            `, [barcode]) as any;

            if (!rows.length) {
                return { item: null };
            }

            const item = rows[0];
            const normalizedItem = {
                ...item,
                usage_count: Number(item.usage_count || 0),
                status_is_rentable: Boolean(item.status_is_rentable),
                condition_is_rentable: Boolean(item.condition_is_rentable),
            };

            const [ticketRows] = await pool.query(`
                SELECT rt.id, rt.ticket_no, rt.rented_full_name as renter, rt.rented_date
                FROM rental_detail rd
                JOIN rental_ticket rt ON rd.rental_ticket_id = rt.id
                WHERE rd.equipment_item_id = ? 
                    AND rd.returned_at IS NULL
                    AND rt.deleted_at IS NULL
                ORDER BY rt.rented_date DESC
                LIMIT 1
            `, [item.id]) as any;

            return {
                item: normalizedItem,
                activeTicket: ticketRows[0] || undefined
            };
        } catch (err) {
            throw new AppError('Không thể lấy chi tiết mã QR thiết bị', 500, 'DB_QUERY_ERROR');
        }
    }
}

export const equipmentService = EquipmentService.getInstance();
