'use client';

import React, { useMemo, useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { RentalTicket } from '@/types/rental';
import { useSearchParams, useRouter } from 'next/navigation';
import ReturnTicketModal from './ReturnTicketModal';

interface ActiveTicketsTableProps {
  initialTickets: RentalTicket[];
}

export default function ActiveTicketsTable({ initialTickets }: ActiveTicketsTableProps) {
  const [tickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<{ id: number; no: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const querySelectedTicket = useMemo(() => {
    const ticketId = searchParams.get('ticket');
    if (!ticketId) return null;
    const ticket = tickets.find((t) => t.id === parseInt(ticketId));
    return ticket ? { id: ticket.id, no: ticket.ticket_no } : null;
  }, [searchParams, tickets]);

  const handleCloseModal = () => {
    setSelectedTicket(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('ticket');
    router.replace(`/dashboard/rental?${params.toString()}`);
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticket_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.rented_full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="ticket-shell">
        <div className="ticket-toolbar">
          <div>
            <h3 className="ticket-title">Phiếu mượn đang hoạt động</h3>
            <p className="ticket-subtitle">Chọn phiếu để ghi nhận trả thiết bị.</p>
          </div>
          <div className="ticket-search-wrap">
            <Search className="ticket-search-icon" />
            <input
              type="text"
              placeholder="Tìm theo mã phiếu hoặc người mượn"
              className="ticket-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="ticket-content">
          <div className="ticket-mobile-list">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-mobile-item">
                <p className="ticket-ticketno">{ticket.ticket_no}</p>
                <p className="ticket-muted">{ticket.rented_full_name}</p>
                <p className="ticket-muted">Ngày mượn: {new Date(ticket.rented_date).toLocaleDateString('vi-VN')}</p>
                <button onClick={() => setSelectedTicket({ id: ticket.id, no: ticket.ticket_no })} className="ticket-action">
                  <RotateCcw className="w-4 h-4" /> Ghi nhận trả
                </button>
              </div>
            ))}
          </div>

          <table className="ticket-table">
            <thead className="ticket-thead">
              <tr>
                <th className="ticket-th">Mã phiếu</th>
                <th className="ticket-th">Người mượn</th>
                <th className="ticket-th">Ngày mượn</th>
                <th className="ticket-th-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="ticket-row">
                  <td className="ticket-td-strong">{ticket.ticket_no}</td>
                  <td className="ticket-td">{ticket.rented_full_name}</td>
                  <td className="ticket-td">{new Date(ticket.rented_date).toLocaleDateString('vi-VN')}</td>
                  <td className="ticket-td-end">
                    <button onClick={() => setSelectedTicket({ id: ticket.id, no: ticket.ticket_no })} className="ticket-action">
                      <RotateCcw className="w-4 h-4" /> Ghi nhận trả
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTickets.length === 0 && <div className="ticket-empty">Không có phiếu phù hợp.</div>}
        </div>
      </div>

      {(selectedTicket || querySelectedTicket) && (
        <ReturnTicketModal
          ticketId={(selectedTicket || querySelectedTicket)!.id}
          ticketNo={(selectedTicket || querySelectedTicket)!.no}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
