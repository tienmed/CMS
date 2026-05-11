import pool from '@/lib/db';

export interface MaintenancePrediction {
    equipment_item_id: number;
    barcode_stt: string;
    equipment_name: string;
    usage_count: number;
    total_days: number;
    health_score: number; // 0 to 100
    recommendation: string;
}

class MaintenanceService {
    private static instance: MaintenanceService;
    
    private constructor() {}

    public static getInstance(): MaintenanceService {
        if (!MaintenanceService.instance) {
            MaintenanceService.instance = new MaintenanceService();
        }
        return MaintenanceService.instance;
    }

    /**
     * Tính toán dự đoán bảo trì cho tất cả thiết bị
     * Thuật toán: 
     * - Mỗi lần mượn giảm 2 điểm sức khỏe.
     * - Mỗi ngày mượn giảm 1 điểm sức khỏe.
     * - Điểm mặc định là 100.
     */
    async getMaintenancePredictions(): Promise<MaintenancePrediction[]> {
        const query = `
            SELECT 
                ei.id as equipment_item_id,
                ei.barcode_stt,
                e.name as equipment_name,
                COUNT(rd.id) as usage_count,
                SUM(DATEDIFF(IFNULL(rd.returned_at, NOW()), rd.rented_at)) as total_days
            FROM equipment_item ei
            JOIN equipment e ON ei.equipment_id = e.id
            LEFT JOIN rental_detail rd ON ei.id = rd.equipment_item_id
            WHERE ei.deleted_at IS NULL
            GROUP BY ei.id, e.name
            HAVING usage_count > 0
            ORDER BY total_days DESC
        `;

        const [rows] = await pool.query(query) as any;
        
        return rows.map((row: any) => {
            const usageCount = Number(row.usage_count);
            const totalDays = Number(row.total_days || 0);
            
            // Tính toán health score đơn giản
            let healthScore = 100 - (usageCount * 2) - (totalDays * 0.5);
            healthScore = Math.max(0, Math.min(100, healthScore));

            let recommendation = 'Tốt';
            if (healthScore < 40) recommendation = 'Cần bảo trì ngay lập tức';
            else if (healthScore < 70) recommendation = 'Nên kiểm tra định kỳ';

            return {
                equipment_item_id: row.equipment_item_id,
                barcode_stt: row.barcode_stt,
                equipment_name: row.equipment_name,
                usage_count: usageCount,
                total_days: totalDays,
                health_score: Math.round(healthScore),
                recommendation
            };
        });
    }
}

export const maintenanceService = MaintenanceService.getInstance();
