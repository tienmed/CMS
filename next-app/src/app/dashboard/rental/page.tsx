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
        <div className="space-y-12 animate-in fade-in duration-700 h-full flex flex-col min-h-0 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-border-light dark:border-white/5 pb-12">
                <div>
                    <h1 className="headline-hero text-navy uppercase leading-none">Mượn / Trả</h1>
                    <p className="text-[11px] font-black text-gray-text mt-4 uppercase tracking-[0.3em] opacity-60">Logistics Node • Handover Protocols</p>
                </div>
                <CreateRentalModal
                    departments={departments}
                    rentableItems={rentableItems}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 flex-1 min-h-0">
                {/* Status Column */}
                <div className="lg:col-span-1">
                    <div className="bento-card group h-fit">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                <Clock className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-gray-text uppercase tracking-widest leading-tight"> Active<br />Tickets</h3>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-7xl font-black text-navy tracking-tighter text-number leading-none">
                                {activeTickets.length}
                            </span>
                            <span className="text-xs font-black text-gray-text uppercase tracking-[0.2em]">Queue</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-text uppercase tracking-[0.3em] mt-8 opacity-60">System handovers in progress</p>
                        <div className="mt-10 pt-10 border-t border-border-light dark:border-white/5 flex items-center justify-between">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-2xl bg-background dark:bg-white/5 border-2 border-white dark:border-black shadow-pro flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Realtime</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 flex flex-col min-h-0">
                    <ActiveTicketsTable initialTickets={activeTickets} />
                </div>
            </div>
        </div>
    );
}
