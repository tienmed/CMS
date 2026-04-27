import { analyticsService } from '@/services/AnalyticsService';
import { CollapsibleGroup } from '@/components/analytics/CollapsibleGroup';
import { UsageBar } from '@/components/analytics/UsageBar';
import { ArrowLeft, Package, Layers, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const LEVEL_LABELS: Record<string, string> = {
    'H': 'High',
    'M': 'Medium',
    'L': 'Low',
};

const GROUP_COLORS: Record<string, string> = {
    'MH': 'bg-blue-500',
    'TB': 'bg-emerald-500',
    'VP': 'bg-violet-500',
};

export default async function LevelDetailPage({ params }: { params: Promise<{ code: string }> }) {
    const { code: rawCode } = await params;
    const code = rawCode.toUpperCase();
    const label = LEVEL_LABELS[code] || code;
    const { metrics, groups } = await analyticsService.getEquipmentByLevel(code);

    const allItems = groups.flatMap(g => g.items);
    const maxUsage = allItems.length > 0 ? Math.max(...allItems.map(i => i.usage_per_year), 1) : 1;

    return (
        <div className="space-y-10 h-full flex flex-col min-h-0 overflow-hidden animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="w-14 h-14 rounded-2xl bg-white border border-slate-50 flex items-center justify-center text-slate-300 hover:text-brand-primary hover:border-brand-primary/20 hover:scale-110 active:scale-95 transition-all shadow-soft">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mức độ: {label}</h1>
                            <span className="px-3 py-1 rounded-lg bg-blue-50 text-brand-primary font-mono font-black text-xs border border-blue-100">{code}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">Phân tích mức độ quan trọng & tính sẵn sàng</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-5 py-3 rounded-2xl bg-white border border-slate-50 shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dữ liệu thời gian thực</span>
                    </div>
                </div>
            </div>

            {/* Metric Cards - Premium Horizon Style */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                <MetricCard icon={Package} label="Mô hình" value={metrics.totalModels} color="text-brand-primary" bg="bg-blue-50" />
                <MetricCard icon={Layers} label="Mẫu vật" value={metrics.totalItems} color="text-purple-500" bg="bg-purple-50" />
                <MetricCard icon={Activity} label="Lượt mượn" value={metrics.totalRentals} color="text-emerald-500" bg="bg-emerald-50" />
                <MetricCard icon={TrendingUp} label="Hiệu suất" value={metrics.avgUsagePerYear} color="text-amber-500" bg="bg-amber-50" suffix="/YR" />
            </div>

            {/* Collapsible Groups by Group - Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 space-y-8">
                {groups.map((group, idx) => (
                    <CollapsibleGroup
                        key={group.key}
                        title={group.label}
                        count={group.count}
                        defaultOpen={idx === 0}
                        colorClass={GROUP_COLORS[group.key] || 'bg-slate-400 shadow-[0_0_12px_rgba(148,163,184,0.3)]'}
                    >
                        {/* Table layout refined */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/30 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">
                                    <tr>
                                        <th className="py-5 px-8">Thiết bị</th>
                                        <th className="py-5 px-6">Định danh</th>
                                        <th className="py-5 px-6 text-center">Số lượng</th>
                                        <th className="py-5 px-6 text-center">Tần suất</th>
                                        <th className="py-5 px-6 text-center">Năm nhập</th>
                                        <th className="py-5 px-8">Hiệu suất vận hành</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {group.items.map((item) => (
                                        <tr key={item.id} className="group/row hover:bg-slate-50/50 transition-all cursor-default">
                                            <td className="py-5 px-8">
                                                <Link href={`/dashboard/equipment/${item.id}`} className="text-sm font-black text-slate-700 hover:text-brand-primary transition-colors line-clamp-1">
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 group-hover/row:bg-white group-hover/row:text-brand-primary group-hover/row:border-brand-primary/20 transition-all">
                                                    {item.barcode}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6 text-center text-sm font-black text-slate-500 italic">
                                                {item.item_count}
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-sm font-black text-slate-900 leading-none">{item.rental_count}</span>
                                                    <span className="text-[8px] font-black text-slate-300 uppercase mt-1">Times</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-center text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                                {item.import_year || '—'}
                                            </td>
                                            <td className="py-5 px-8">
                                                <UsageBar value={item.usage_per_year} maxValue={maxUsage} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {group.items.length === 0 && (
                                <div className="py-16 text-center">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No equipment found in this category</p>
                                </div>
                            )}
                        </div>
                    </CollapsibleGroup>
                ))}
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, color, bg, suffix = "" }: { icon: any; label: string; value: number; color: string; bg: string; suffix?: string }) {
    return (
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-50 shadow-soft group hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-5 mb-5">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", bg)}>
                    <Icon className={cn("w-6 h-6", color)} />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{label}</p>
            </div>
            <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                    {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
                </h3>
                {suffix && <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{suffix}</span>}
            </div>
        </div>
    );
}
