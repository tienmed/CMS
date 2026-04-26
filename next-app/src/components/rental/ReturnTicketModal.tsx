'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, RotateCcw, AlertTriangle, Loader2, Check, Package, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UsageHistory } from '@/types/rental';
import { getTicketDetailsAction, returnItemsAction } from '@/app/actions/rental';
import TicketPrintView from '@/components/rental/TicketPrintView';
import ReturnTicketPrintView from '@/components/rental/ReturnTicketPrintView';

interface ReturnTicketModalProps {
    ticketId: number;
    ticketNo: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ReturnTicketModal({ ticketId, ticketNo, onClose, onSuccess }: ReturnTicketModalProps) {
    const [ticket, setTicket] = useState<UsageHistory | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedDetailIds, setSelectedDetailIds] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showPrintView, setShowPrintView] = useState(false);
    const [showReturnTicket, setShowReturnTicket] = useState(false);
    const [sessionCount, setSessionCount] = useState(1);
    const [lastReturnedDetails, setLastReturnedDetails] = useState<number[]>([]);
    const [scanValue, setScanValue] = useState('');
    const [scanWarning, setScanWarning] = useState<string | null>(null);

    const scanInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchDetails() {
            setLoading(true);
            const data = await getTicketDetailsAction(ticketId);
            setTicket(data);
            setLoading(false);
        }
        fetchDetails();
    }, [ticketId]);

    // Luôn focus vào input scan để rảnh tay
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.activeElement?.tagName !== 'INPUT' && !showPrintView && !showReturnTicket) {
                scanInputRef.current?.focus();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [showPrintView, showReturnTicket]);

    const handleScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanValue || !ticket) return;

        const barcode = scanValue.trim();
        const item = ticket.items.find(i => i.barcode_stt === barcode);

        if (!item) {
            setScanWarning(`Mã "${barcode}" không có trong phiếu!`);
            setTimeout(() => setScanWarning(null), 3000);
        } else if (item.returned_at) {
            setScanWarning(`"${item.equipment_name}" đã được trả.`);
            setTimeout(() => setScanWarning(null), 3000);
        } else {
            if (!selectedDetailIds.includes(item.detail_id!)) {
                setSelectedDetailIds(prev => [...prev, item.detail_id!]);
            }
            setScanWarning(null);
        }
        setScanValue('');
    };

    const toggleItem = (detailId: number) => {
        setSelectedDetailIds(prev =>
            prev.includes(detailId)
                ? prev.filter(id => id !== detailId)
                : [...prev, detailId]
        );
    };

    const handleReturn = async () => {
        if (selectedDetailIds.length === 0) return;

        setSubmitting(true);
        setError(null);

        const result = await returnItemsAction(ticketId, selectedDetailIds) as any;

        if (result.success) {
            setLastReturnedDetails([...selectedDetailIds]);
            setSessionCount(result.sessionCount || 1);
            setShowReturnTicket(true);
            if (onSuccess) onSuccess();
        } else {
            setError(result.error || 'Đã có lỗi xảy ra');
            setSubmitting(false);
        }
    };

    const handleCloseReturnTicket = () => {
        setShowReturnTicket(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-emerald-500 rounded-[1.2rem] shadow-xl shadow-emerald-100 -rotate-3">
                            <RotateCcw className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Ghi nhận trả thiết bị</h4>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Số phiếu: {ticketNo}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-600 active:scale-90"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Scanner Input Area */}
                {!loading && ticket && (
                    <div className="px-8 pt-6 pb-2">
                        <form onSubmit={handleScan} className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <QrCode className={cn("w-6 h-6 transition-colors", scanWarning ? "text-red-500" : "text-emerald-500")} />
                            </div>
                            <input
                                ref={scanInputRef}
                                type="text"
                                value={scanValue}
                                onChange={(e) => setScanValue(e.target.value)}
                                placeholder="Quét mã thiết bị để trả rảnh tay..."
                                className={cn(
                                    "w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl py-5 pl-14 pr-6 text-base font-bold transition-all shadow-inner placeholder:text-slate-400 placeholder:font-medium outline-none",
                                    scanWarning && "border-red-400 bg-red-50 focus:border-red-500"
                                )}
                            />
                            {scanWarning && (
                                <div className="absolute -bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider animate-bounce shadow-lg ring-4 ring-white">
                                    {scanWarning}
                                </div>
                            )}
                        </form>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                            <p className="font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Đang tải danh sách thiết bị...</p>
                        </div>
                    ) : ticket ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Người mượn</span>
                                    <p className="text-sm font-bold text-slate-900">{ticket.renter}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Bộ môn</span>
                                    <p className="text-sm font-bold text-slate-900">{ticket.department_name}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Package className="w-4 h-4 text-emerald-500" />
                                    Thiết bị chờ trả ({ticket.items.filter(i => !i.returned_at).length})
                                </h5>

                                <div className="space-y-3">
                                    {ticket.items.map(item => {
                                        const isReturned = !!item.returned_at;
                                        const isSelected = selectedDetailIds.includes(item.detail_id!);
                                        const isLate = item.due_date ? new Date() > new Date(item.due_date) : false;

                                        return (
                                            <div
                                                key={item.detail_id}
                                                onClick={() => !isReturned && toggleItem(item.detail_id!)}
                                                className={cn(
                                                    "p-4 rounded-2xl border-2 transition-all flex items-center justify-between group",
                                                    isReturned
                                                        ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
                                                        : isSelected
                                                            ? "bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-100 cursor-pointer"
                                                            : "bg-white border-slate-100 hover:border-slate-200 cursor-pointer"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                        isReturned ? "bg-slate-200" : isSelected ? "bg-emerald-500" : "bg-slate-100 group-hover:bg-slate-200"
                                                    )}>
                                                        {isReturned ? (
                                                            <CheckCircle2 className="w-5 h-5 text-slate-400" />
                                                        ) : (
                                                            <Package className={cn("w-5 h-5", isSelected ? "text-white" : "text-slate-400")} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={cn("text-sm font-black tracking-tight", isReturned ? "text-slate-500" : "text-slate-900")}>
                                                            {item.equipment_name}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-mono font-bold text-slate-400">#{item.barcode_stt}</span>
                                                            {isReturned ? (
                                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Đã trả</span>
                                                            ) : isLate ? (
                                                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Quá hạn</span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Đúng hạn</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {!isReturned && (
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                        isSelected ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-200" : "border-slate-200 group-hover:border-slate-300"
                                                    )}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
                            <p className="text-slate-500 font-bold">Không tìm thấy thông tin phiếu</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-center">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-wider">{error}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setShowPrintView(true)}
                            className="px-6 py-3.5 rounded-2xl font-black text-sm text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center gap-2"
                        >
                            Xem phiếu mượn
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3.5 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-200 transition-all uppercase tracking-widest"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={handleReturn}
                            disabled={submitting || selectedDetailIds.length === 0}
                            className={cn(
                                "px-10 py-3.5 rounded-2xl font-black text-sm text-white transition-all uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-3",
                                submitting || selectedDetailIds.length === 0 ? "bg-slate-300 opacity-50 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-2xl active:scale-95"
                            )}
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                                <>
                                    Xác nhận trả
                                    <RotateCcw className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {showPrintView && ticket && (
                <TicketPrintView
                    ticket={ticket}
                    onClose={() => setShowPrintView(false)}
                />
            )}

            {showReturnTicket && ticket && (
                <ReturnTicketPrintView
                    ticket={ticket}
                    returnedDetailIds={lastReturnedDetails}
                    sessionCount={sessionCount}
                    onClose={handleCloseReturnTicket}
                />
            )}
        </div>
    );
}
