import pool from '@/lib/db';

export interface EquipmentWithUsage {
    id: number;
    name: string;
    barcode: string;
    group_code: string;
    level_code: string;
    model_code: string;
    item_count: number;
    rental_count: number;
    import_year: number | null;
    usage_per_year: number;
}

export interface AnalyticsMetrics {
    totalModels: number;
    totalItems: number;
    totalRentals: number;
    avgUsagePerYear: number;
}

export interface GroupedEquipment {
    key: string;
    label: string;
    count: number;
    items: EquipmentWithUsage[];
}

const GROUP_LABELS: Record<string, string> = {
    'MH': 'Mô hình',
    'TB': 'Thiết bị',
    'VP': 'Văn phòng',
};

const LEVEL_LABELS: Record<string, string> = {
    'H': 'High',
    'M': 'Medium',
    'L': 'Low',
};

class AnalyticsService {
    private static instance: AnalyticsService;
    private constructor() { }

    public static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    /**
     * Get equipment list for a specific group (MH/TB/VP), grouped by level
     */
    async getEquipmentByGroup(groupCode: string): Promise<{ metrics: AnalyticsMetrics; groups: GroupedEquipment[] }> {
        const currentYear = new Date().getFullYear();

        const [rows] = await pool.query(`
            SELECT 
                e.id, e.name, e.barcode, e.import_date,
                SUBSTRING(e.barcode, 1, 2) as group_code,
                SUBSTRING(e.barcode, 3, 1) as level_code,
                SUBSTRING(e.barcode, 4, 3) as model_code,
                (SELECT COUNT(*) FROM equipment_item ei WHERE ei.equipment_id = e.id AND ei.deleted_at IS NULL) as item_count,
                (SELECT COUNT(*) FROM rental_detail rd 
                    JOIN equipment_item ei2 ON rd.equipment_item_id = ei2.id 
                    WHERE ei2.equipment_id = e.id AND ei2.deleted_at IS NULL) as rental_count
            FROM equipment e
            WHERE e.deleted_at IS NULL 
                AND e.barcode IS NOT NULL 
                AND SUBSTRING(e.barcode, 1, 2) = ?
            ORDER BY rental_count DESC
        `, [groupCode]) as any;

        const items: EquipmentWithUsage[] = rows.map((r: any) => {
            const importYear = r.import_date ? new Date(r.import_date).getFullYear() : null;
            const yearsInService = importYear ? Math.max(1, currentYear - importYear) : 1;
            return {
                ...r,
                import_year: importYear,
                item_count: Number(r.item_count),
                rental_count: Number(r.rental_count),
                usage_per_year: Number(r.rental_count) / yearsInService,
            };
        });

        // Group by level
        const levelGroups: Record<string, EquipmentWithUsage[]> = {};
        for (const item of items) {
            const key = item.level_code;
            if (!levelGroups[key]) levelGroups[key] = [];
            levelGroups[key].push(item);
        }

        const groups: GroupedEquipment[] = Object.entries(levelGroups)
            .map(([key, list]) => ({
                key,
                label: `${LEVEL_LABELS[key] || key} (${key})`,
                count: list.length,
                items: list,
            }))
            .sort((a, b) => b.count - a.count);

        const totalRentals = items.reduce((s, i) => s + i.rental_count, 0);
        const totalItems = items.reduce((s, i) => s + i.item_count, 0);
        const avgUsage = items.length > 0
            ? items.reduce((s, i) => s + i.usage_per_year, 0) / items.length
            : 0;

        return {
            metrics: {
                totalModels: items.length,
                totalItems,
                totalRentals,
                avgUsagePerYear: Math.round(avgUsage * 10) / 10,
            },
            groups,
        };
    }

    /**
     * Get equipment list for a specific level (H/M/L), grouped by group
     */
    async getEquipmentByLevel(levelCode: string): Promise<{ metrics: AnalyticsMetrics; groups: GroupedEquipment[] }> {
        const currentYear = new Date().getFullYear();

        const [rows] = await pool.query(`
            SELECT 
                e.id, e.name, e.barcode, e.import_date,
                SUBSTRING(e.barcode, 1, 2) as group_code,
                SUBSTRING(e.barcode, 3, 1) as level_code,
                SUBSTRING(e.barcode, 4, 3) as model_code,
                (SELECT COUNT(*) FROM equipment_item ei WHERE ei.equipment_id = e.id AND ei.deleted_at IS NULL) as item_count,
                (SELECT COUNT(*) FROM rental_detail rd 
                    JOIN equipment_item ei2 ON rd.equipment_item_id = ei2.id 
                    WHERE ei2.equipment_id = e.id AND ei2.deleted_at IS NULL) as rental_count
            FROM equipment e
            WHERE e.deleted_at IS NULL 
                AND e.barcode IS NOT NULL 
                AND SUBSTRING(e.barcode, 3, 1) = ?
            ORDER BY rental_count DESC
        `, [levelCode]) as any;

        const items: EquipmentWithUsage[] = rows.map((r: any) => {
            const importYear = r.import_date ? new Date(r.import_date).getFullYear() : null;
            const yearsInService = importYear ? Math.max(1, currentYear - importYear) : 1;
            return {
                ...r,
                import_year: importYear,
                item_count: Number(r.item_count),
                rental_count: Number(r.rental_count),
                usage_per_year: Number(r.rental_count) / yearsInService,
            };
        });

        // Group by group_code
        const groupGroups: Record<string, EquipmentWithUsage[]> = {};
        for (const item of items) {
            const key = item.group_code;
            if (!groupGroups[key]) groupGroups[key] = [];
            groupGroups[key].push(item);
        }

        const groups: GroupedEquipment[] = Object.entries(groupGroups)
            .map(([key, list]) => ({
                key,
                label: `${GROUP_LABELS[key] || key} (${key})`,
                count: list.length,
                items: list,
            }))
            .sort((a, b) => b.count - a.count);

        const totalRentals = items.reduce((s, i) => s + i.rental_count, 0);
        const totalItems = items.reduce((s, i) => s + i.item_count, 0);
        const avgUsage = items.length > 0
            ? items.reduce((s, i) => s + i.usage_per_year, 0) / items.length
            : 0;

        return {
            metrics: {
                totalModels: items.length,
                totalItems,
                totalRentals,
                avgUsagePerYear: Math.round(avgUsage * 10) / 10,
            },
            groups,
        };
    }
}

export const analyticsService = AnalyticsService.getInstance();
