'use server';

import { dashboardService } from '@/services/DashboardService';

export async function fetchDetailedItems(type: 'equipment' | 'items' | 'rentable' | 'non-rentable', group_code: string, level_code: string) {
    try {
        const items = await dashboardService.getDetailedItems(type, group_code, level_code);
        return items;
    } catch (error) {
        console.error('Failed to fetch detailed items:', error);
        return [];
    }
}
