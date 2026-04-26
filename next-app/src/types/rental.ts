export interface RentalTicket {
    id: number;
    ticket_no: string;
    note?: string;
    due_date: Date;
    rented_date: Date;
    completed_date?: Date;
    created_by: number;
    rented_full_name: string;
    rented_by: number; // department_id
    created_at?: Date;
    updated_at?: Date;
}

export interface RentalDetail {
    id: number;
    note?: string;
    due_date: Date;
    equipment_item_id: number;
    rental_ticket_id: number;
    condition_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface UsageHistory {
    id: number; // ticket id
    date: Date;
    ticket_no: string;
    department_name: string;
    renter: string;
    note?: string;
    status: 'rented' | 'returned';
    items: {
        id?: number;
        detail_id?: number;
        equipment_name: string;
        barcode: string;
        barcode_stt: string;
        status: string;
        returned_at?: Date | null;
        due_date?: Date | null;
    }[];
}
