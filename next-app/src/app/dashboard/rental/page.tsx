import { rentalService } from '@/services/RentalService';
import { equipmentService } from '@/services/EquipmentService';
import { departmentService } from '@/services/DepartmentService';
import { ClipboardList, Plus, Clock, CheckCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateRentalModal from '@/components/rental/CreateRentalModal';
import ActiveTicketsTable from '@/components/rental/ActiveTicketsTable';

export const dynamic = 'force-dynamic';

export default async function RentalPage() {
    const [activeTickets, departments, rentableItems] = await Promise.all([
        rentalService.getActiveTickets(),
        departmentService.getAllDepartments(),
        equipmentService.getRentableItems(),
    ]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Mượn / Trả</h1>
                    <p className="text-sm text-slate-500 mt-1">Theo dõi lộ trình và trạng thái sử dụng thiết bị</p>
                </div>
                <CreateRentalModal
                    departments={departments}
                    rentableItems={rentableItems}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Stats Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            Đang mượn
                        </h3>
                        <p className="text-4xl font-black text-slate-900">{activeTickets.length}</p>
                        <p className="text-sm text-slate-400 mt-2">Phiếu chưa hoàn tất</p>
                    </div>
                </div>

                {/* Active Tickets List */}
                <div className="lg:col-span-3">
                    <ActiveTicketsTable initialTickets={activeTickets} />
                </div>
            </div>
        </div>
    );
}
