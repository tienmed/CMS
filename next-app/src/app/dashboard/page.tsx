import { dashboardService } from '@/services/DashboardService';
import { rentalService } from '@/services/RentalService';
import Link from 'next/link';
import {
    Package,
    CheckCircle2,
    AlertTriangle,
    Activity,
    History,
    Layers,
    PieChart as PieChartIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatCards from '@/components/dashboard/StatCards';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const [stats, groupDist, levelDist] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getGroupDistribution(),
        dashboardService.getLevelDistribution(),
    ]);

    const statCards = [
        { name: 'Tổng mô hình TB', value: stats.totalEquipment, icon: 'package', color: 'text-blue-600', bg: 'bg-blue-50', type: 'equipment' },
        { name: 'Tổng mẫu vật', value: stats.totalItems, icon: 'activity', color: 'text-purple-600', bg: 'bg-purple-50', type: 'items' },
        { name: 'Phiếu mượn mở', value: stats.openTickets, icon: 'history', color: 'text-amber-600', bg: 'bg-amber-50', type: 'open-tickets' },
        { name: 'Sẵn sàng mượn', value: stats.rentableItems, icon: 'check-circle', color: 'text-green-600', bg: 'bg-green-50', type: 'rentable' },
        { name: 'Không khả dụng', value: stats.nonRentableItems, icon: 'alert-triangle', color: 'text-orange-600', bg: 'bg-orange-50', type: 'non-rentable' },
    ];

    return (
        <div className="flex flex-col gap-4 h-full max-h-[calc(100vh-140px)] overflow-hidden font-sans">
            {/* Statistics Row */}
            <div className="shrink-0">
                <StatCards stats={statCards} />
            </div>

            {/* Main Distribution Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
                {/* Group Distribution */}
                <div className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] border border-white/50 shadow-sm flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-500" />
                            Phân bố theo Nhóm
                        </h3>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">Phân loại Barcode</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between py-2">
                        {groupDist.slice(0, 5).map((g) => {
                            const total = groupDist.reduce((sum, x) => sum + x.count, 0);
                            const pct = total > 0 ? ((g.count / total) * 100).toFixed(1) : '0';
                            const colors: Record<string, string> = {
                                'MH': 'bg-blue-500 shadow-blue-100',
                                'TB': 'bg-emerald-500 shadow-emerald-100',
                                'VP': 'bg-violet-500 shadow-violet-100',
                            };
                            return (
                                <Link key={g.group_code} href={`/dashboard/analytics/group/${g.group_code}`} className="block hover:bg-white/50 px-4 py-2 rounded-2xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", colors[g.group_code] || 'bg-slate-400')} />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-700 leading-none">{g.label}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Mã: {g.group_code}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-slate-900 leading-none">{g.count.toLocaleString()}</span>
                                            <span className="text-[9px] font-bold text-blue-500">{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100/50 rounded-full h-1 overflow-hidden border border-slate-50">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", colors[g.group_code] || 'bg-slate-400')}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Level Distribution */}
                <div className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] border border-white/50 shadow-sm flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-purple-500" />
                            Mức độ quan trọng
                        </h3>
                        <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-widest border border-slate-200">Chỉ số H/M/L</span>
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col justify-between py-2">
                        {levelDist.map((l) => {
                            const total = levelDist.reduce((sum, x) => sum + x.count, 0);
                            const pct = total > 0 ? ((l.count / total) * 100).toFixed(1) : '0';
                            const styles: Record<string, { bg: string; text: string; ring: string; iconBg: string; bar: string }> = {
                                'H': { bg: 'bg-red-50/20', text: 'text-red-600', ring: 'border-red-100/30', iconBg: 'bg-red-600', bar: 'bg-red-500 shadow-red-100' },
                                'M': { bg: 'bg-amber-50/20', text: 'text-amber-600', ring: 'border-amber-100/30', iconBg: 'bg-amber-500', bar: 'bg-amber-500 shadow-amber-100' },
                                'L': { bg: 'bg-emerald-50/20', text: 'text-emerald-600', ring: 'border-emerald-100/30', iconBg: 'bg-emerald-500', bar: 'bg-emerald-500 shadow-emerald-100' },
                            };
                            const s = styles[l.level_code] || { bg: 'bg-slate-50', text: 'text-slate-600', ring: 'border-slate-100', iconBg: 'bg-slate-500', bar: 'bg-slate-500' };
                            return (
                                <Link key={l.level_code} href={`/dashboard/analytics/level/${l.level_code}`} className={cn("p-4 rounded-[2rem] border transition-all hover:bg-white cursor-pointer group hover:shadow-lg hover:shadow-slate-200/30", s.bg, s.ring)}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md", s.iconBg)}>{l.level_code}</div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{l.label}</p>
                                                <p className={cn("text-xl font-black leading-none", s.text)}>{l.count.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border border-current opacity-60", s.text)}>{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100/50 rounded-full h-1 overflow-hidden border border-slate-50">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", s.bar)}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
