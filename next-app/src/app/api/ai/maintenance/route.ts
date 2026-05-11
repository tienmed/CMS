import { NextResponse } from 'next/server';
import { maintenanceService } from '@/services/MaintenanceService';
import { aiService } from '@/services/AIService';
import { errorResponse, successResponse } from '@/lib/response';

export async function GET() {
    try {
        // 1. Lấy dữ liệu dự báo sức khỏe thiết bị
        const predictions = await maintenanceService.getMaintenancePredictions();
        
        // 2. Lấy nhận định từ AI cho các thiết bị rủi ro
        const aiInsight = await aiService.getMaintenanceInsight(predictions);

        return successResponse({
            predictions,
            aiInsight,
            totalCritical: predictions.filter(p => p.health_score < 60).length
        });
    } catch (error: any) {
        console.error('Maintenance API Error:', error);
        return errorResponse(error.message || 'Internal Server Error', 500);
    }
}
