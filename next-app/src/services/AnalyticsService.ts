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

    private async getEquipmentAnalytics(
        whereClause: string,
        whereValue: string,
        groupByKey: 'group_code' | 'level_code',
    ): Promise<{ metrics: AnalyticsMetrics; groups: GroupedEquipment[] }> {
        const currentYear = new Date().getFullYear();

        const [rows] = await pool.query(`
            WITH item_counts AS (
                SELECT equipment_id, COUNT(*) as item_count
                FROM equipment_item
                WHERE deleted_at IS NULL
                GROUP BY equipment_id
            ),
            rental_counts AS (
                SELECT ei.equipment_id, COUNT(*) as rental_count
                FROM rental_detail rd
                JOIN equipment_item ei ON rd.equipment_item_id = ei.id
                WHERE ei.deleted_at IS NULL
                GROUP BY ei.equipment_id
            )
            SELECT 
                e.id, e.name, e.barcode, e.import_date,
                SUBSTRING(e.barcode, 1, 2) as group_code,
                SUBSTRING(e.barcode, 3, 1) as level_code,
                SUBSTRING(e.barcode, 4, 3) as model_code,
                COALESCE(ic.item_count, 0) as item_count,
                COALESCE(rc.rental_count, 0) as rental_count
            FROM equipment e
            LEFT JOIN item_counts ic ON ic.equipment_id = e.id
            LEFT JOIN rental_counts rc ON rc.equipment_id = e.id
            WHERE e.deleted_at IS NULL 
                AND e.barcode IS NOT NULL 
                AND ${whereClause} = ?
            ORDER BY rental_count DESC
        `, [whereValue]) as any;

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

        const grouped: Record<string, EquipmentWithUsage[]> = {};
        for (const item of items) {
            const key = item[groupByKey];
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(item);
        }

        const groups: GroupedEquipment[] = Object.entries(grouped)
            .map(([key, list]) => ({
                key,
                label: groupByKey === 'group_code'
                    ? `${GROUP_LABELS[key] || key} (${key})`
                    : `${LEVEL_LABELS[key] || key} (${key})`,
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
     * Get equipment list for a specific group (MH/TB/VP), grouped by level
     */
    async getEquipmentByGroup(groupCode: string): Promise<{ metrics: AnalyticsMetrics; groups: GroupedEquipment[] }> {
        return this.getEquipmentAnalytics('SUBSTRING(e.barcode, 1, 2)', groupCode, 'level_code');
    }

    /**
     * Get equipment list for a specific level (H/M/L), grouped by group
     */
    async getEquipmentByLevel(levelCode: string): Promise<{ metrics: AnalyticsMetrics; groups: GroupedEquipment[] }> {
        return this.getEquipmentAnalytics('SUBSTRING(e.barcode, 3, 1)', levelCode, 'group_code');
    }
}

export const analyticsService = AnalyticsService.getInstance();
