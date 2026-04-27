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
            <div className="bento-card !p-0 flex flex-col min-h-0 overflow-hidden">
                <div className="px-10 py-10 border-b border-border-light dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-background/20 dark:bg-white/5">
                    <div>
                        <h3 className="text-2xl font-black text-navy tracking-tighter uppercase whitespace-nowrap">Active Queue</h3>
                        <p className="text-[10px] font-black text-gray-text uppercase tracking-[0.3em] mt-2 opacity-50 italic">Handover Tracking Subsystem</p>
                    </div>
                    <div className="relative group/search w-full max-w-md">
                        <Search className="w-5 h-5 text-gray-text absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/search:text-brand-primary transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Mã phiếu / Định danh người mượn..."
                            className="pl-16 pr-8 h-16 rounded-[1.5rem] border border-transparent bg-white dark:bg-black/40 text-sm font-bold text-navy focus:outline-none focus:ring-8 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all w-full shadow-sm placeholder:text-gray-text/30"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-background/10 dark:bg-white/5">
                                <th className="px-10 py-8 text-[11px] font-black text-gray-text uppercase tracking-[0.4em]">Ticket Identifier</th>
                                <th className="px-10 py-8 text-[11px] font-black text-gray-text uppercase tracking-[0.4em]">Borrower Entity</th>
                                <th className="px-10 py-8 text-[11px] font-black text-gray-text uppercase tracking-[0.4em]">Handover Matrix</th>
                                <th className="px-10 py-8 text-[11px] font-black text-navy uppercase tracking-[0.4em] text-right">System Logic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-white/5">
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all cursor-default">
                                        <td className="px-10 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.6)]"></div>
                                                <span className="font-mono font-black text-navy tracking-wider text-lg">{ticket.ticket_no}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-navy tracking-tight uppercase group-hover/row:text-brand-primary transition-all duration-300">{ticket.rented_full_name}</span>
                                                <span className="text-[10px] font-black text-gray-text uppercase tracking-widest mt-1 opacity-50">Verified Operational Staff</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10">
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-navy leading-none">
                                                    {new Date(ticket.rented_date).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span className="text-[10px] font-black text-gray-text uppercase mt-2 tracking-[0.1em] opacity-40 italic">Initial Handover Record</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10 text-right">
                                            <button
                                                onClick={() => setSelectedTicket({ id: ticket.id, no: ticket.ticket_no })}
                                                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-brand-primary text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 hover:bg-brand-primary hover:text-white hover:shadow-pro hover:scale-105 active:scale-95 transition-all"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                                Ghi nhận trả
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <Search className="w-12 h-12 text-slate-100 mb-6" />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                                                {searchTerm ? 'No matching tickets detected in active queue' : 'Active rental queue is currently empty'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between shrink-0">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Queue Capacity: Nominal</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active:</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-[10px] font-black text-slate-900 shadow-sm">{filteredTickets.length}</span>
                    </div>
                </div>
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
