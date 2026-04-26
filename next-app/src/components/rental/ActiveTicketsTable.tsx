'use client';

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { RentalTicket } from '@/types/rental';
import { useSearchParams, useRouter } from 'next/navigation';
import ReturnTicketModal from './ReturnTicketModal';

interface ActiveTicketsTableProps {
    initialTickets: RentalTicket[];
}

export default function ActiveTicketsTable({ initialTickets }: ActiveTicketsTableProps) {
    const [tickets, setTickets] = useState(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<{ id: number; no: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();

    // Tự động mở modal nếu có query param ?ticket=id
    useEffect(() => {
        const ticketId = searchParams.get('ticket');
        if (ticketId) {
            const ticket = tickets.find(t => t.id === parseInt(ticketId));
            if (ticket) {
                setSelectedTicket({ id: ticket.id, no: ticket.ticket_no });
            }
        }
    }, [searchParams, tickets]);

    const handleCloseModal = () => {
        setSelectedTicket(null);
        // Xóa query param sau khi đóng
        const params = new URLSearchParams(searchParams.toString());
        params.delete('ticket');
        router.replace(`/dashboard/rental?${params.toString()}`);
    };

    const filteredTickets = tickets.filter(t =>
        t.ticket_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.rented_full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRefresh = () => {
        // Trong thực tế sẽ gọi reload dữ liệu, nhưng ở đây có thể dùng window.location.reload()
        // hoặc để Next.js Server Actions tự động revalidate
        window.location.reload();
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Danh sách phiếu đang hoạt động</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Tìm theo số phiếu / người mượn..."
                            className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">Số phiếu</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">Người mượn</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">Ngày mượn</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-sm uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-slate-900">{ticket.ticket_no}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{ticket.rented_full_name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(ticket.rented_date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedTicket({ id: ticket.id, no: ticket.ticket_no })}
                                            className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 ml-auto group-hover:scale-105 transition-transform"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            Ghi nhận trả
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                    {searchTerm ? 'Không tìm thấy phiếu nào khớp với từ khóa.' : 'Hiện không có phiếu mượn nào chưa trả.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedTicket && (
                <ReturnTicketModal
                    ticketId={selectedTicket.id}
                    ticketNo={selectedTicket.no}
                    onClose={handleCloseModal}
                    onSuccess={() => {
                        handleCloseModal();
                        handleRefresh();
                    }}
                />
            )}
        </>
    );
}
