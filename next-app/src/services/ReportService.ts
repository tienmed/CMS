import pool from '@/lib/db';

export interface ReportData {
    category: string;
    count: number;
}

class ReportService {
    private static instance: ReportService;

    private constructor() { }

    public static getInstance(): ReportService {
        if (!ReportService.instance) {
            ReportService.instance = new ReportService();
        }
        return ReportService.instance;
    }

    /**
     * Thống kê thiết bị theo mức độ (H/M/L)
     */
    async getEquipmentByLevel(): Promise<ReportData[]> {
        const query = `
            SELECT 
                CASE SUBSTRING(barcode, 3, 1)
                    WHEN 'H' THEN 'High'
                    WHEN 'M' THEN 'Medium'
                    WHEN 'L' THEN 'Low'
                    ELSE 'Khác'
                END as category,
                COUNT(*) as count 
            FROM equipment 
            WHERE deleted_at IS NULL AND barcode IS NOT NULL AND LENGTH(barcode) >= 3
            GROUP BY category
            ORDER BY count DESC
        `;
        const [rows] = await pool.query(query);
        return rows as ReportData[];
    }

    /**
     * Thống kê thiết bị theo hãng sản xuất
     */
    async getEquipmentByManufacturer(): Promise<ReportData[]> {
        // Manufacturer data is not in a separate column yet, potentially in 'note'
        // Returning empty for now to avoid crash
        return [];
    }

    /**
     * Thống kê tỉ lệ mượn/trả theo từng phòng/bộ môn
     */
    async getRentalByDepartment(): Promise<ReportData[]> {
        const query = `
      SELECT d.name as category, COUNT(rt.id) as count
      FROM department d
      LEFT JOIN rental_ticket rt ON d.id = rt.rented_by
      GROUP BY d.name
    `;
        const [rows] = await pool.query(query);
        return rows as ReportData[];
    }
}

export const reportService = ReportService.getInstance();
