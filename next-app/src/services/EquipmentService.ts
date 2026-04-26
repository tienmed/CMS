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
            const [rows] = await pool.query('SELECT * FROM equipment WHERE deleted_at IS NULL');
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
                SELECT ei.*, es.name as status_name, es.is_rentable
                FROM equipment_item ei
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                WHERE ei.equipment_id = ? AND ei.deleted_at IS NULL
            `, [equipmentId]);
            return rows as (EquipmentItem & { status_name: string; is_rentable: boolean })[];
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
     */
    async getRentableItems(): Promise<(EquipmentItem & { equipment_name: string; status_name: string })[]> {
        try {
            const [rows] = await pool.query(`
                SELECT ei.*, e.name as equipment_name, es.name as status_name
                FROM equipment_item ei
                JOIN equipment e ON ei.equipment_id = e.id
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                WHERE es.is_rentable = 1 AND ei.deleted_at IS NULL
                ORDER BY e.name, ei.barcode_stt
            `);
            return rows as (EquipmentItem & { equipment_name: string; status_name: string })[];
        } catch (err) {
            throw new AppError('Không thể lấy danh sách mẫu vật sẵn sàng', 500, 'DB_QUERY_ERROR');
        }
    }
}

export const equipmentService = EquipmentService.getInstance();
