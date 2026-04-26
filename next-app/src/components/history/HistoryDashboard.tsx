'use client';

import React, { useState } from 'react';
import {
    History,
    Search,
    Filter,
    Calendar,
    Download,
    ChevronRight,
    FileText,
    X,
    Building2,
    User,
    Package,
    Tag,
    Info,
    ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UsageHistory } from '@/types/rental';
import TicketPrintView from '@/components/rental/TicketPrintView';

interface HistoryDashboardProps {
    initialHistory: UsageHistory[];
}

export default function HistoryDashboard({ initialHistory }: HistoryDashboardProps) {
    const [history, setHistory] = useState(initialHistory);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<UsageHistory | null>(null);
    const [showPrintView, setShowPrintView] = useState(false);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredHistory = history.filter(h =>
        h.ticket_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.renter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.department_name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const formatDate = (date: Date) => {
        if (!isMounted) return "";
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatShortDate = (date: Date) => {
        if (!isMounted) return "";
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const formatTime = (date: Date) => {
        if (!isMounted) return "";
        return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                            <History className="w-6 h-6 text-white" />
                        </div>
                        Lịch sử Sử dụng
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Theo dõi toàn bộ quá trình luân chuyển thiết bị trong hệ thống</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-white px-5 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm text-sm">
                        <Download className="w-4 h-4" />
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] border border-white/50 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã phiếu, người mượn hoặc bộ môn..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="bg-white px-5 py-3.5 rounded-2xl border border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm text-sm whitespace-nowrap"
                    >
                        <ArrowUpDown className="w-4 h-4 text-blue-500" />
                        {sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
                    </button>
                    <button className="bg-white px-5 py-3.5 rounded-2xl border border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm text-sm">
                        <Filter className="w-4 h-4 text-purple-500" />
                        Bộ lọc
                    </button>
                </div>
            </div>

            {/* Main Table Content */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thời gian</th>
                                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin Phiếu</th>
                                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Người mượn & Bộ môn</th>
                                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Số lượng TB</th>
                                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredHistory.map((record) => (
                                <tr
                                    key={record.id}
                                    onClick={() => setSelectedTicket(record)}
                                    className="hover:bg-blue-50/40 transition-all group cursor-pointer"
                                >
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-white transition-colors shadow-sm">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{formatShortDate(record.date)}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{formatTime(record.date)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-sm font-black text-blue-600 tracking-tight">{record.ticket_no}</span>
                                            <span className="text-[10px] text-slate-400 font-bold lowercase mt-1 line-clamp-1">{record.note || 'Không có ghi chú'}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-800">{record.renter}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Building2 className="w-3 h-3" />
                                                <span className="text-xs font-semibold">{record.department_name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-slate-900">{record.items.length}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Thiết bị</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <span className={cn(
                                                "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                record.status === 'returned'
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-amber-50 text-amber-600 border-amber-100"
                                            )}>
                                                {record.status === 'returned' ? 'Đã trả' : 'Đang mượn'}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredHistory.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Không tìm thấy kết quả</h4>
                        <p className="text-slate-400 text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                    </div>
                )}

                <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hiển thị {filteredHistory.length} kết quả bản ghi</span>
                    <div className="flex items-center gap-2">
                        <button disabled className="p-2 text-slate-300 pointer-events-none hover:text-blue-600 transition-colors">
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs">1</button>
                        </div>
                        <button disabled className="p-2 text-slate-300 pointer-events-none hover:text-blue-600 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] w-full max-w-3xl overflow-hidden border border-white/40 animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
                        <div className="p-10 border-b border-slate-100/50 bg-white/40 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Chi tiết phiếu mượn</h4>
                                    <p className="text-sm font-mono font-bold text-blue-600">{selectedTicket.ticket_no}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-10">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-2 group hover:bg-white transition-all shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ngày mượn</span>
                                    </div>
                                    <p className="font-bold text-slate-900">{isMounted ? new Date(selectedTicket.date).toLocaleString('vi-VN') : ""}</p>
                                </div>
                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-2 group hover:bg-white transition-all shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <User className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Người mượn</span>
                                    </div>
                                    <p className="font-bold text-slate-900">{selectedTicket.renter}</p>
                                </div>
                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-2 group hover:bg-white transition-all shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Building2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Bộ môn</span>
                                    </div>
                                    <p className="font-bold text-slate-900">{selectedTicket.department_name}</p>
                                </div>
                            </div>

                            {/* Ticket Note */}
                            {selectedTicket.note && (
                                <div className="p-6 bg-blue-50/20 rounded-3xl border border-blue-100/50 flex gap-5">
                                    <Info className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                                    <div>
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Ghi chú phiếu</span>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedTicket.note}</p>
                                    </div>
                                </div>
                            )}

                            {/* Items Table */}
                            <div className="space-y-6">
                                <h5 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 px-1">
                                    <Package className="w-4 h-4 text-blue-500" />
                                    Danh sách thiết bị ({selectedTicket.items.length})
                                </h5>
                                <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên thiết bị</th>
                                                <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã hiệu</th>
                                                <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {selectedTicket.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-5 px-8">
                                                        <span className="text-sm font-bold text-slate-800 tracking-tight">{item.equipment_name}</span>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-mono font-black text-slate-400 uppercase">{item.barcode}</span>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <Tag className="w-3 h-3 text-blue-500" />
                                                                <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{item.barcode_stt}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 text-right">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">{item.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-white/40 border-t border-slate-100/50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CECICS CMS Engine</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowPrintView(true)}
                                    className="px-8 py-4 rounded-2xl font-black text-xs text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-[0.2em] flex items-center gap-2 border border-transparent hover:border-blue-100"
                                >
                                    <FileText className="w-4 h-4" />
                                    Xem mẫu in
                                </button>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs hover:bg-slate-800 transition-all uppercase tracking-[0.2em] shadow-xl shadow-slate-200"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPrintView && selectedTicket && (
                <TicketPrintView
                    ticket={selectedTicket}
                    mode={selectedTicket.status === 'returned' ? 'return' : 'rental'}
                    onClose={() => setShowPrintView(false)}
                />
            )}
        </div>
    );
}
