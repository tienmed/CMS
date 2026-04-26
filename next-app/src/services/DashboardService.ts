import pool from '@/lib/db';

export interface DashboardStats {
    totalEquipment: number;
    totalItems: number;
    rentableItems: number;
    nonRentableItems: number;
    openTickets: number;
}

export interface GroupDistribution {
    group_code: string;
    label: string;
    count: number;
}

export interface LevelDistribution {
    level_code: string;
    label: string;
    count: number;
}

export interface DetailedStat {
    group_code: string;
    level_code: string;
    count: number;
}

class DashboardService {
    private static instance: DashboardService;

    private constructor() { }

    public static getInstance(): DashboardService {
        if (!DashboardService.instance) {
            DashboardService.instance = new DashboardService();
        }
        return DashboardService.instance;
    }

    async getStats(): Promise<DashboardStats> {
        try {
            const query = `
                SELECT 
                    (SELECT COUNT(*) FROM equipment WHERE deleted_at IS NULL) as totalEquipment,
                    (SELECT COUNT(*) FROM equipment_item WHERE deleted_at IS NULL) as totalItems,
                    (SELECT COUNT(*) FROM equipment_item ei 
                     JOIN equipment_status es ON ei.equipment_status_id = es.id 
                     WHERE es.is_rentable = 1 AND ei.deleted_at IS NULL) as rentableItems,
                    (SELECT COUNT(*) FROM equipment_item ei 
                     JOIN equipment_status es ON ei.equipment_status_id = es.id 
                     WHERE es.is_rentable = 0 AND ei.deleted_at IS NULL) as nonRentableItems,
                    (SELECT COUNT(*) FROM rental_ticket 
                     WHERE completed_date IS NULL AND deleted_at IS NULL) as openTickets
            `;

            const [rows] = await pool.query(query) as any;
            const stats = rows[0];

            return {
                totalEquipment: Number(stats.totalEquipment),
                totalItems: Number(stats.totalItems),
                rentableItems: Number(stats.rentableItems),
                nonRentableItems: Number(stats.nonRentableItems),
                openTickets: Number(stats.openTickets)
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalEquipment: 0,
                totalItems: 0,
                rentableItems: 0,
                nonRentableItems: 0,
                openTickets: 0
            };
        }
    }

    /**
     * Phân bố theo nhóm (MH, TB, VP) từ barcode_stt
     */
    async getGroupDistribution(): Promise<GroupDistribution[]> {
        try {
            const GROUP_LABELS: Record<string, string> = {
                'MH': 'Mô hình',
                'TB': 'Thiết bị',
                'VP': 'Văn phòng',
            };

            const [rows] = await pool.query(`
                SELECT SUBSTRING(barcode, 1, 2) as group_code, COUNT(*) as count
                FROM equipment
                WHERE deleted_at IS NULL AND barcode IS NOT NULL AND LENGTH(barcode) >= 3
                GROUP BY group_code
                ORDER BY count DESC
            `) as any;

            return rows.map((r: any) => ({
                group_code: r.group_code,
                label: GROUP_LABELS[r.group_code] || r.group_code,
                count: Number(r.count),
            }));
        } catch (error) {
            console.error('Error fetching group distribution:', error);
            return [];
        }
    }

    /**
     * Phân bố theo mức độ (H, M, L) từ barcode_stt
     */
    async getLevelDistribution(): Promise<LevelDistribution[]> {
        try {
            const LEVEL_LABELS: Record<string, string> = {
                'H': 'High',
                'M': 'Medium',
                'L': 'Low',
            };

            const [rows] = await pool.query(`
                SELECT SUBSTRING(barcode, 3, 1) as level_code, COUNT(*) as count
                FROM equipment
                WHERE deleted_at IS NULL AND barcode IS NOT NULL AND LENGTH(barcode) >= 3
                GROUP BY level_code
                ORDER BY count DESC
            `) as any;

            return rows.map((r: any) => ({
                level_code: r.level_code,
                label: LEVEL_LABELS[r.level_code] || r.level_code,
                count: Number(r.count),
            }));
        } catch (error) {
            console.error('Error fetching level distribution:', error);
            return [];
        }
    }

    /**
     * Tần suất mượn trả 7 ngày qua
     */
    async getUsageChartData(): Promise<{ name: string; value: number }[]> {
        const query = `
      SELECT 
        DATE_FORMAT(rented_date, '%d/%m') as name, 
        COUNT(*) as value 
      FROM rental_ticket 
      WHERE rented_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND deleted_at IS NULL
      GROUP BY name
      ORDER BY rented_date ASC
    `;
        const [rows] = await pool.query(query);
        return rows as { name: string; value: number }[];
    }

    /**
     * Lấy phân bố chi tiết theo nhóm và mức độ cho từng loại thống kê
     */
    async getDetailedDistribution(type: 'equipment' | 'items' | 'rentable' | 'non-rentable'): Promise<DetailedStat[]> {
        let query = '';
        if (type === 'equipment') {
            query = `
                SELECT 
                    SUBSTRING(barcode, 1, 2) as group_code,
                    SUBSTRING(barcode, 3, 1) as level_code,
                    COUNT(*) as count
                FROM equipment
                WHERE deleted_at IS NULL AND barcode IS NOT NULL AND LENGTH(barcode) >= 3
                GROUP BY group_code, level_code
            `;
        } else if (type === 'items') {
            query = `
                SELECT 
                    SUBSTRING(e.barcode, 1, 2) as group_code,
                    SUBSTRING(e.barcode, 3, 1) as level_code,
                    COUNT(*) as count
                FROM equipment_item ei
                JOIN equipment e ON ei.equipment_id = e.id
                WHERE ei.deleted_at IS NULL AND e.barcode IS NOT NULL AND LENGTH(e.barcode) >= 3
                GROUP BY group_code, level_code
            `;
        } else if (type === 'rentable') {
            query = `
                SELECT 
                    SUBSTRING(e.barcode, 1, 2) as group_code,
                    SUBSTRING(e.barcode, 3, 1) as level_code,
                    COUNT(*) as count
                FROM equipment_item ei
                JOIN equipment e ON ei.equipment_id = e.id
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                WHERE ei.deleted_at IS NULL AND es.is_rentable = 1 AND e.barcode IS NOT NULL AND LENGTH(e.barcode) >= 3
                GROUP BY group_code, level_code
            `;
        } else if (type === 'non-rentable') {
            query = `
                SELECT 
                    SUBSTRING(e.barcode, 1, 2) as group_code,
                    SUBSTRING(e.barcode, 3, 1) as level_code,
                    COUNT(*) as count
                FROM equipment_item ei
                JOIN equipment e ON ei.equipment_id = e.id
                JOIN equipment_status es ON ei.equipment_status_id = es.id
                WHERE ei.deleted_at IS NULL AND es.is_rentable = 0 AND e.barcode IS NOT NULL AND LENGTH(e.barcode) >= 3
                GROUP BY group_code, level_code
            `;
        }

        const [rows] = await pool.query(query) as any;
        return rows as DetailedStat[];
    }
}

export const dashboardService = DashboardService.getInstance();
