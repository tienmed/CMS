import pool from '@/lib/db';

export interface Notification {
    id: string;
    type: 'overdue' | 'maintenance' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    data?: any;
}

class NotificationService {
    private static instance: NotificationService;
    
    private constructor() {}

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    /**
     * Kiểm tra các thiết bị mượn quá hạn
     */
    async getOverdueNotifications(): Promise<Notification[]> {
        const query = `
            SELECT 
                rt.id as ticket_id,
                rt.ticket_no,
                rt.rented_full_name,
                rt.due_date,
                COUNT(rd.id) as item_count
            FROM rental_ticket rt
            JOIN rental_detail rd ON rt.id = rd.rental_ticket_id
            WHERE rt.completed_date IS NULL 
                AND rt.due_date < NOW()
                AND rd.returned_at IS NULL
                AND rt.deleted_at IS NULL
            GROUP BY rt.id
            ORDER BY rt.due_date ASC
        `;

        const [rows] = await pool.query(query) as any;
        
        return rows.map((row: any) => ({
            id: `overdue-${row.ticket_id}`,
            type: 'overdue',
            title: 'Thiết bị quá hạn',
            message: `${row.rented_full_name} đang mượn ${row.item_count} thiết bị quá hạn từ ngày ${new Date(row.due_date).toLocaleDateString('vi-VN')}`,
            timestamp: new Date(row.due_date),
            data: { ticketId: row.ticket_id, ticketNo: row.ticket_no }
        }));
    }
}

export const notificationService = NotificationService.getInstance();
