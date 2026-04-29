'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
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

  useEffect(() => {
    const updateRowsPerPage = () => {
      if (window.innerWidth < 768) return;
      const viewportHeight = window.innerHeight;
      const reservedHeight = 460;
      const rowHeight = 56;
      const visibleRows = Math.floor((viewportHeight - reservedHeight) / rowHeight);
      setRowsPerPage(Math.max(4, Math.min(visibleRows, 12)));
    };

    updateRowsPerPage();
    window.addEventListener('resize', updateRowsPerPage);
    return () => window.removeEventListener('resize', updateRowsPerPage);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / rowsPerPage));
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

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
              {paginatedTickets.map((ticket) => (
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

          {filteredTickets.length > 0 && (
            <div className="ticket-pagination">
              <p className="ticket-pagination-text">
                Trang {currentPage}/{totalPages} • {filteredTickets.length} phiếu
              </p>
              <div className="ticket-pagination-actions">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="ticket-page-btn"
                >
                  Trước
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ticket-page-btn"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
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
