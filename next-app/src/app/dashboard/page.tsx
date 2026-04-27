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
import { testConnection } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const dbStatus = await testConnection();

    const [stats, groupDist, levelDist] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getGroupDistribution(),
        dashboardService.getLevelDistribution(),
    ]);

    const statCards = [
        { name: 'Tổng mô hình TB', value: stats.totalEquipment, icon: 'package', tone: 'equipment', type: 'equipment' },
        { name: 'Tổng mẫu vật', value: stats.totalItems, icon: 'activity', tone: 'items', type: 'items' },
        { name: 'Phiếu mượn mở', value: stats.openTickets, icon: 'history', tone: 'open-tickets', type: 'open-tickets' },
        { name: 'Sẵn sàng mượn', value: stats.rentableItems, icon: 'check-circle', tone: 'rentable', type: 'rentable' },
        { name: 'Không khả dụng', value: stats.nonRentableItems, icon: 'alert-triangle', tone: 'non-rentable', type: 'non-rentable' },
    ];

    return (
        <div className="flex flex-col gap-4 h-full max-h-[calc(100vh-140px)] overflow-hidden font-sans">
            {/* Database Status Warning */}
            {!dbStatus.success && (
                <div className="shrink-0 bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm animate-pulse">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 text-sm">
                        <p className="font-bold">Lỗi kết nối Cơ sở dữ liệu!</p>
                        <p className="opacity-80">Vui lòng kiểm tra biến môi trường MYSQL_HOST, USER, PASS, DB trên Vercel. Lỗi: {dbStatus.error}</p>
                    </div>
                    <Link href="https://vercel.com/dashboard" target="_blank" className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-colors">
                        Mở Vercel
                    </Link>
                </div>
            )}

            {/* Statistics Row */}
            <div className="shrink-0">
                <StatCards stats={statCards} />
            </div>

            {/* Main Distribution Grids - Bento Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Group Distribution - Larger Card */}
                <div className="lg:col-span-2 bento-card brand-surface-gradient flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-12 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl brand-soft-surface dashboard-group-icon flex items-center justify-center">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-navy text-2xl tracking-tighter uppercase font-sans">Phân bổ Nhóm</h3>
                                <p className="text-[10px] font-bold text-gray-text uppercase tracking-widest mt-1 italic">Structural Category Map</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                        {groupDist.map((g) => {
                            const total = groupDist.reduce((sum, x) => sum + x.count, 0);
                            const pct = total > 0 ? ((g.count / total) * 100).toFixed(1) : '0';
                            const colors: Record<string, string> = {

                            };
                            return (
                                <Link key={g.group_code} href={`/dashboard/analytics/group/${g.group_code}`} className="block hover:bg-slate-50 p-4 rounded-2xl transition-all group border border-transparent">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", colors[g.group_code] || 'bg-slate-300')} />
                                            <span className="text-sm font-bold text-gray-text">{g.label}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm font-black text-navy">{g.count}</span>
                                            <span className="text-[10px] font-bold text-gray-text">{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-50 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", colors[g.group_code] || 'bg-slate-300')}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Level Distribution - Vertical Bento Card */}
                <div className="bento-card brand-surface-gradient flex flex-col min-h-[400px]">
                    <div className="flex items-center gap-4 mb-12 shrink-0">
                        <div className="w-12 h-12 rounded-2xl brand-soft-surface dashboard-level-icon flex items-center justify-center">
                            <PieChartIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-navy text-2xl tracking-tighter uppercase">Mức độ</h3>
                            <p className="text-[10px] font-bold text-gray-text uppercase tracking-widest mt-1 italic">Priority Indices</p>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 space-y-8 flex flex-col justify-center">
                        {levelDist.map((l) => {
                            const total = levelDist.reduce((sum, x) => sum + x.count, 0);
                            const pct = total > 0 ? ((l.count / total) * 100).toFixed(1) : '0';
                            const styles: Record<string, { color: string; bg: string; dot: string }> = {

                            };
                            const s = styles[l.level_code] || { color: 'text-slate-400', bg: 'bg-slate-400', dot: 'bg-slate-400' };
                            return (
                                <Link key={l.level_code} href={`/dashboard/analytics/level/${l.level_code}`} className="block group">
                                    <div className="flex items-end justify-between mb-3">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                                                <span className="text-[11px] font-black text-gray-text uppercase tracking-[0.2em]">{l.label}</span>
                                            </div>
                                            <span className={cn("text-5xl font-black tracking-tighter text-number leading-none", s.color)}>{l.count.toLocaleString()}</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-text/40">{pct}%</span>
                                    </div>
                                    <div className="w-full bg-background dark:bg-white/5 rounded-full h-2 overflow-hidden shadow-inner">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", s.bg)}
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
