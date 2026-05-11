import { NextResponse } from 'next/server';
import { notificationService } from '@/services/NotificationService';
import { successResponse, errorResponse } from '@/lib/response';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const overdue = await notificationService.getOverdueNotifications();
        
        // Có thể bổ sung thêm các loại thông báo khác ở đây trong tương lai
        const allNotifications = [
            ...overdue
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        return successResponse({
            notifications: allNotifications,
            unreadCount: allNotifications.length
        });
    } catch (error: any) {
        console.error('Notification API Error:', error);
        return errorResponse(error.message || 'Internal Server Error', 500);
    }
}
