'use client';

import React, { useState } from 'react';
import { History, X, ChevronRight, FileText, Calendar, User, Building2, Package, Tag, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UsageHistory } from '@/types/rental';

import TicketPrintView from '@/components/rental/TicketPrintView';

export default function RecentActivity({ history }: { history: UsageHistory[] }) {
    const [selectedTicket, setSelectedTicket] = useState<UsageHistory | null>(null);
    const [showPrintView, setShowPrintView] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const formatDate = (date: Date) => {
        if (!isMounted) return "";
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const formatTime = (date: Date) => {
        if (!isMounted) return "";
        return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-900 text-xl flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <History className="w-5 h-5 text-blue-600" />
                    </div>
                    Lịch sử mượn trả gần nhất
                </h3>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-xl">Xem tất cả</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase tracking-[0.2em]">Thời gian</th>
                            <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase tracking-[0.2em]">Mã phiếu</th>
                            <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase tracking-[0.2em]">Bộ môn mượn</th>
                            <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase tracking-[0.2em]">Người mượn</th>
                            <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase tracking-[0.2em] text-right">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {history.map((record) => (
                            <tr
                                key={record.id}
                                onClick={() => setSelectedTicket(record)}
                                className="hover:bg-blue-50/40 transition-all group cursor-pointer"
                            >
                                <td className="py-5 px-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-700">{formatDate(record.date)}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{formatTime(record.date)}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-4 font-mono text-sm font-black text-blue-600">
                                    {record.ticket_no}
                                </td>
                                <td className="py-5 px-4">
                                    <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">{record.department_name}</span>
                                </td>
                                <td className="py-5 px-4 text-sm font-bold text-slate-800">
                                    {record.renter}
                                </td>
                                <td className="py-5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            record.status === 'returned'
                                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-100 text-amber-700 border border-amber-200"
                                        )}>
                                            {record.status === 'returned' ? 'Đã trả' : 'Đang mượn'}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                                    <p className="text-sm font-mono font-bold text-blue-600">{selectedTicket!.ticket_no}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ngày mượn</span>
                                    </div>
                                    <p className="font-bold text-slate-900">{isMounted ? new Date(selectedTicket!.date).toLocaleString('vi-VN') : ""}</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <User className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Người mượn</span>
                                    </div>
                                    <p className="font-bold text-slate-900">{selectedTicket!.renter}</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Building2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Bộ môn</span>
                                    </div>
                                    <p className="font-bold text-slate-900">{selectedTicket!.department_name}</p>
                                </div>
                            </div>

                            {/* Ticket Note */}
                            {selectedTicket.note && (
                                <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 flex gap-4">
                                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                                    <div>
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Ghi chú phiếu</span>
                                        <p className="text-sm text-slate-700 font-medium">{selectedTicket?.note}</p>
                                    </div>
                                </div>
                            )}

                            {/* Items Table */}
                            <div className="space-y-4">
                                <h5 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    <Package className="w-4 h-4 text-blue-500" />
                                    Danh sách thiết bị ({selectedTicket!.items.length})
                                </h5>
                                <div className="overflow-hidden rounded-2xl border border-slate-200">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Tên thiết bị</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">QR Code (Gốc)</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Mã STT</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedTicket!.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <span className="text-sm font-bold text-slate-800 tracking-tight">{item.equipment_name}</span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="text-xs font-mono font-black text-slate-400 uppercase">{item.barcode}</span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <Tag className="w-3.5 h-3.5 text-blue-500" />
                                                            <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                                                {item.barcode_stt}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hệ thống Quản lý Thiết bị CECICS</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowPrintView(true)}
                                    className="px-6 py-3 rounded-2xl font-black text-sm text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Xem phiếu theo dõi
                                </button>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                                >
                                    Đóng lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPrintView && selectedTicket && (
                <TicketPrintView
                    ticket={selectedTicket}
                    mode="rental"
                    onClose={() => setShowPrintView(false)}
                />
            )}
        </div>
    );
}
