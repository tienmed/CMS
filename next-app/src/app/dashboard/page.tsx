import { dashboardService } from '@/services/DashboardService';
import { rentalService } from '@/services/RentalService';
import Link from 'next/link';
import {
    Package,
    CheckCircle2,
    AlertTriangle,
    Activity,
    History,
    BarChart3,
    PieChart as PieChartIcon,
    Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UsageChart from '@/components/dashboard/UsageChart';
import StatCards from '@/components/dashboard/StatCards';
import RecentActivity from '@/components/dashboard/RecentActivity';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const [stats, history, chartData, groupDist, levelDist] = await Promise.all([
        dashboardService.getStats(),
        rentalService.getUsageHistory(),
        dashboardService.getUsageChartData(),
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
        <div className="space-y-8">
            {/* Statistics Grid */}
            <StatCards stats={statCards} />

            {/* Barcode Analytics: Group & Level Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Group Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-500" />
                            Phân bố theo Nhóm
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Barcode</span>
                    </div>
                    <div className="space-y-4">
                        {groupDist.map((g) => {
                            const total = groupDist.reduce((sum, x) => sum + x.count, 0);
                            const pct = total > 0 ? ((g.count / total) * 100).toFixed(1) : '0';
                            const colors: Record<string, string> = {
                                'MH': 'bg-blue-500',
                                'TB': 'bg-emerald-500',
                                'VP': 'bg-violet-500',
                            };
                            return (
                                <Link key={g.group_code} href={`/dashboard/analytics/group/${g.group_code}`} className="block hover:bg-slate-50/80 rounded-xl p-2 -mx-2 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-3 h-3 rounded-full", colors[g.group_code] || 'bg-slate-400')} />
                                            <span className="text-sm font-bold text-slate-700">{g.label}</span>
                                            <span className="text-xs font-mono text-slate-400">({g.group_code})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900">{g.count.toLocaleString()}</span>
                                            <span className="text-xs font-semibold text-slate-400">{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                                        <div
                                            className={cn("h-2.5 rounded-full transition-all", colors[g.group_code] || 'bg-slate-400')}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Level Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-purple-500" />
                            Phân bố theo Mức độ
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Level</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {levelDist.map((l) => {
                            const total = levelDist.reduce((sum, x) => sum + x.count, 0);
                            const pct = total > 0 ? ((l.count / total) * 100).toFixed(1) : '0';
                            const styles: Record<string, { bg: string; text: string; ring: string }> = {
                                'H': { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
                                'M': { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
                                'L': { bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-200' },
                            };
                            const s = styles[l.level_code] || { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-200' };
                            return (
                                <Link key={l.level_code} href={`/dashboard/analytics/level/${l.level_code}`} className={cn("p-4 rounded-xl text-center ring-1 hover:shadow-md transition-all cursor-pointer", s.bg, s.ring)}>
                                    <div className={cn("text-2xl font-bold mb-1", s.text)}>{l.count.toLocaleString()}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase">{l.label} ({l.level_code})</div>
                                    <div className="text-xs text-slate-400 mt-1">{pct}%</div>
                                </Link>
                            );
                        })}
                    </div>
                    {/* Level bar summary */}
                    <div className="flex rounded-full overflow-hidden h-3">
                        {levelDist.map((l) => {
                            const total = levelDist.reduce((sum, x) => sum + x.count, 0);
                            const pct = total > 0 ? (l.count / total) * 100 : 0;
                            const colors: Record<string, string> = { 'H': 'bg-red-500', 'M': 'bg-amber-400', 'L': 'bg-green-500' };
                            return <div key={l.level_code} className={cn(colors[l.level_code] || 'bg-slate-300')} style={{ width: `${pct}%` }} />;
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                            Tần suất mượn trả (7 ngày qua)
                        </h3>
                    </div>
                    <UsageChart data={chartData} />
                </div>

                {/* Quick Info/Links */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col">
                        <h3 className="text-xl font-bold mb-2">Quét mã QR</h3>
                        <p className="text-blue-100 text-sm mb-4 leading-relaxed">Sử dụng camera hoặc máy quét để nhập/xuất thiết bị nhanh chóng khỏi kho.</p>
                        <div className="bg-white/10 rounded-xl p-3 mb-4 backdrop-blur-sm">
                            <p className="text-xs text-blue-200 font-mono mb-1">Ví dụ QR:</p>
                            <p className="text-sm font-mono font-bold">MHH0451401-01</p>
                            <p className="text-xs text-blue-200 mt-1">MH=Mô hình | H=High | 045=Mã | 14=SL | 01=STT</p>
                        </div>
                        <div className="mt-auto">
                            <button className="bg-white text-blue-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors w-full flex items-center justify-center gap-2">
                                <Package className="w-4 h-4" />
                                Bắt đầu quét ngay
                            </button>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                        <Package className="w-48 h-48" />
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="lg:col-span-3">
                    <RecentActivity history={history} />
                </div>
            </div>
        </div>
    );
}
