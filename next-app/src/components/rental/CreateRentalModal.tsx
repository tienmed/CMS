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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white md:rounded-[2.5rem] shadow-2xl w-full h-full md:h-auto md:max-w-4xl overflow-hidden border border-slate-200 animate-in zoom-in-95 md:slide-in-from-bottom-10 duration-500 flex flex-col md:max-h-[90vh]">

                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-blue-600 rounded-[1.2rem] shadow-xl shadow-blue-200 rotate-3 group-hover:rotate-0 transition-transform">
                                    <Plus className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">Tạo phiếu mượn mới</h4>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Hệ thống quản lý CECICS</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-600 active:scale-90"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row">

                            {/* Left Side: Form Info */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 border-r border-slate-100">
                                <div className="space-y-6">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <User className="w-4 h-4 text-blue-500" />
                                        Thông tin người mượn
                                    </h5>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute left-4 top-2 pointer-events-none">Họ và tên</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Nhập tên người mượn..."
                                                className="w-full pl-4 pr-4 pt-7 pb-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                                value={formData.renterName}
                                                onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute left-4 top-2 pointer-events-none">Bộ môn / Phòng ban</label>
                                            <Building2 className="w-5 h-5 text-slate-300 absolute right-4 bottom-4" />
                                            <select
                                                required
                                                className="w-full pl-4 pr-12 pt-7 pb-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                                                value={formData.departmentId}
                                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                            >
                                                <option value="" disabled>Chọn bộ môn...</option>
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="relative group">
                                            <div className="flex items-center justify-between mb-2 px-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày dự kiến trả</label>
                                            </div>
                                            <div className="relative">
                                                <CalendarIcon className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    required
                                                    type="date"
                                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                                                    value={formData.dueDate}
                                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute left-4 top-2 pointer-events-none">Ghi chú (nếu có)</label>
                                            <FileText className="w-5 h-5 text-slate-300 absolute right-4 top-8" />
                                            <textarea
                                                placeholder="..."
                                                rows={3}
                                                className="w-full pl-4 pr-4 pt-7 pb-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                                                value={formData.note}
                                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Item Selection */}
                            <div className="flex-1 overflow-hidden flex flex-col p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <Check className="w-4 h-4 text-blue-500" />
                                        Chọn thiết bị ({formData.selectedItems.length})
                                    </h5>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="md:hidden p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <div className="relative group flex-1">
                                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Quét hoặc nhập tên..."
                                            className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={handleSearchKeyDown}
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsScanning(true)}
                                        className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
                                        title="Bật Camera Quét"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {filteredItems.length > 0 ? filteredItems.map(item => {
                                        const isSelected = formData.selectedItems.includes(item.id);
                                        const isDisabled = !item.condition_is_rentable;

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => toggleItem(item.id)}
                                                className={cn(
                                                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                                                    isSelected
                                                        ? "bg-blue-50 border-blue-500 shadow-lg shadow-blue-100"
                                                        : isDisabled
                                                            ? "bg-red-50/50 border-red-100 opacity-80"
                                                            : "bg-white border-slate-100 hover:border-slate-200"
                                                )}
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("text-sm font-black tracking-tight transition-colors",
                                                            isSelected ? "text-blue-700" : isDisabled ? "text-red-900" : "text-slate-800"
                                                        )}>
                                                            {item.equipment_name}
                                                        </span>
                                                        {item.is_recommended && !isDisabled && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-[8px] font-black uppercase tracking-tighter shadow-sm border border-amber-200">
                                                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                                                Gợi ý
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">#{item.barcode_stt}</span>
                                                        <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                                                            Mượn: {item.usage_count || 0} lần
                                                        </span>
                                                        {isDisabled && (
                                                            <span className="text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                                                                Không thể mượn
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                    isSelected ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-200" :
                                                        isDisabled ? "bg-red-100 border-red-200" :
                                                            "border-slate-200 group-hover:border-slate-300"
                                                )}>
                                                    {isSelected ? (
                                                        <Check className="w-3.5 h-3.5 text-white stroke-[4]" />
                                                    ) : isDisabled ? (
                                                        <X className="w-3.5 h-3.5 text-red-500 stroke-[3]" />
                                                    ) : null}
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <div className="py-20 text-center space-y-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200">
                                                <Search className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 italic">Không tìm thấy thiết bị nào sẵn sàng</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
                            {error && (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100 animate-in slide-in-from-left-2 transition-all">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-xs font-black uppercase tracking-wider">
                                            {error}
                                            {conflictTicket && (
                                                <button
                                                    type="button"
                                                    onClick={() => window.location.href = `/dashboard/rental?ticket=${conflictTicket.id}`}
                                                    className="ml-1 text-blue-600 hover:underline inline-flex items-center gap-1 group"
                                                >
                                                    [{conflictTicket.no}]
                                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                </button>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {!error && (
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hệ thống CECICS • Đảm bảo kiểm tra thiết bị trước khi hoàn tất</span>
                            )}

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-200 transition-all uppercase tracking-widest"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || formData.selectedItems.length === 0}
                                    className={cn(
                                        "flex-1 md:flex-none px-10 py-3.5 rounded-2xl font-black text-sm text-white transition-all uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3",
                                        loading || formData.selectedItems.length === 0 ? "bg-slate-300 opacity-50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-2xl active:scale-95"
                                    )}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Đang xử lý
                                        </>
                                    ) : (
                                        <>
                                            Hoàn tất & Lưu
                                            <Plus className="w-4 h-4" />
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
