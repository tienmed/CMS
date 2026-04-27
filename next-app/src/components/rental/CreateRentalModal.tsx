'use client';

import React, { useState } from 'react';
import { X, Plus, Search, User, Building2, Calendar as CalendarIcon, FileText, Check, AlertCircle, Loader2, ArrowRight, Star, Camera } from 'lucide-react';
import QRScanner from '../common/QRScanner';
import { cn } from '@/lib/utils';
import { Department } from '@/services/DepartmentService';
import { EquipmentItem } from '@/types/equipment';
import { createRentalTicketAction, validateBarcodeAction } from '@/app/actions/rental';

interface CreateRentalModalProps {
    departments: Department[];
    rentableItems: (EquipmentItem & { equipment_name: string; status_name: string; condition_name: string; condition_reject_msg: string })[];
    onSuccess?: () => void;
}

export default function CreateRentalModal({ departments, rentableItems, onSuccess }: CreateRentalModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conflictTicket, setConflictTicket] = useState<{ id: number; no: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const [formData, setFormData] = useState({
        renterName: '',
        departmentId: '',
        dueDate: '',
        note: '',
        selectedItems: [] as number[],
    });

    const filteredItems = rentableItems.filter(item =>
        (item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode_stt.toLowerCase().includes(searchTerm.toLowerCase())) &&
        item.condition_is_rentable // Chỉ hiện các thiết bị có thể mượn trong danh sách
    );

    const toggleItem = (id: number) => {
        const item = rentableItems.find(i => i.id === id);

        // Kiểm tra ràng buộc tình trạng thiết bị
        if (item && !item.condition_is_rentable) {
            setError(`Không thể mượn: ${item.barcode_stt} - ${item.condition_name}${item.condition_reject_msg ? `: ${item.condition_reject_msg}` : ''}`);
            setConflictTicket(null);
            setTimeout(() => setError(null), 5000);
            return;
        }

        setFormData(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.includes(id)
                ? prev.selectedItems.filter(itemId => itemId !== id)
                : [...prev.selectedItems, id]
        }));
        setError(null);
        setConflictTicket(null);
    };

    const handleQRScan = async (barcode: string) => {
        setIsScanning(false);
        const term = barcode.trim().toUpperCase();
        if (!term) return;

        // Tự động tìm và chọn nếu có sẵn
        const item = rentableItems.find(i => i.barcode_stt.toUpperCase() === term);
        if (item) {
            if (!formData.selectedItems.includes(item.id)) {
                toggleItem(item.id);
            }
            return;
        }

        // Nếu không có sẵn, dùng logic validate sẵng có
        setLoading(true);
        const response: any = await validateBarcodeAction(term);
        setLoading(true); // Giữ loading xíu để user thấy có phản hồi

        if (response.available && response.item) {
            toggleItem(response.item.id);
        } else if (response.reason === 'rented' && response.activeTicket) {
            setError(`Thiết bị ${term} đang vướng ở phiếu `);
            setConflictTicket({ id: response.activeTicket.id, no: response.activeTicket.ticket_no });
        } else {
            setError(`Không tìm thấy thiết bị hoặc không thể mượn: ${term}`);
        }
        setLoading(false);
    };

    const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const term = searchTerm.trim().toUpperCase();
            if (!term) return;

            // 1. Kiểm tra trong danh sách đã load sẵn (tối ưu tốc độ)
            const item = rentableItems.find(i => i.barcode_stt.toUpperCase() === term);
            if (item) {
                if (!formData.selectedItems.includes(item.id)) {
                    toggleItem(item.id);
                }
                setSearchTerm('');
                return;
            }

            // 2. Nếu không có trong danh sách local, gọi Server Action để kiểm tra sâu hơn (vướng phiếu khác, hỏng, v.v.)
            setLoading(true);
            const response: any = await validateBarcodeAction(term);
            setLoading(false);

            // Type guard cho kết quả trả về
            if ('error' in response) {
                setError(`Lỗi hệ thống: ${response.error}`);
                setConflictTicket(null);
                return;
            }

            if (response.available && response.item) {
                toggleItem(response.item.id);
                setSearchTerm('');
            } else if (response.reason === 'rented' && response.activeTicket) {
                setError(`Thiết bị ${term} đang vướng ở phiếu `);
                setConflictTicket({ id: response.activeTicket.id, no: response.activeTicket.ticket_no });
            } else if (response.reason === 'broken' && response.item) {
                setError(`Không thể mượn: ${term} - ${response.item.condition_name}${response.item.reject_msg ? `: ${response.item.reject_msg}` : ''}`);
                setConflictTicket(null);
            } else {
                setError(`Không tìm thấy thiết bị với mã "${term}"`);
                setConflictTicket(null);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.selectedItems.length === 0) {
            setError('Vui lòng chọn ít nhất một thiết bị');
            return;
        }

        setLoading(true);
        setError(null);

        const ticketNo = `RT-${Date.now().toString().slice(-6)}`;

        const result = await createRentalTicketAction({
            ticket_no: ticketNo,
            rented_full_name: formData.renterName,
            rented_by: parseInt(formData.departmentId),
            rented_date: new Date(),
            due_date: new Date(formData.dueDate),
            note: formData.note,
        }, formData.selectedItems);

        setLoading(false);

        if (result.success) {
            setIsOpen(false);
            setFormData({
                renterName: '',
                departmentId: '',
                dueDate: '',
                note: '',
                selectedItems: [],
            });
            if (onSuccess) onSuccess();
        } else {
            setError(result.error || 'Đã có lỗi xảy ra');
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
                <Plus className="w-5 h-5" />
                Tạo phiếu mượn mới
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500">
                    <div className="bg-white md:rounded-[3rem] shadow-2xl w-full h-full md:h-auto md:max-w-5xl overflow-hidden border border-white/20 animate-in zoom-in-95 md:slide-in-from-bottom-12 duration-700 flex flex-col md:max-h-[90vh]">

                        {/* Header - Premium Navigation Feel */}
                        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/20 backdrop-blur-sm flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-brand-primary rounded-[1.5rem] shadow-[0_20px_40px_rgba(67,24,255,0.2)] flex items-center justify-center rotate-3 hover:rotate-0 transition-all duration-500">
                                    <Plus className="w-8 h-8 text-white stroke-[3px]" />
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">Create Rental</h4>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Initiating New Handover Protocol</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all text-slate-300 hover:text-slate-900 active:scale-90"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row bg-white">

                            {/* Left Side: Metadata Interface */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10 border-r border-slate-50 bg-slate-50/5">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 px-1">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-brand-primary">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Renter Specification</h5>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="relative group/field">
                                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest absolute left-5 top-3.5 z-10 group-focus-within/field:text-brand-primary transition-colors">Personnel Identity</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter full name..."
                                                className="w-full pl-5 pr-5 pt-8 pb-4 bg-white border border-slate-100 rounded-[1.2rem] text-slate-900 font-black text-base focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all shadow-sm"
                                                value={formData.renterName}
                                                onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
                                            />
                                        </div>

                                        <div className="relative group/field">
                                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest absolute left-5 top-3.5 z-10 group-focus-within/field:text-brand-primary transition-colors">Departmental Node</label>
                                            <Building2 className="w-5 h-5 text-slate-200 absolute right-5 bottom-4 group-focus-within/field:text-brand-primary transition-all" />
                                            <select
                                                required
                                                className="w-full pl-5 pr-14 pt-8 pb-4 bg-white border border-slate-100 rounded-[1.2rem] text-slate-900 font-black text-base focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all appearance-none shadow-sm cursor-pointer"
                                                value={formData.departmentId}
                                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                            >
                                                <option value="" disabled className="text-slate-300 font-bold">Select Origin...</option>
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.id} className="text-slate-900 font-bold">{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="relative group/field">
                                                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest absolute left-5 top-3.5 z-10 group-focus-within/field:text-brand-primary transition-colors">Return Deadline</label>
                                                <CalendarIcon className="w-5 h-5 text-slate-200 absolute right-5 bottom-4 group-focus-within/field:text-brand-primary transition-all" />
                                                <input
                                                    required
                                                    type="date"
                                                    className="w-full px-5 pt-8 pb-4 bg-white border border-slate-100 rounded-[1.2rem] text-slate-900 font-black text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all cursor-pointer shadow-sm"
                                                    value={formData.dueDate}
                                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="bg-slate-50 border border-slate-100 rounded-[1.2rem] p-4 flex flex-col justify-center">
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Protocol Type</span>
                                                <span className="text-xs font-black text-slate-500 uppercase mt-1">Temporary Handover</span>
                                            </div>
                                        </div>

                                        <div className="relative group/field">
                                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest absolute left-5 top-3.5 z-10 group-focus-within/field:text-brand-primary transition-colors">Handover Memoranda</label>
                                            <FileText className="w-5 h-5 text-slate-200 absolute right-5 top-9 group-focus-within/field:text-brand-primary transition-all" />
                                            <textarea
                                                placeholder="Add context or special instructions..."
                                                rows={4}
                                                className="w-full pl-5 pr-14 pt-8 pb-4 bg-white border border-slate-100 rounded-[1.2rem] text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all resize-none shadow-sm"
                                                value={formData.note}
                                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Inventory Selector */}
                            <div className="flex-1 overflow-hidden flex flex-col p-10 space-y-8 bg-slate-50/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Equipment Selection</h5>
                                    </div>
                                    <div className="px-3 py-1 bg-brand-primary rounded-lg text-white font-black text-[10px] uppercase tracking-tighter shadow-[0_8px_16px_rgba(67,24,255,0.2)]">
                                        {formData.selectedItems.length} STACKED
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="relative group/search flex-1">
                                        <Search className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within/search:text-brand-primary transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Scan barcode or manual search..."
                                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.2rem] text-sm font-black focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all shadow-sm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={handleSearchKeyDown}
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsScanning(true)}
                                        className="w-14 h-14 bg-white border border-slate-100 rounded-[1.2rem] text-slate-300 hover:text-brand-primary hover:border-brand-primary/20 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all flex items-center justify-center group/cam"
                                        title="Initiate Optical Scan"
                                    >
                                        <Camera className="w-6 h-6 group-hover/cam:scale-110 transition-transform" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar">
                                    {filteredItems.length > 0 ? filteredItems.map(item => {
                                        const isSelected = formData.selectedItems.includes(item.id);
                                        const isDisabled = !item.condition_is_rentable;

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => toggleItem(item.id)}
                                                className={cn(
                                                    "p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between group/card relative overflow-hidden",
                                                    isSelected
                                                        ? "bg-white border-brand-primary shadow-[0_20px_40px_rgba(67,24,255,0.08)] scale-[1.02]"
                                                        : isDisabled
                                                            ? "bg-slate-50 border-slate-50 opacity-40 grayscale pointer-events-none"
                                                            : "bg-white border-slate-50 hover:border-slate-100 hover:shadow-soft"
                                                )}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary" />
                                                )}
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-3">
                                                        <span className={cn("text-base font-black tracking-tight transition-colors transition-transform group-hover/card:translate-x-1",
                                                            isSelected ? "text-brand-primary" : "text-slate-700"
                                                        )}>
                                                            {item.equipment_name}
                                                        </span>
                                                        {item.is_recommended && !isDisabled && (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 rounded-lg border border-amber-100 shadow-sm">
                                                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">Gold Standard</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-mono font-black text-slate-300 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 uppercase tracking-widest">{item.barcode_stt}</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">
                                                            Cycles: <span className={cn(isSelected ? "text-brand-primary" : "text-slate-600")}>{item.usage_count || 0}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "w-8 h-8 rounded-[0.8rem] border-2 flex items-center justify-center transition-all duration-300",
                                                    isSelected
                                                        ? "bg-brand-primary border-brand-primary shadow-[0_8px_16px_rgba(67,24,255,0.3)] rotate-0"
                                                        : "border-slate-100 bg-slate-50 group-hover/card:border-slate-200 group-hover/card:bg-white -rotate-12 group-hover/card:rotate-0"
                                                )}>
                                                    {isSelected ? (
                                                        <Check className="w-4 h-4 text-white stroke-[4]" />
                                                    ) : (
                                                        <Plus className="w-4 h-4 text-slate-200 group-hover/card:text-slate-400 transition-colors" />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <div className="py-24 text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100/50 shadow-inner mb-6">
                                                <Search className="w-8 h-8 text-slate-100" />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No valid assets remaining in cluster</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Footer - Final Commitment */}
                        <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8 shrink-0">
                            <div className="flex-1">
                                {error ? (
                                    <div className="flex items-center gap-4 bg-red-50 px-6 py-4 rounded-2xl border border-red-100 animate-in slide-in-from-left-4 shadow-sm">
                                        <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">Critical Fault Detected</span>
                                            <span className="text-sm font-black text-red-600 tracking-tight">
                                                {error}
                                                {conflictTicket && (
                                                    <button
                                                        type="button"
                                                        onClick={() => window.location.href = `/dashboard/rental?ticket=${conflictTicket.id}`}
                                                        className="ml-2 text-brand-primary hover:underline inline-flex items-center gap-1 group"
                                                    >
                                                        Review Ticket #{conflictTicket.no}
                                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 text-slate-300">
                                        <div className="w-2 h-2 rounded-full bg-brand-primary/20"></div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] font-sans">CECICS Verified Handover Protocol v2.0</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-4 rounded-2xl font-black text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all uppercase tracking-widest active:scale-95"
                                >
                                    Abort Process
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || formData.selectedItems.length === 0}
                                    className={cn(
                                        "flex-1 md:flex-none px-12 py-4 rounded-2xl font-black text-xs text-white transition-all uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 group/submit disabled:opacity-30 disabled:scale-100",
                                        loading || formData.selectedItems.length === 0
                                            ? "bg-slate-300 shadow-none cursor-not-allowed"
                                            : "bg-brand-primary shadow-[0_20px_40px_rgba(67,24,255,0.2)] hover:shadow-[0_25px_50px_rgba(67,24,255,0.3)] hover:-translate-y-1 active:scale-95"
                                    )}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Encrypting Data...
                                        </>
                                    ) : (
                                        <>
                                            Authorize Handover
                                            <ArrowRight className="w-5 h-5 group-hover/submit:translate-x-1.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isScanning && (
                <QRScanner
                    onScanSuccess={handleQRScan}
                    onClose={() => setIsScanning(false)}
                />
            )}
        </>
    );
}
