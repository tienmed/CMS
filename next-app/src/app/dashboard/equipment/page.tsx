import { equipmentService } from '@/services/EquipmentService';
import { Package, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EquipmentPage() {
    const equipment = await equipmentService.getAllEquipment();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <h1 className="headline-hero text-navy uppercase leading-none">Kho thiết bị</h1>
                    <p className="text-[11px] font-black text-gray-text mt-4 uppercase tracking-[0.3em] opacity-60">Inventory Backbone • Operational Node</p>
                </div>
                <button className="bg-brand-primary text-white h-16 px-10 rounded-[2rem] font-black text-sm hover:scale-105 transition-all flex items-center gap-3 shadow-pro active:scale-95 uppercase tracking-widest group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    Thêm thiết bị mới
                </button>
            </div>

            {/* Filters & Search - Bento Style */}
            <div className="bento-card !p-6 flex flex-wrap gap-4 items-center mb-8">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="w-5 h-5 text-gray-text absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, mã barcode..."
                        className="w-full pl-16 pr-8 h-14 rounded-2xl bg-background border border-transparent focus:bg-white focus:border-brand-primary/20 focus:ring-8 focus:ring-brand-primary/5 transition-all text-sm font-bold placeholder:text-gray-text/40 text-navy"
                    />
                </div>
            </div>

            {/* Equipment Table - Premium Bento Table */}
            <div className="bento-card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/20 dark:bg-white/5">
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em]">Tên thiết bị</th>
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em]">Barcode Identifier</th>
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em]">Annotation</th>
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em] text-right">System Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-white/5">
                            {equipment.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/20 text-brand-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <span className="block font-black text-navy text-lg tracking-tight leading-tight">{item.name}</span>
                                                <span className="text-[10px] font-black text-gray-text uppercase tracking-widest mt-1">EID: {item.id.toString().padStart(4, '0')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10">
                                        <span className="text-xs font-black text-navy bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800 font-mono tracking-wider">{item.barcode || '---'}</span>
                                    </td>
                                    <td className="px-10 py-10 text-xs font-bold text-gray-text max-w-xs truncate italic opacity-60">
                                        {item.note || '---'}
                                    </td>
                                    <td className="px-10 py-10 text-right">
                                        <Link
                                            href={`/dashboard/equipment/${item.id}`}
                                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-background dark:bg-white/5 text-xs font-black text-navy hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest shadow-sm hover:shadow-pro whitespace-nowrap"
                                        >
                                            View Matrix
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {equipment.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Không có dữ liệu thiết bị</p>
                    </div>
                )}
            </div>
        </div>
    );
}
