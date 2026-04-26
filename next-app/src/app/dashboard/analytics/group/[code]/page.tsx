import { analyticsService } from '@/services/AnalyticsService';
import { CollapsibleGroup } from '@/components/analytics/CollapsibleGroup';
import { UsageBar } from '@/components/analytics/UsageBar';
import { ArrowLeft, Package, Layers, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const GROUP_LABELS: Record<string, string> = {
    'MH': 'Mô hình',
    'TB': 'Thiết bị',
    'VP': 'Văn phòng',
};

const LEVEL_COLORS: Record<string, string> = {
    'H': 'bg-red-500',
    'M': 'bg-amber-500',
    'L': 'bg-green-500',
};

export default async function GroupDetailPage({ params }: { params: Promise<{ code: string }> }) {
    const { code: rawCode } = await params;
    const code = rawCode.toUpperCase();
    const label = GROUP_LABELS[code] || code;
    const { metrics, groups } = await analyticsService.getEquipmentByGroup(code);

    // Max usage for scaling bars
    const allItems = groups.flatMap(g => g.items);
    const maxUsage = allItems.length > 0 ? Math.max(...allItems.map(i => i.usage_per_year), 1) : 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Nhóm: {label} ({code})</h1>
                    <p className="text-sm text-slate-500">Phân tích chi tiết thiết bị theo nhóm</p>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={Package} label="Mô hình" value={metrics.totalModels} color="text-blue-600" bg="bg-blue-50" />
                <MetricCard icon={Layers} label="Mẫu vật" value={metrics.totalItems} color="text-purple-600" bg="bg-purple-50" />
                <MetricCard icon={Activity} label="Lượt mượn" value={metrics.totalRentals} color="text-emerald-600" bg="bg-emerald-50" />
                <MetricCard icon={TrendingUp} label="TB/năm" value={metrics.avgUsagePerYear} color="text-amber-600" bg="bg-amber-50" />
            </div>

            {/* Collapsible Groups by Level */}
            <div className="space-y-4">
                {groups.map((group, idx) => (
                    <CollapsibleGroup
                        key={group.key}
                        title={group.label}
                        count={group.count}
                        defaultOpen={idx === 0}
                        colorClass={LEVEL_COLORS[group.key] || 'bg-slate-500'}
                    >
                        {/* Table header */}
                        <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <div className="col-span-4">Thiết bị</div>
                            <div className="col-span-2">Mã barcode</div>
                            <div className="col-span-1 text-center">Mẫu vật</div>
                            <div className="col-span-1 text-center">Lượt mượn</div>
                            <div className="col-span-1 text-center">Năm nhập</div>
                            <div className="col-span-3">Hiệu suất sử dụng</div>
                        </div>
                        {/* Rows */}
                        {group.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50/60 transition-colors items-center">
                                <div className="lg:col-span-4">
                                    <Link href={`/dashboard/equipment/${item.id}`} className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-1">
                                        {item.name}
                                    </Link>
                                </div>
                                <div className="lg:col-span-2">
                                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.barcode}</span>
                                </div>
                                <div className="lg:col-span-1 text-center text-sm text-slate-600">{item.item_count}</div>
                                <div className="lg:col-span-1 text-center text-sm font-bold text-slate-800">{item.rental_count}</div>
                                <div className="lg:col-span-1 text-center text-xs text-slate-400">{item.import_year || '—'}</div>
                                <div className="lg:col-span-3">
                                    <UsageBar value={item.usage_per_year} maxValue={maxUsage} />
                                </div>
                            </div>
                        ))}
                        {group.items.length === 0 && (
                            <div className="px-5 py-8 text-center text-sm text-slate-400">Không có thiết bị nào</div>
                        )}
                    </CollapsibleGroup>
                ))}
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: number; color: string; bg: string }) {
    return (
        <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-lg", bg)}>
                    <Icon className={cn("w-4 h-4 lg:w-5 lg:h-5", color)} />
                </div>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}</h3>
        </div>
    );
}
