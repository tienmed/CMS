import pool from '@/lib/db';
import { aiService, AIInsight } from './AIService';

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
    async getEquipmentByLevel(startDate?: string, endDate?: string): Promise<ReportData[]> {
        let dateFilter = '';
        const params: any[] = [];

        if (startDate && endDate) {
            dateFilter = ' AND created_at BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

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
            ${dateFilter}
            GROUP BY category
            ORDER BY count DESC
        `;
        const [rows] = await pool.query(query, params);
        return rows as ReportData[];
    }

    /**
     * Thống kê thiết bị theo nhóm (MH, TB, VP)
     */
    async getEquipmentByGroup(startDate?: string, endDate?: string): Promise<ReportData[]> {
        let dateFilter = '';
        const params: any[] = [];

        if (startDate && endDate) {
            dateFilter = ' AND created_at BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        const query = `
            SELECT 
                CASE SUBSTRING(barcode, 1, 2)
                    WHEN 'MH' THEN 'Mô hình'
                    WHEN 'TB' THEN 'Thiết bị'
                    WHEN 'VP' THEN 'Văn phòng'
                    ELSE SUBSTRING(barcode, 1, 2)
                END as category,
                COUNT(*) as count 
            FROM equipment 
            WHERE deleted_at IS NULL AND barcode IS NOT NULL AND LENGTH(barcode) >= 3
            ${dateFilter}
            GROUP BY category
            ORDER BY count DESC
        `;
        const [rows] = await pool.query(query, params);
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
     * Thống kê tần suất mượn theo từng phòng/bộ môn
     */
    async getRentalByDepartment(startDate?: string, endDate?: string): Promise<ReportData[]> {
        let dateFilter = '';
        const params: any[] = [];

        if (startDate && endDate) {
            dateFilter = ' AND rt.rented_date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        const query = `
            SELECT d.name as category, COUNT(rt.id) as count
            FROM department d
            LEFT JOIN rental_ticket rt ON d.id = rt.rented_by ${dateFilter}
            WHERE d.deleted_at IS NULL
            GROUP BY d.name
            ORDER BY count DESC
        `;
        const [rows] = await pool.query(query, params);
        return rows as ReportData[];
    }

    /**
     * Sinh báo cáo tóm tắt điều hành bằng AI (Qwen3)
     */
    async generateAIExecutiveSummary(): Promise<AIInsight> {
        // 1. Thu thập dữ liệu từ các báo cáo thành phần
        const [byGroup, byLevel, byDept] = await Promise.all([
            this.getEquipmentByGroup(),
            this.getEquipmentByLevel(),
            this.getRentalByDepartment()
        ]);

        const aggregatedData = {
            equipmentDistribution: {
                byGroup,
                byLevel
            },
            departmentUsage: byDept,
            generatedAt: new Date().toISOString()
        };

        // 2. Gọi AI để tổng hợp nhận định
        return await aiService.getExecutiveSummary(aggregatedData);
    }
}

export const reportService = ReportService.getInstance();
