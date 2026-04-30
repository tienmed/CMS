import { dashboardService } from '@/services/DashboardService';
import { Package, Activity, CheckCircle2, AlertTriangle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import AnalyticsCell from '@/components/analytics/AnalyticsCell';

export const dynamic = 'force-dynamic';

const TYPE_MAP: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    'equipment': { label: 'Tổng chủng loại Mô hình Thiết bị', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    'items': { label: 'Tổng số lượng', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
    'rentable': { label: 'Sẵn sàng cho mượn', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    'non-rentable': { label: 'Không khả dụng', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
};

const GROUP_LABELS: Record<string, string> = {
    'MH': 'Mô hình',
    'TB': 'Thiết bị',
    'VP': 'Văn phòng',
};

export default async function DetailedAnalyticsPage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = await params;
    const config = TYPE_MAP[type];

    if (!config) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-800">Không tìm thấy loại dữ liệu</h1>
                <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">Quay lại Dashboard</Link>
            </div>
        );
    }

    const data = await dashboardService.getDetailedDistribution(type as any);
    const stats = await dashboardService.getStats();

    // Get total based on type
    const totalMap: Record<string, number> = {
        'equipment': stats.totalEquipment,
        'items': stats.totalItems,
        'rentable': stats.rentableItems,
        'non-rentable': stats.nonRentableItems,
    };
    const totalCount = totalMap[type] || 0;

    const matrix: Record<string, Record<string, number>> = {};
    const groups = Array.from(new Set(data.map(d => d.group_code))).sort();
    const levels = ['H', 'M', 'L'];

    groups.forEach(g => {
        matrix[g] = {};
        levels.forEach(l => {
            matrix[g][l] = 0;
        });
    });

    data.forEach(d => {
        if (matrix[d.group_code]) {
            matrix[d.group_code][d.level_code] = d.count;
        }
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 h-full flex flex-col min-h-0 overflow-hidden">
            {/* Header Area - Pro Max Style */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 shrink-0 border-b border-border-light dark:border-white/5 pb-12">
                <div className="flex items-end gap-8">
                    <Link
                        href="/dashboard"
                        className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-transparent flex items-center justify-center text-navy opacity-40 hover:opacity-100 hover:scale-110 active:scale-95 transition-all shadow-pro group mb-1"
                    >
                        <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="headline-hero text-navy uppercase leading-none">{config.label}</h1>
                        <p className="text-[11px] font-black text-gray-text mt-4 uppercase tracking-[0.3em] opacity-60">Distribution Matrix • Operational Intelligence</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-gray-text uppercase tracking-[0.3em] opacity-40">Nodal Aggregation</span>
                    <div className="flex items-baseline gap-3">
                        <span className="text-7xl font-black text-navy tracking-tighter text-number leading-none">
                            {totalCount.toLocaleString()}
                        </span>
                        <span className="text-xs font-black text-gray-text uppercase tracking-widest">Units</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <div className="bento-card !p-0 overflow-hidden mb-12">
                    <div className="p-10 border-b border-border-light dark:border-white/5 bg-background/20 dark:bg-white/5 backdrop-blur-md flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-navy tracking-tighter uppercase whitespace-nowrap">Cluster Analysis</h3>
                            <p className="text-[10px] font-black text-gray-text uppercase tracking-[0.3em] mt-2 opacity-50 italic">Categorical cross-segmentation protocols</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="px-6 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-border-light dark:border-white/5 shadow-sm flex items-center gap-3">
                                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-navy opacity-60 uppercase tracking-widest text-number leading-none">Dataset: Synchronized</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-0">
                        <div className="md:hidden p-4 space-y-3">
                            {groups.length > 0 ? groups.map(g => {
                                const rowTotal = levels.reduce((sum, l) => sum + matrix[g][l], 0);
                                return (
                                    <div key={g} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <p className="font-black text-slate-900">{GROUP_LABELS[g] || g}</p>
                                            <span className="text-sm font-black text-brand-primary">{rowTotal}</span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                                            {levels.map((l) => (
                                                <div key={l} className="rounded-lg bg-slate-50 p-2 text-center">{l}: {matrix[g][l]}</div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }) : <div className="p-6 text-center text-xs font-black text-slate-400">No distribution data synchronized</div>}
                        </div>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-background/10 dark:bg-white/5">
                                        <th className="py-8 px-10 text-[11px] font-black text-gray-text uppercase tracking-[0.4em] text-left">Category Group</th>
                                        <th className="py-8 px-8 text-[11px] font-black text-red-500 text-center uppercase tracking-[0.4em] border-l border-border-light dark:border-white/5">Prior H</th>
                                        <th className="py-8 px-8 text-[11px] font-black text-amber-500 text-center uppercase tracking-[0.4em] border-l border-border-light dark:border-white/5">Med M</th>
                                        <th className="py-8 px-8 text-[11px] font-black text-emerald-500 text-center uppercase tracking-[0.4em] border-l border-border-light dark:border-white/5">Std L</th>
                                        <th className="py-8 px-10 text-[11px] font-black text-navy text-right uppercase tracking-[0.4em] bg-background dark:bg-white/5 border-l border-border-light dark:border-white/5">Aggregated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light dark:divide-white/5">
                                    {groups.length > 0 ? groups.map(g => {
                                        const rowTotal = levels.reduce((sum, l) => sum + matrix[g][l], 0);
                                        return (
                                            <tr key={g} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group/row cursor-default">
                                                <td className="py-10 px-10">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 flex items-center justify-center font-mono font-black text-brand-primary text-base shadow-sm group-hover/row:bg-brand-primary group-hover/row:text-white group-hover/row:scale-110 transition-all duration-500">
                                                            {g}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-navy text-lg tracking-tight group-hover/row:text-brand-primary transition-colors uppercase">{GROUP_LABELS[g] || g}</span>
                                                            <span className="text-[10px] font-black text-gray-text uppercase tracking-widest mt-1.5 opacity-40 italic">Structural Node</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                {levels.map((l, idx) => {
                                                    const colorClasses = ['text-red-500', 'text-amber-500', 'text-emerald-500'];
                                                    return (
                                                        <AnalyticsCell
                                                            key={l}
                                                            type={type as any}
                                                            groupCode={g}
                                                            levelCode={l}
                                                            value={matrix[g][l]}
                                                            colorClass={colorClasses[idx]}
                                                        />
                                                    );
                                                })}
                                                <td className="py-10 px-10 text-right bg-background/20 dark:bg-white/5 border-l border-border-light dark:border-white/5">
                                                    <span className="text-3xl font-black text-navy tabular-nums tracking-tighter text-number leading-none group-hover/row:text-brand-primary group-hover/row:scale-110 transition-all inline-block">
                                                        {rowTotal.toLocaleString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center">
                                                <div className="flex flex-col items-center">
                                                    <AlertTriangle className="w-12 h-12 text-slate-200 mb-6" />
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No distribution data synchronized</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-background border-t-2 border-border-light">
                                    <tr className="font-black">
                                        <td className="py-10 px-10 text-gray-text text-[10px] uppercase tracking-[0.2em]">Cross-Category Total</td>
                                        {levels.map((l, idx) => {
                                            const colTotal = groups.reduce((sum, g) => sum + matrix[g][l], 0);
                                            const colors = ['text-red-500', 'text-amber-500', 'text-emerald-500'];
                                            return (
                                                <td key={l} className="py-10 px-6 text-center border-l border-white">
                                                    <div className="flex flex-col items-center">
                                                        <span className={cn("text-2xl tracking-tighter tabular-nums", colors[idx])}>
                                                            {colTotal.toLocaleString()}
                                                        </span>
                                                        <span className="text-[8px] font-black text-gray-text uppercase mt-1">Aggregated</span>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="py-10 px-10 text-right font-black border-l border-border-light bg-background/50 relative overflow-hidden">
                                            <div className="w-20 h-20 bg-brand-primary opacity-5 rounded-full absolute -right-5 -bottom-5"></div>
                                            <div className="flex flex-col items-end relative z-10">
                                                <span className="text-3xl text-brand-primary tracking-tight font-black tabular-nums">
                                                    {totalCount.toLocaleString()}
                                                </span>
                                                <span className="text-[8px] font-black text-brand-primary/40 uppercase tracking-widest mt-1 italic">Nodal Final Sum</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div className="px-10 py-8 bg-background border-t border-border-light/50 flex items-center justify-between">
                        <div className="flex items-center gap-10">
                            <LegendItem color="bg-red-500 shadow-red-200" label="H" sub="High Performance" />
                            <LegendItem color="bg-amber-400 shadow-amber-200" label="M" sub="Medium Stability" />
                            <LegendItem color="bg-green-500 shadow-green-200" label="L" sub="Standard Usage" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-gray-text uppercase tracking-[0.2em]">
                                CECICS Enterprise Resource Management
                            </span>
                            <span className="text-[8px] font-bold text-gray-text/60 mt-1 uppercase tracking-widest">
                                Report Generated: {new Date().toLocaleTimeString('vi-VN')} • {new Date().toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LegendItem({ color, label, sub }: { color: string; label: string; sub: string }) {
    return (
        <div className="flex items-center gap-4 group/legend cursor-help">
            <div className={cn("w-3.5 h-3.5 rounded-full shadow-lg group-hover:scale-125 transition-transform", color)}></div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-navy uppercase leading-none tracking-widest">{label}</span>
                <span className="text-[8px] font-black text-gray-text uppercase mt-0.5 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{sub}</span>
            </div>
        </div>
    );
}
