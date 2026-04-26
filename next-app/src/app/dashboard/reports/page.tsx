import { reportService } from '@/services/ReportService';
import { BarChart3, PieChart as PieIcon, FileText, Download, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
    const [levelStats, mfgStats, deptStats] = await Promise.all([
        reportService.getEquipmentByLevel(),
        reportService.getEquipmentByManufacturer(),
        reportService.getRentalByDepartment()
    ]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thống kê & Báo cáo</h1>
                    <p className="text-sm text-slate-500 mt-1">Dữ liệu vận hành định kỳ của hệ thống CECICS</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Bộ lọc
                    </button>
                    <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200">
                        <Download className="w-4 h-4" />
                        Xuất báo cáo (PDF)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Level distribution */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <PieIcon className="w-5 h-5 text-blue-500" />
                        Phân bổ theo mức độ (H/M/L)
                    </h3>
                    <div className="space-y-4">
                        {levelStats.map((item) => (
                            <div key={item.category} className="flex items-center gap-4">
                                <span className="w-8 font-bold text-slate-400">{item.category || '?'}</span>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(item.count / levelStats.reduce((a, b) => a + b.count, 0)) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-slate-700">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dept distribution */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                        Tần suất mượn theo Bộ môn
                    </h3>
                    <div className="space-y-4">
                        {deptStats.slice(0, 5).map((item) => (
                            <div key={item.category} className="flex items-center gap-4">
                                <span className="flex-1 text-sm font-medium text-slate-600 truncate">{item.category}</span>
                                <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full"
                                        style={{ width: `${(item.count / Math.max(...deptStats.map(d => d.count))) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-slate-700">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Stats Table */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Thống kê chi tiết theo Hãng sản xuất
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {mfgStats.map((item) => (
                            <div key={item.category} className="p-4 rounded-xl bg-slate-50 border border-slate-100 italic">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">{item.category}</p>
                                <p className="text-xl font-black text-slate-800">{item.count} <span className="text-xs font-normal text-slate-400">thiết bị</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
