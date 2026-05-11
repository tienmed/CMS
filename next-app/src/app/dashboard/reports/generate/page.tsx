import { reportService } from '@/services/ReportService';
import { Sparkles, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
}

export default async function GenerateReportPage({ searchParams }: Props) {
    const params = await searchParams;
    
    // 1. Fetch AI Summary and Data
    const [aiInsight, levelStats, groupStats, deptStats] = await Promise.all([
        reportService.generateAIExecutiveSummary(),
        reportService.getEquipmentByLevel(params.startDate, params.endDate),
        reportService.getEquipmentByGroup(params.startDate, params.endDate),
        reportService.getRentalByDepartment(params.startDate, params.endDate)
    ]);

    const today = new Date().toLocaleDateString('vi-VN');

    return (
        <div className="min-h-screen bg-white md:bg-slate-50 py-8 px-4 md:px-0">
            {/* Action Bar - Hidden on Print */}
            <div className="max-w-[800px] mx-auto mb-8 flex items-center justify-between print:hidden">
                <Link href="/dashboard/reports" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-navy transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </Link>
                <button 
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-xs hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                    <Printer className="w-4 h-4" /> In báo cáo / Xuất PDF
                </button>
            </div>

            {/* A4 Paper Surface */}
            <div className="max-w-[800px] mx-auto bg-white shadow-2xl md:rounded-sm p-[40px] md:p-[60px] print:shadow-none print:p-0 min-h-[1123px]">
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">CECICS CMS REPORT</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hệ thống Quản lý Thiết bị Y tế</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày lập báo cáo</p>
                        <p className="text-sm font-black text-slate-900">{today}</p>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">BÁO CÁO TỔNG KẾT VẬN HÀNH</h1>
                    <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
                    {params.startDate && params.endDate && (
                        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Giai đoạn: {params.startDate} đến {params.endDate}
                        </p>
                    )}
                </div>

                {/* AI Executive Summary Section */}
                <div className="mb-12 bg-slate-50 rounded-2xl p-8 border border-slate-100 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">AI Executive Summary</h3>
                    </div>
                    
                    <div className="prose prose-slate max-w-none relative z-10">
                        <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line italic">
                            {aiInsight.content}
                        </div>
                    </div>
                    <p className="mt-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest italic z-10 relative">
                        * Bản tóm tắt được tự động phân tích bởi {aiInsight.model} dựa trên dữ liệu thời gian thực.
                    </p>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Cơ cấu thiết bị (Nhóm)</h4>
                        <div className="space-y-2">
                            {groupStats.map(item => (
                                <div key={item.category} className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-600">{item.category}</span>
                                    <span className="font-black text-slate-900">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Xếp hạng quan trọng (Level)</h4>
                        <div className="space-y-2">
                            {levelStats.map(item => (
                                <div key={item.category} className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-600">{item.category}</span>
                                    <span className="font-black text-slate-900">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Department Table */}
                <div className="mb-16">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-6">Tần suất sử dụng theo Bộ môn</h4>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="p-3 text-[10px] font-black uppercase tracking-widest rounded-l-lg">STT</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-widest">Đơn vị / Bộ môn</th>
                                <th className="p-3 text-[10px] font-black uppercase tracking-widest rounded-r-lg text-right">Lượt mượn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deptStats.map((item, idx) => (
                                <tr key={item.category} className="border-b border-slate-50">
                                    <td className="p-4 text-xs font-bold text-slate-400">{idx + 1}</td>
                                    <td className="p-4 text-sm font-black text-slate-800">{item.category}</td>
                                    <td className="p-4 text-sm font-black text-slate-900 text-right">{item.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Signature Section */}
                <div className="mt-auto pt-12 grid grid-cols-2 gap-20">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-20">Người lập báo cáo</p>
                        <div className="w-40 h-px bg-slate-200 mx-auto" />
                        <p className="mt-4 text-sm font-black text-slate-900">Quản lý Kho</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-20">Phê duyệt của Giám đốc</p>
                        <div className="w-40 h-px bg-slate-200 mx-auto" />
                        <p className="mt-4 text-sm font-black text-slate-900">Ban Giám đốc CECICS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
