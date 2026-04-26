import pool from '@/lib/db';

export interface DashboardStats {
    totalEquipment: number;
    totalItems: number;
    rentableItems: number;
    nonRentableItems: number;
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
        const [[{ totalEquipment }]] = await pool.query('SELECT COUNT(*) as totalEquipment FROM equipment WHERE deleted_at IS NULL') as any;
        const [[{ totalItems }]] = await pool.query('SELECT COUNT(*) as totalItems FROM equipment_item WHERE deleted_at IS NULL') as any;
        const [[{ rentableItems }]] = await pool.query(`
            SELECT COUNT(*) as rentableItems FROM equipment_item ei
            JOIN equipment_status es ON ei.equipment_status_id = es.id
            WHERE es.is_rentable = 1 AND ei.deleted_at IS NULL
        `) as any;
        const [[{ nonRentableItems }]] = await pool.query(`
            SELECT COUNT(*) as nonRentableItems FROM equipment_item ei
            JOIN equipment_status es ON ei.equipment_status_id = es.id
            WHERE es.is_rentable = 0 AND ei.deleted_at IS NULL
        `) as any;

        return { totalEquipment, totalItems, rentableItems, nonRentableItems };
    }

    /**
     * Phân bố theo nhóm (MH, TB, VP) từ barcode_stt
     */
    async getGroupDistribution(): Promise<GroupDistribution[]> {
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
    }

    /**
     * Phân bố theo mức độ (H, M, L) từ barcode_stt
     */
    async getLevelDistribution(): Promise<LevelDistribution[]> {
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
}

export const dashboardService = DashboardService.getInstance();
