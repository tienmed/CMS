'use client';

import React from 'react';
import { Printer, X } from 'lucide-react';
import { UsageHistory } from '@/types/rental';

interface ReturnTicketPrintViewProps {
    ticket: UsageHistory;
    returnedDetailIds: number[];
    sessionCount: number;
    onClose: () => void;
}

export default function ReturnTicketPrintView({ ticket, returnedDetailIds, sessionCount, onClose }: ReturnTicketPrintViewProps) {
    const returnedItems = ticket.items.filter(item => returnedDetailIds.includes(item.detail_id!));
    const returnTicketNo = `${ticket.ticket_no}-${String(sessionCount).padStart(2, '0')}`;
    const now = new Date();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static print:block no-print-backdrop">
            {/* Modal Actions - Hidden on Print */}
            <div className="absolute top-6 right-6 flex items-center gap-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
                >
                    <Printer className="w-5 h-5" />
                    In phiếu trả
                </button>
                <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all"
                >
                    <X className="w-7 h-7" />
                </button>
            </div>

            {/* A4 Content */}
            <div className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl mx-auto print:shadow-none print:m-0 print:p-[10mm] print:w-full print:min-h-0 print:static ticket-container">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter text-black">PHIẾU TRẢ THIẾT BỊ</h1>
                        <p className="text-sm font-bold text-black mt-2 uppercase tracking-widest leading-tight max-w-sm">CECICS - TRƯỜNG ĐẠI HỌC Y KHOA PHẠM NGỌC THẠCH</p>
                    </div>
                    <div className="text-right">
                        <div className="mb-2">
                            <p className="text-[10px] font-black text-black uppercase tracking-widest">Mã phiếu mượn</p>
                            <p className="text-sm font-bold text-black">{ticket.ticket_no}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-black uppercase tracking-widest">Mã phiếu trả</p>
                            <p className="text-xl font-black text-black">{returnTicketNo}</p>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10">
                    <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Người trả</p>
                        <p className="text-base font-bold text-black border-b border-black pb-1">{ticket.renter}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Bộ môn / Phòng ban</p>
                        <p className="text-base font-bold text-black border-b border-black pb-1">{ticket.department_name}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Ngày mượn</p>
                        <p className="text-base font-bold text-black border-b border-black pb-1">{new Date(ticket.date).toLocaleString('vi-VN')}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Thời gian trả</p>
                        <p className="text-base font-bold text-black border-b border-black pb-1">{now.toLocaleString('vi-VN')}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-10">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black px-1">Danh sách thiết bị đã trả</h2>
                    <table className="w-full border-collapse border-2 border-black">
                        <thead>
                            <tr className="bg-slate-50 print:bg-transparent">
                                <th className="border-2 border-black p-3 text-left text-xs font-black uppercase tracking-wider w-12 text-center">STT</th>
                                <th className="border-2 border-black p-3 text-left text-xs font-black uppercase tracking-wider">Tên thiết bị / Mô hình</th>
                                <th className="border-2 border-black p-3 text-left text-xs font-black uppercase tracking-wider w-40">Mã vạch (STT)</th>
                                <th className="border-2 border-black p-3 text-left text-xs font-black uppercase tracking-wider w-32 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnedItems.map((item, idx) => {
                                const isLate = item.due_date ? new Date(now) > new Date(item.due_date) : false;
                                return (
                                    <tr key={idx}>
                                        <td className="border-2 border-black p-3 text-sm font-bold text-center text-black">{idx + 1}</td>
                                        <td className="border-2 border-black p-3 text-sm font-bold text-black">{item.equipment_name}</td>
                                        <td className="border-2 border-black p-3 text-sm font-mono font-bold text-black">{item.barcode_stt}</td>
                                        <td className="border-2 border-black p-3 text-sm font-bold text-center text-black uppercase">
                                            {isLate ? 'TRẢ TRỄ' : 'ĐÚNG HẠN'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-start text-center px-10 mt-12 pb-20">
                    <div className="space-y-24 w-64">
                        <p className="text-sm font-black uppercase tracking-widest text-black">Bên nhận (CECICS)</p>
                        <p className="text-sm font-bold text-black italic">(Ký và ghi rõ họ tên)</p>
                    </div>
                    <div className="space-y-24 w-64">
                        <p className="text-sm font-black uppercase tracking-widest text-black">Người trả thiết bị</p>
                        <p className="text-sm font-bold text-black italic">(Ký và ghi rõ họ tên)</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-black uppercase tracking-[0.2em] print:border-black">
                    <p>Ngày in: {now.toLocaleString('vi-VN')}</p>
                    <p>Hệ thống Quản lý CECICS v1.0</p>
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
                    }
                    .ticket-container {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 210mm !important;
                        margin: 0 !important;
                        padding: 20mm !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .ticket-container, .ticket-container * {
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
