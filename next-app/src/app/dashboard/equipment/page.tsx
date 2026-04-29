import EquipmentTableClient from '@/components/equipment/EquipmentTableClient';
import { equipmentService } from '@/services/EquipmentService';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EquipmentPage() {
    const equipment = await equipmentService.getAllEquipment();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <h1 className="headline-hero text-navy uppercase leading-none">Kho thiết bị</h1>
                    <p className="text-[11px] font-black text-gray-text mt-4 uppercase tracking-[0.3em] opacity-60">Quản lý kho • Theo dõi vận hành</p>
                </div>
                <button className="bg-brand-primary text-white h-16 px-10 rounded-[2rem] font-black text-sm hover:scale-105 transition-all flex items-center gap-3 shadow-pro active:scale-95 uppercase tracking-widest group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    Thêm thiết bị mới
                </button>
            </div>

            <EquipmentTableClient equipment={equipment} />
        </div>
    );
}
