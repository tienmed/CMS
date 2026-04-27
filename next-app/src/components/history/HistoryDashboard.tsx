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
    const [statusFilter, setStatusFilter] = useState<'all' | 'rented' | 'returned'>('all');
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        setHistory(initialHistory);
    }, [initialHistory]);

    const filteredHistory = history.filter(h =>
        (statusFilter === 'all' || h.status === statusFilter) &&
        (h.ticket_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.renter.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.department_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <div className="space-y-12 animate-in fade-in duration-700 h-full flex flex-col min-h-0 overflow-hidden">
            {/* Header Area - Pro Max Style */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 shrink-0 border-b border-border-light dark:border-white/5 pb-12">
                <div>
                    <h1 className="headline-hero text-primary uppercase leading-none">Lịch sử</h1>
                    <p className="text-[11px] font-black text-muted mt-4 uppercase tracking-[0.3em] opacity-60">Toàn bộ Lịch sử Vận hành</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="bg-surface h-16 px-10 rounded-2xl font-black text-primary border border-transparent shadow-[var(--shadow-card)] hover:scale-105 transition-all flex items-center gap-3 text-sm uppercase tracking-widest active:scale-95 group">
                        <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        Xuất dữ liệu
                    </button>
                </div>
            </div>

            {/* Filters Bar - Bento Style */}
            <div className="bento-card !p-6 flex flex-col md:flex-row items-center gap-6 shrink-0">
                <div className="relative flex-1 w-full group">
                    <Search className="w-5 h-5 text-gray-text absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-brand-primary transition-colors duration-300" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã phiếu, người mượn hoặc bộ môn..."
                        className="w-full pl-16 pr-8 h-16 bg-background dark:bg-white/5 border border-transparent rounded-[1.5rem] text-sm font-bold focus:bg-white dark:focus:bg-black/20 focus:border-brand-primary/20 focus:ring-8 focus:ring-brand-primary/5 transition-all placeholder:text-gray-text/30 text-navy"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="bg-surface h-16 px-8 rounded-2xl border border-transparent font-black text-primary opacity-60 hover:opacity-100 transition-all flex items-center gap-3 shadow-sm text-xs uppercase tracking-widest whitespace-nowrap"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                        {sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
                    </button>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-surface h-16 px-6 rounded-2xl border border-transparent font-black text-primary text-[10px] uppercase tracking-widest outline-none shadow-sm cursor-pointer opacity-80 hover:opacity-100 transition-all appearance-none"
                    >
                        <option value="all">Tất cả phiếu</option>
                        <option value="rented">Đang mượn</option>
                        <option value="returned">Đã trả</option>
                    </select>
                </div>
            </div>

            {/* Main Table Content - Premium Bento Table */}
            <div className="bento-card !p-0 flex-1 min-h-0 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md text-[11px] uppercase font-black text-muted tracking-[0.3em]">
                            <tr>
                                <th className="py-8 px-10 border-b border-border-soft">Thời gian tạo</th>
                                <th className="py-8 px-10 border-b border-border-soft">Mã phiếu</th>
                                <th className="py-8 px-10 border-b border-border-soft">Người mượn & Bộ môn</th>
                                <th className="py-8 px-10 border-b border-border-soft">Số lượng</th>
                                <th className="py-8 px-10 text-right border-b border-border-soft">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-white/5">
                            {filteredHistory.map((record) => (
                                <tr
                                    key={record.id}
                                    onClick={() => setSelectedTicket(record)}
                                    className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group cursor-default"
                                >
                                    <td className="py-10 px-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-[1.25rem] flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-500">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-primary">{formatShortDate(record.date)}</span>
                                                <span className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mt-1 opacity-50">Lập: {formatTime(record.date)}</span>
                                                {record.completed_date && (
                                                    <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-1">Trả: {formatShortDate(record.completed_date)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-10 px-10">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-lg font-black text-primary tracking-wider px-4 py-1.5 rounded-xl bg-primary-soft/30 border border-primary-soft w-fit">{record.ticket_no}</span>
                                            <span className="text-[10px] text-muted font-black uppercase mt-3 opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{record.note || 'Không có ghi chú'}</span>
                                        </div>
                                    </td>
                                    <td className="py-10 px-10">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
                                                <span className="text-base font-black text-navy uppercase tracking-tight">{record.renter}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-background dark:bg-white/5 border border-border-light dark:border-white/5 w-fit">
                                                <Building2 className="w-3.5 h-3.5 text-gray-text opacity-50" />
                                                <span className="text-[10px] font-black text-gray-text uppercase tracking-widest opacity-60">DEP-{record.department_name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-10 px-10">
                                        <div className="flex items-end gap-3 translate-y-1">
                                            <span className="text-4xl font-black text-primary tracking-tighter tabular-nums leading-none">{record.items.length}</span>
                                            <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-60">Thiết bị</span>
                                        </div>
                                    </td>
                                    <td className="py-10 px-10 text-right">
                                        <div className="flex items-center justify-end gap-6">
                                            <span className={cn(
                                                "inline-flex items-center px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all",
                                                record.status === 'returned'
                                                    ? "bg-accent-1/10 text-accent-1 border-accent-1/20"
                                                    : "bg-amber-50 text-amber-600 border-amber-100"
                                            )}>
                                                {record.status === 'returned' ? 'Đã Trả' : 'Đang Mượn'}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-muted hover:text-primary opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredHistory.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-24">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                            <Search className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Không có dữ liệu</h4>
                        <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Thử thay đổi bộ lọc tìm kiếm</p>
                    </div>
                )}

                <div className="p-8 border-t border-border-soft flex items-center justify-between shrink-0">
                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Tổng số phiếu: {filteredHistory.length}</span>
                    <div className="flex items-center gap-4">
                        <button disabled className="w-10 h-10 rounded-xl bg-slate-50 text-slate-200 flex items-center justify-center transition-all">
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-xl bg-brand-primary text-white font-black text-xs shadow-lg shadow-blue-100">1</button>
                        </div>
                        <button disabled className="w-10 h-10 rounded-xl bg-slate-50 text-slate-200 flex items-center justify-center transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3.5rem] shadow-[0_32px_120px_rgba(0,0,0,0.15)] w-full max-w-4xl overflow-hidden border border-white relative shadow-soft animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <button
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-10 right-10 p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-slate-900 z-10"
                        >
                            <X className="w-7 h-7" />
                        </button>

                        <div className="p-12 border-b border-border-light flex items-center gap-6">
                            <div className="w-16 h-16 bg-brand-primary rounded-3xl shadow-[0_12px_24px_rgba(66,42,251,0.2)] flex items-center justify-center">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-navy tracking-tight">Chi tiết phiếu mượn</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm font-mono font-black text-brand-primary uppercase tracking-tighter">{selectedTicket.ticket_no}</span>
                                    <span className="w-1 h-1 rounded-full bg-border-light" />
                                    <span className="text-[10px] font-black text-gray-text uppercase tracking-widest">{formatShortDate(selectedTicket.date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-12">
                            {/* Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-gray-text uppercase tracking-[0.2em] block pl-1">Phụ trách mượn</span>
                                    <div className="p-6 bg-background rounded-3xl border border-border-light flex items-center gap-4 group hover:bg-brand-primary/5 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-brand-primary text-xs">
                                            {selectedTicket.renter.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-black text-navy">{selectedTicket.renter}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-gray-text uppercase tracking-[0.2em] block pl-1">Đơn vị công tác</span>
                                    <div className="p-6 bg-background rounded-3xl border border-border-light flex items-center gap-4 group hover:bg-purple-50 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-500">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-black text-navy">{selectedTicket.department_name}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-gray-text uppercase tracking-[0.2em] block pl-1">Ngày lập phiếu</span>
                                    <div className="p-6 bg-background rounded-3xl border border-border-light flex items-center gap-4 group hover:bg-amber-50 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-black text-navy">{formatShortDate(selectedTicket.date)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Note Area */}
                            {selectedTicket.note && (
                                <div className="p-8 bg-blue-50/30 rounded-[2rem] border border-brand-primary/10 flex gap-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/20 -translate-y-12 translate-x-12 rounded-full blur-2xl" />
                                    <Info className="w-6 h-6 text-brand-primary shrink-0 mt-1 relative z-10" />
                                    <div className="relative z-10">
                                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-1.5 opacity-60">Ghi chú vận hành</span>
                                        <p className="text-sm text-navy font-bold leading-relaxed italic pr-4">&quot;{selectedTicket.note}&quot;</p>
                                    </div>
                                </div>
                            )}

                            {/* Items List refined */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h5 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                        <Package className="w-5 h-5 text-primary" />
                                        Danh sách thiết bị
                                    </h5>
                                    <span className="text-[10px] font-black text-muted uppercase tracking-widest tabular-nums">{selectedTicket.items.length} thiết bị</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {selectedTicket.items.map((item, idx) => (
                                        <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-primary-soft transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150",
                                                    (item.returned_at && new Date(item.returned_at).getFullYear() > 2000) ? "bg-emerald-500" : "bg-brand-primary"
                                                )} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-primary tracking-tight">{item.equipment_name}</span>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter">MÃ VẠCH: {item.barcode}</span>
                                                        <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-[9px] font-mono font-black text-primary border border-slate-100">STT: {item.barcode_stt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {(item.returned_at && new Date(item.returned_at).getFullYear() > 2000) ? (
                                                    <>
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-0.5">Đã Trả Lúc</span>
                                                        <span className="text-[10px] font-black text-primary uppercase">{formatTime(item.returned_at)} - {formatShortDate(item.returned_at)}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-0.5">Trạng thái</span>
                                                        <span className="text-[10px] font-black text-amber-600 uppercase">{item.status}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-12 bg-surface border-t border-border-soft flex items-center justify-between shrink-0">
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">HỆ THỐNG CECICS V2.0</p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowPrintView(true)}
                                    className="px-10 py-5 rounded-2xl font-black text-[10px] text-brand-primary bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all uppercase tracking-[0.3em] flex items-center gap-3 active:scale-95"
                                >
                                    <FileText className="w-5 h-5" />
                                    In phiếu mượn
                                </button>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-[10px] hover:bg-black transition-all uppercase tracking-[0.3em] shadow-2xl active:scale-95"
                                >
                                    Đóng chi tiết
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
