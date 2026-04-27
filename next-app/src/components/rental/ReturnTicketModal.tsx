'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, RotateCcw, AlertTriangle, Loader2, Check, Package, QrCode, Camera } from 'lucide-react';
import QRScanner from '../common/QRScanner';
import { cn } from '@/lib/utils';
import { UsageHistory } from '@/types/rental';
import { getTicketDetailsAction, returnItemsAction } from '@/app/actions/rental';
import TicketPrintView from '@/components/rental/TicketPrintView';

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
    const [sessionCount, setSessionCount] = useState(1);
    const [scanValue, setScanValue] = useState('');
    const [scanWarning, setScanWarning] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const scanInputRef = useRef<HTMLInputElement>(null);

    const fetchDetails = async () => {
        setLoading(true);
        const data = await getTicketDetailsAction(ticketId);
        setTicket(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDetails();
    }, [ticketId]);

    // Luôn focus vào input scan để rảnh tay
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.activeElement?.tagName !== 'INPUT' && !showPrintView) {
                scanInputRef.current?.focus();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [showPrintView]);

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

    const handleQRScan = (barcode: string) => {
        setIsScanning(false);
        if (!barcode || !ticket) return;

        const term = barcode.trim();
        const item = ticket.items.find(i => i.barcode_stt === term);

        if (!item) {
            setScanWarning(`Mã "${term}" không có trong phiếu!`);
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
            // Tải lại dữ liệu phiếu để có thông tin trả mới nhất
            setSessionCount(result.sessionCount || 1);
            await fetchDetails();
            setSelectedDetailIds([]);
            setShowPrintView(true);
            setSubmitting(false);
            if (onSuccess) onSuccess();
        } else {
            setError(result.error || 'Đã có lỗi xảy ra');
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="bg-white md:rounded-[3rem] shadow-2xl w-full h-full md:h-auto md:max-w-3xl overflow-hidden border border-white/20 animate-in zoom-in-95 md:slide-in-from-bottom-12 duration-700 flex flex-col md:max-h-[90vh]">

                {/* Header - Premium Navigation Feel */}
                <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/20 backdrop-blur-sm flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-500 rounded-[1.5rem] shadow-[0_20px_40px_rgba(16,185,129,0.2)] flex items-center justify-center -rotate-3 hover:rotate-0 transition-all duration-500">
                            <RotateCcw className="w-8 h-8 text-white stroke-[3px]" />
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tight">Post-Operational Return</h4>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Ticket Reconciliation: {ticketNo}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all text-slate-300 hover:text-slate-900 active:scale-90"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scanner Interface Area */}
                {!loading && ticket && (
                    <div className="px-10 pt-10 pb-4 shrink-0">
                        <div className="flex gap-4">
                            <form onSubmit={handleScan} className="relative group/search flex-1">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
                                    <QrCode className={cn("w-6 h-6 transition-all duration-500", scanWarning ? "text-red-500 scale-125" : "text-emerald-500")} />
                                </div>
                                <input
                                    ref={scanInputRef}
                                    type="text"
                                    value={scanValue}
                                    onChange={(e) => setScanValue(e.target.value)}
                                    placeholder="Execute Passive Optical Handover (Scan)..."
                                    className={cn(
                                        "w-full bg-white border border-slate-100 focus:ring-4 rounded-[1.2rem] py-5 pl-15 pr-6 text-base font-black transition-all shadow-sm outline-none",
                                        scanWarning
                                            ? "border-red-200 ring-red-500/5 text-red-600 focus:border-red-300"
                                            : "focus:ring-emerald-500/5 focus:border-emerald-500/20"
                                    )}
                                />
                                {scanWarning && (
                                    <div className="absolute -bottom-3 right-6 bg-red-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-top-2 duration-300 shadow-xl ring-4 ring-white">
                                        {scanWarning}
                                    </div>
                                )}
                            </form>
                            <button
                                type="button"
                                onClick={() => setIsScanning(true)}
                                className="w-16 h-16 bg-white border border-slate-100 rounded-[1.2rem] text-slate-300 hover:text-emerald-600 hover:border-emerald-500/20 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all flex items-center justify-center group/cam"
                                title="Bật Camera Quét"
                            >
                                <Camera className="w-6 h-6 group-hover/cam:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-6">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 animate-spin text-brand-primary" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></div>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] animate-pulse">Syncing Inventory Ledger...</p>
                        </div>
                    ) : ticket ? (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-50 flex flex-col">
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2 leading-none">Personnel Node</span>
                                    <p className="text-base font-black text-slate-900 tracking-tight">{ticket?.renter}</p>
                                </div>
                                <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-50 flex flex-col">
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2 leading-none">Origin Sector</span>
                                    <p className="text-base font-black text-slate-900 tracking-tight">{ticket?.department_name}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Queue for Reconciliation</h5>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-500 rounded-lg text-white font-black text-[10px] uppercase tracking-tighter">
                                        {ticket?.items.filter(i => !i.returned_at).length} PENDING
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {ticket?.items.map(item => {
                                        const isReturned = !!item.returned_at;
                                        const isSelected = selectedDetailIds.includes(item.detail_id!);
                                        const isLate = item.due_date ? new Date() > new Date(item.due_date) : false;

                                        return (
                                            <div
                                                key={item.detail_id}
                                                onClick={() => !isReturned && toggleItem(item.detail_id!)}
                                                className={cn(
                                                    "p-5 rounded-[1.8rem] border-2 transition-all flex items-center justify-between group relative overflow-hidden",
                                                    isReturned
                                                        ? "bg-slate-50/50 border-slate-50 opacity-40 grayscale-[0.5] cursor-default"
                                                        : isSelected
                                                            ? "bg-white border-emerald-500 shadow-[0_20px_40px_rgba(16,185,129,0.08)] scale-[1.02] cursor-pointer"
                                                            : "bg-white border-slate-50 hover:border-slate-100 hover:shadow-soft cursor-pointer"
                                                )}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                                                )}
                                                <div className="flex items-center gap-5">
                                                    <div className={cn(
                                                        "w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all duration-500",
                                                        isReturned
                                                            ? "bg-slate-100"
                                                            : isSelected
                                                                ? "bg-emerald-500 shadow-[0_12px_24px_rgba(16,185,129,0.3)] rotate-0"
                                                                : "bg-slate-50 group-hover:rotate-0 -rotate-3 group-hover:bg-white border border-transparent group-hover:border-slate-100"
                                                    )}>
                                                        {isReturned ? (
                                                            <CheckCircle2 className="w-6 h-6 text-slate-300" />
                                                        ) : (
                                                            <Package className={cn("w-6 h-6 transition-transform group-hover:scale-110", isSelected ? "text-white" : "text-slate-300")} />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <p className={cn("text-base font-black tracking-tight", isReturned ? "text-slate-400" : "text-slate-800")}>
                                                            {item.equipment_name}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-mono font-black text-slate-300 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 uppercase tracking-widest">{item.barcode_stt}</span>
                                                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                            {isReturned ? (
                                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Reconciliation Complete</span>
                                                            ) : isLate ? (
                                                                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">SLA Breach Detected</span>
                                                            ) : (
                                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Within Protocol Timeline</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {!isReturned && (
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-[0.8rem] border-2 flex items-center justify-center transition-all duration-300",
                                                        isSelected
                                                            ? "bg-emerald-500 border-emerald-500 shadow-md rotate-0"
                                                            : "border-slate-100 bg-slate-50 group-hover:border-slate-200 group-hover:bg-white -rotate-12 group-hover:rotate-0"
                                                    )}>
                                                        {isSelected ? (
                                                            <Check className="w-4 h-4 text-white stroke-[4]" />
                                                        ) : (
                                                            <RotateCcw className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-inner mb-8">
                                <AlertTriangle className="w-12 h-12 text-amber-500" />
                            </div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Handover Identifier Not Responsive</p>
                        </div>
                    )}
                </div>

                {/* Footer - Verification Protocol */}
                <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8 shrink-0">
                    <div className="flex-1">
                        {error ? (
                            <div className="flex items-center gap-4 bg-red-50 px-6 py-4 rounded-2xl border border-red-100 animate-in slide-in-from-left-4 shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">Operational Fault</span>
                                    <span className="text-sm font-black text-red-600 tracking-tight">{error}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] font-sans">CECICS Secured Audit Protocol v2.4</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setShowPrintView(true)}
                            className="px-8 py-4 rounded-2xl font-black text-xs text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-all uppercase tracking-widest active:scale-95"
                        >
                            Manifest View
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all uppercase tracking-widest active:scale-95"
                        >
                            Deactivate
                        </button>
                        <button
                            onClick={handleReturn}
                            disabled={submitting || selectedDetailIds.length === 0}
                            className={cn(
                                "flex-1 md:flex-none px-12 py-4 rounded-2xl font-black text-xs text-white transition-all uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 group/submit disabled:opacity-30 disabled:scale-100",
                                submitting || selectedDetailIds.length === 0
                                    ? "bg-slate-300 shadow-none cursor-not-allowed"
                                    : "bg-emerald-600 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:scale-95"
                            )}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    Audit & Confirm
                                    <RotateCcw className="w-5 h-5 group-hover/submit:-rotate-45 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {showPrintView && ticket && (
                <TicketPrintView
                    ticket={ticket!}
                    mode="return"
                    sessionCount={sessionCount}
                    onClose={() => setShowPrintView(false)}
                />
            )}

            {isScanning && (
                <QRScanner
                    onScanSuccess={handleQRScan}
                    onClose={() => setIsScanning(false)}
                />
            )}
        </div>
    );
}
