import { dashboardService } from '@/services/DashboardService';
import { Package, Activity, CheckCircle2, AlertTriangle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-600 shadow-sm hover:shadow-md"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">Phân tích chi tiết</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            <div className={cn("p-2 rounded-xl", config.bg)}>
                                <config.icon className={cn("w-7 h-7", config.color)} />
                            </div>
                            {config.label}
                        </h1>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tổng số lượng</span>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{totalCount.toLocaleString()}</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="text-lg font-bold text-slate-800">Ma trận phân bố theo Nhóm & Mức độ</h3>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Báo cáo phân tách dựa trên mã barcode (Nhóm: 2 ký tự đầu | Mức độ: ký tự thứ 3)</p>
                </div>

                <div className="p-8">
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-5 px-8 text-sm font-bold text-slate-600 uppercase tracking-widest">Nhóm thiết bị</th>
                                    <th className="py-5 px-6 text-sm font-bold text-red-600 text-center uppercase tracking-widest bg-red-50/30">High (H)</th>
                                    <th className="py-5 px-6 text-sm font-bold text-amber-600 text-center uppercase tracking-widest bg-amber-50/30">Medium (M)</th>
                                    <th className="py-5 px-6 text-sm font-bold text-green-600 text-center uppercase tracking-widest bg-green-50/30">Low (L)</th>
                                    <th className="py-5 px-8 text-sm font-bold text-slate-900 text-right uppercase tracking-widest bg-slate-100/50">Tổng cộng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {groups.length > 0 ? groups.map(g => {
                                    const rowTotal = levels.reduce((sum, l) => sum + matrix[g][l], 0);
                                    return (
                                        <tr key={g} className="hover:bg-slate-50 transition-colors group">
                                            <td className="py-5 px-8">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{GROUP_LABELS[g] || g}</span>
                                                    <span className="text-[10px] font-mono font-bold text-slate-400">{g}</span>
                                                </div>
                                            </td>
                                            {levels.map(l => (
                                                <td key={l} className="py-5 px-6 text-center">
                                                    <span className={cn(
                                                        "font-mono font-bold px-3 py-1 rounded-lg text-sm",
                                                        matrix[g][l] > 0 ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200" : "text-slate-300"
                                                    )}>
                                                        {matrix[g][l] > 0 ? matrix[g][l].toLocaleString() : '0'}
                                                    </span>
                                                </td>
                                            ))}
                                            <td className="py-5 px-8 text-right font-black text-slate-900 bg-slate-50/30 text-lg">
                                                {rowTotal.toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic text-lg uppercase tracking-widest">
                                            Không có dữ liệu phân bố
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                <tr className="font-black">
                                    <td className="py-6 px-8 text-slate-500 uppercase text-xs tracking-[0.2em]">Tổng báo cáo</td>
                                    {levels.map(l => {
                                        const colTotal = groups.reduce((sum, g) => sum + matrix[g][l], 0);
                                        return (
                                            <td key={l} className="py-6 px-6 text-center text-slate-900 text-lg">
                                                {colTotal.toLocaleString()}
                                            </td>
                                        );
                                    })}
                                    <td className="py-6 px-8 text-right text-blue-600 text-2xl tracking-tighter decoration-blue-600/30 underline-offset-4 decoration-4">
                                        {totalCount.toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">H: Quan trọng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-200"></div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">M: Trung bình</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">L: Thường</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Hệ thống CECICS • Cập nhật: {new Date().toLocaleDateString('vi-VN')}
                    </span>
                </div>
            </div>
        </div>
    );
}
