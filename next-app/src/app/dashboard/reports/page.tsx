import { reportService } from '@/services/ReportService';
import { BarChart3, PieChart as PieIcon, FileText, Download, LayoutDashboard, Box, AlertCircle, ArrowUpRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{
        type?: string;
        month?: string;
        year?: string;
        startDate?: string;
        endDate?: string;
    }>;
}

export default async function ReportsPage({ searchParams }: Props) {
    const params = await searchParams;
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (params.type === 'month' && params.month && params.year) {
        startDate = `${params.year}-${params.month.padStart(2, '0')}-01 00:00:00`;
        const lastDay = new Date(Number(params.year), Number(params.month), 0).getDate();
        endDate = `${params.year}-${params.month.padStart(2, '0')}-${lastDay} 23:59:59`;
    } else if (params.type === 'year' && params.year) {
        startDate = `${params.year}-01-01 00:00:00`;
        endDate = `${params.year}-12-31 23:59:59`;
    } else if (params.type === 'range' && params.startDate && params.endDate) {
        startDate = `${params.startDate} 00:00:00`;
        endDate = `${params.endDate} 23:59:59`;
    }

    const [levelStats, groupStats, deptStats] = await Promise.all([
        reportService.getEquipmentByLevel(startDate, endDate),
        reportService.getEquipmentByGroup(startDate, endDate),
        reportService.getRentalByDepartment(startDate, endDate)
    ]);

    const totalLevel = levelStats.reduce((sum, item) => sum + item.count, 0);
    const totalGroup = groupStats.reduce((sum, item) => sum + item.count, 0);
    const totalDept = deptStats.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-navy tracking-tight">Thống kê & Báo cáo</h1>
                    <p className="text-sm font-medium text-gray-text mt-1">Dữ liệu vận hành dựa trên mã nhận diện barcode</p>
                </div>
                <div className="flex items-center gap-3">
                    <ReportFilters />
                    <Link 
                        href={{
                            pathname: '/dashboard/reports/generate',
                            query: params
                        }}
                        className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200 active:scale-95 uppercase tracking-widest"
                    >
                        <Download className="w-4 h-4" />
                        Xuất báo cáo AI
                    </Link>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Groups Card */}
                <Link href="/dashboard/analytics/detailed/equipment" className="group block bg-secondary-bg p-8 rounded-3xl shadow-soft hover:shadow-2xl hover:border-blue-200 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                        <ArrowUpRight className="w-6 h-6 text-slate-200 group-hover:text-blue-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-background text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                            <Box className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-text uppercase tracking-widest">Phân bố Nhóm</span>
                    </div>
                    <h3 className="text-4xl font-black text-navy mb-6 tracking-tighter">
                        {totalGroup.toLocaleString()}
                        <span className="text-sm font-bold text-gray-text ml-2 uppercase tracking-widest">Thiết bị</span>
                    </h3>
                    <div className="space-y-3">
                        {groupStats.map((item, idx) => (
                            <div key={item.category} className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                                    <span className="text-gray-text">{item.category}</span>
                                    <span className="text-navy">{item.count}</span>
                                </div>
                                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-purple-500" : "bg-emerald-500")}
                                        style={{ width: `${(item.count / totalGroup) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Link>

                {/* Levels Card */}
                <Link href="/dashboard/analytics/detailed/items" className="group block bg-white p-8 rounded-3xl shadow-soft hover:shadow-2xl hover:border-amber-200 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                        <ArrowUpRight className="w-6 h-6 text-slate-200 group-hover:text-amber-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-background text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-text uppercase tracking-widest">Mức độ H/M/L</span>
                    </div>
                    <h3 className="text-4xl font-black text-navy mb-6 tracking-tighter">
                        {totalLevel.toLocaleString()}
                        <span className="text-sm font-bold text-gray-text ml-2 uppercase tracking-widest">Hạng mục</span>
                    </h3>
                    <div className="space-y-3">
                        {levelStats.map((item, idx) => (
                            <div key={item.category} className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                                    <span className="text-gray-text">{item.category}</span>
                                    <span className="text-navy">{item.count}</span>
                                </div>
                                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", item.category === 'High' ? "bg-red-500" : item.category === 'Medium' ? "bg-amber-500" : "bg-green-500")}
                                        style={{ width: `${(item.count / totalLevel) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Link>

                {/* Rental Card */}
                <Link href="/dashboard/history" className="group block bg-white p-8 rounded-3xl shadow-soft hover:shadow-2xl hover:border-purple-200 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                        <ArrowUpRight className="w-6 h-6 text-slate-200 group-hover:text-purple-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-background text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-text uppercase tracking-widest">Lượt mượn Bộ môn</span>
                    </div>
                    <h3 className="text-4xl font-black text-navy mb-6 tracking-tighter">
                        {totalDept.toLocaleString()}
                        <span className="text-sm font-bold text-gray-text ml-2 uppercase tracking-widest">Lượt đi</span>
                    </h3>
                    <div className="space-y-3">
                        {deptStats.slice(0, 3).map((item, idx) => (
                            <div key={item.category} className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                                    <span className="text-gray-text truncate max-w-[120px]">{item.category}</span>
                                    <span className="text-navy">{item.count}</span>
                                </div>
                                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${totalDept > 0 ? (item.count / totalDept) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {deptStats.length === 0 && (
                            <p className="text-[10px] font-bold text-slate-400 italic">Không có dữ liệu lượt mượn</p>
                        )}
                    </div>
                </Link>
            </div>

            {/* Bottom Breakdown Table */}
            <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-border-light">
                <div className="px-8 py-10 bg-background/50 border-b border-border-light flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-black text-navy tracking-tight">Chi tiết Tần suất mượn</h4>
                        <p className="text-xs font-black text-gray-text mt-1 uppercase tracking-widest">Thống kê theo đơn vị bộ môn / phòng ban</p>
                    </div>
                    <Link href="/dashboard/history" className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">
                        Xem tất cả lịch sử
                    </Link>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {deptStats.map((item) => (
                            <div key={item.category} className="flex items-center justify-between p-5 rounded-2xl bg-background border border-border-light shadow-sm hover:border-brand-primary/20 transition-all">
                                <span className="text-sm font-bold text-navy truncate mr-4">{item.category}</span>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xl font-black text-navy">{item.count}</span>
                                        <span className="text-[8px] font-bold text-gray-text uppercase tracking-tighter">Lượt</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-brand-primary" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
