export interface Equipment {
    id: number;
    name: string;
    barcode: string;
    note?: string;
    url?: string;
    type_id: number;
    warranty_due_date?: Date;
    import_date?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    item_count?: number;
}

export interface EquipmentItem {
    id: number;
    barcode_stt: string;
    stt: number;
    note?: string;
    equipment_id: number;
    equipment_status_id: number;
    condition_id: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    // Hồ sơ mở rộng từ join
    status_is_rentable?: boolean | number;
    condition_is_rentable?: boolean | number;
    condition_name?: string;
    condition_reject_msg?: string;
    usage_count?: number;
    is_recommended?: boolean;
    equipment_name?: string;
    status_name?: string;
}
