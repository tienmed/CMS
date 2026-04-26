'use client';

import React from 'react';
import { Printer, X, RotateCcw } from 'lucide-react';
import { UsageHistory } from '@/types/rental';
import { useRouter } from 'next/navigation';

interface TicketPrintViewProps {
    ticket: UsageHistory;
    mode: 'rental' | 'return';
    sessionCount?: number;
    onClose: () => void;
}

export default function TicketPrintView({ ticket, mode, sessionCount, onClose }: TicketPrintViewProps) {
    const router = useRouter();
    const handlePrint = () => {
        window.print();
    };

    const handleCreateReturn = () => {
        // Chuyển hướng kèm tham số để ActiveTicketsTable tự mở modal trả
        router.push(`/dashboard/rental?ticket=${ticket.id}`);
        onClose();
    };

    const isRental = mode === 'rental';
    const displayTicketNo = isRental
        ? ticket.ticket_no
        : `${ticket.ticket_no}-${String(sessionCount || 1).padStart(2, '0')}`;

    const title = isRental ? 'PHIẾU MƯỢN THIẾT BỊ' : 'PHIẾU TRẢ THIẾT BỊ';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static print:block no-print-backdrop">
            {/* Modal Actions - Hidden on Print */}
            <div className="absolute top-6 right-6 flex items-center gap-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl hover:bg-blue-700 transition-all active:scale-95"
                >
                    <Printer className="w-5 h-5" />
                    In {isRental ? 'phiếu mượn' : 'phiếu trả'}
                </button>
                {isRental && ticket.status === 'rented' && (
                    <button
                        onClick={handleCreateReturn}
                        className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl hover:bg-amber-600 transition-all active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Tạo phiếu trả ngay
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all"
                >
                    <X className="w-7 h-7" />
                </button>
            </div>

            {/* A4 Content */}
            <div className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl mx-auto print:shadow-none print:m-0 print:p-[10mm] print:w-full print:min-h-0 print:static ticket-container text-black">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">{title}</h1>
                        <p className="text-sm font-bold mt-1 uppercase tracking-widest leading-tight max-w-md">CECICS - TRƯỜNG ĐẠI HỌC Y KHOA PHẠM NGỌC THẠCH</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest">Mã số phiếu {isRental ? 'mượn' : 'trả'}</p>
                        <p className="text-xl font-black">{displayTicketNo}</p>
                        {!isRental && (
                            <p className="text-[9px] font-bold opacity-60">Gốc: {ticket.ticket_no}</p>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-8 text-black">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{isRental ? 'Người mượn' : 'Người trả'}</p>
                        <p className="text-base font-bold border-b border-black pb-0.5">{ticket.renter}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">Bộ môn / Phòng ban</p>
                        <p className="text-base font-bold border-b border-black pb-0.5">{ticket.department_name}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">Ngày mượn</p>
                        <p className="text-base font-bold border-b border-black pb-0.5">{new Date(ticket.date).toLocaleString('vi-VN')}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{isRental ? 'Ngày dự kiến trả' : 'Thời gian ghi nhận'}</p>
                        <p className="text-base font-bold border-b border-black pb-0.5">
                            {isRental
                                ? (ticket.items[0]?.due_date ? new Date(ticket.items[0].due_date).toLocaleDateString('vi-VN') : "........................")
                                : new Date().toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>

                {/* Body: Items Table */}
                <div className="mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-1 italic opacity-60 print:opacity-100">Danh sách mô hình thiết bị {isRental ? 'mượn' : 'trả'}</h2>
                    <table className="w-full border-collapse border-2 border-black">
                        <thead>
                            <tr className="bg-slate-50 print:bg-transparent">
                                <th className="border-2 border-black p-2 text-center text-[9px] font-black uppercase tracking-wider w-8">STT</th>
                                <th className="border-2 border-black p-2 text-left text-[9px] font-black uppercase tracking-wider">Tên MH/TB</th>
                                <th className="border-2 border-black p-2 text-left text-[9px] font-black uppercase tracking-wider w-32">Mã QRCode (gốc)</th>
                                <th className="border-2 border-black p-2 text-left text-[9px] font-black uppercase tracking-wider w-24">Mã STT</th>
                                <th className="border-2 border-black p-2 text-center text-[9px] font-black uppercase tracking-wider w-24">Ngày mượn</th>
                                <th className="border-2 border-black p-2 text-center text-[9px] font-black uppercase tracking-wider w-24">Ngày trả</th>
                                <th className="border-2 border-black p-2 text-center text-[9px] font-black uppercase tracking-wider w-20">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ticket.items.map((item, idx) => {
                                const isReturned = !!item.returned_at;
                                const isLate = item.returned_at && item.due_date ? new Date(item.returned_at) > new Date(item.due_date) : false;

                                return (
                                    <tr key={idx}>
                                        <td className="border-2 border-black p-2 text-[10px] font-bold text-center">{idx + 1}</td>
                                        <td className="border-2 border-black p-2 text-[10px] font-bold">{item.equipment_name}</td>
                                        <td className="border-2 border-black p-2 text-[9px] font-mono font-bold uppercase">{item.barcode}</td>
                                        <td className="border-2 border-black p-2 text-[9px] font-mono font-bold text-blue-600 print:text-black">{item.barcode_stt}</td>
                                        <td className="border-2 border-black p-2 text-[10px] text-center font-bold">{new Date(ticket.date).toLocaleDateString('vi-VN')}</td>
                                        <td className="border-2 border-black p-2 text-[10px] text-center font-bold">
                                            {isReturned ? new Date(item.returned_at!).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="border-2 border-black p-2 text-[8px] font-black text-center uppercase">
                                            {isReturned ? (isLate ? 'TRẢ TRỄ' : 'ĐÚNG HẠN') : 'CHƯA TRẢ'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer: Note & Signatures */}
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">{isRental ? 'Ghi chú mượn' : 'Ghi chú trả'}</p>
                    <p className="text-xs min-h-[3em] border-b border-black italic leading-relaxed">
                        {ticket.note || "..........................................................................................................................................."}
                    </p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-20 text-center mt-12">
                    <div className="space-y-16">
                        <p className="text-xs font-black uppercase tracking-widest underline underline-offset-4">
                            {isRental ? 'Bên cho mượn' : 'Bên nhận trả (CECICS)'}
                        </p>
                        <p className="text-[9px] font-bold italic opacity-60 print:opacity-100">(Ký và ghi rõ họ tên)</p>
                    </div>
                    <div className="space-y-16">
                        <p className="text-xs font-black uppercase tracking-widest underline underline-offset-4">
                            {isRental ? 'Người mượn thiết bị' : 'Người trả thiết bị'}
                        </p>
                        <p className="text-[9px] font-bold italic opacity-60 print:opacity-100">(Ký và ghi rõ họ tên)</p>
                    </div>
                </div>

                {/* Print Time */}
                <div className="mt-20 pt-6 border-t border-slate-100 flex justify-between items-center text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 print:opacity-100 print:border-black">
                    <p>Ngày in: {new Date().toLocaleString('vi-VN')}</p>
                    <p>Hệ thống Quản lý Thiết bị CECICS v1.0</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body * {
                        visibility: hidden !important;
                    }
                    .no-print-backdrop, .no-print-backdrop * {
                        visibility: visible !important;
                    }
                    .no-print-backdrop {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .ticket-container {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 210mm !important;
                        margin: 0 !important;
                        padding: 15mm !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .ticket-container * {
                        color: #000000 !important;
                        border-color: #000000 !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            ` }} />
        </div>
    );
}
