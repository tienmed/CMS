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
      SELECT level as category, COUNT(*) as count 
      FROM equipment 
      GROUP BY level
    `;
        const [rows] = await pool.query(query);
        return rows as ReportData[];
    }

    /**
     * Thống kê thiết bị theo hãng sản xuất
     */
    async getEquipmentByManufacturer(): Promise<ReportData[]> {
        const query = `
      SELECT manufacturer as category, COUNT(*) as count 
      FROM equipment 
      WHERE manufacturer IS NOT NULL 
      GROUP BY manufacturer
    `;
        const [rows] = await pool.query(query);
        return rows as ReportData[];
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
