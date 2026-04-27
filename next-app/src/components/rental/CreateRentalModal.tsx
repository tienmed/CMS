'use client';

import React, { useMemo, useState } from 'react';
import { X, Plus, Search, Camera, Loader2, AlertCircle, ArrowRight, Check } from 'lucide-react';
import QRScanner from '../common/QRScanner';
import { cn } from '@/lib/utils';
import { Department } from '@/services/DepartmentService';
import { EquipmentItem } from '@/types/equipment';
import { createRentalTicketAction, validateBarcodeAction } from '@/app/actions/rental';

interface CreateRentalModalProps {
  departments: Department[];
  rentableItems: (EquipmentItem & {
    equipment_name: string;
    status_name: string;
    condition_name: string;
    condition_reject_msg: string;
  })[];
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

  const filteredItems = useMemo(
    () =>
      rentableItems.filter(
        (item) =>
          item.condition_is_rentable &&
          (item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode_stt.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [rentableItems, searchTerm]
  );

  const toggleItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(id)
        ? prev.selectedItems.filter((itemId) => itemId !== id)
        : [...prev.selectedItems, id],
    }));
    setError(null);
    setConflictTicket(null);
  };

  const addByBarcode = async (barcode: string) => {
    const term = barcode.trim().toUpperCase();
    if (!term) return;

    const localItem = rentableItems.find((i) => i.barcode_stt.toUpperCase() === term);
    if (localItem?.condition_is_rentable) {
      if (!formData.selectedItems.includes(localItem.id)) toggleItem(localItem.id);
      return;
    }

    setLoading(true);
    const response = (await validateBarcodeAction(term)) as {
      available?: boolean;
      item?: { id: number };
      reason?: string;
      activeTicket?: { id: number; ticket_no: string };
      error?: string;
    };
    setLoading(false);

    if ('error' in response) {
      setError(`Lỗi hệ thống: ${response.error}`);
      return;
    }

    if (response.available && response.item) {
      toggleItem(response.item.id);
      setSearchTerm('');
    } else if (response.reason === 'rented' && response.activeTicket) {
      setError(`Thiết bị ${term} đang thuộc phiếu khác.`);
      setConflictTicket({ id: response.activeTicket.id, no: response.activeTicket.ticket_no });
    } else {
      setError(`Không thể thêm mã ${term}.`);
    }
  };

  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    await addByBarcode(searchTerm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedItems.length === 0) {
      setError('Vui lòng chọn ít nhất một thiết bị.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createRentalTicketAction(
      {
        ticket_no: `RT-${Date.now().toString().slice(-6)}`,
        rented_full_name: formData.renterName,
        rented_by: parseInt(formData.departmentId),
        rented_date: new Date(),
        due_date: new Date(formData.dueDate),
        note: formData.note,
      },
      formData.selectedItems
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Đã có lỗi xảy ra');
      return;
    }

    setIsOpen(false);
    setFormData({ renterName: '', departmentId: '', dueDate: '', note: '', selectedItems: [] });
    onSuccess?.();
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="rental-create-trigger">
        <Plus className="w-4 h-4" /> Tạo phiếu mượn
      </button>

      {isOpen && (
        <div className="rental-modal-overlay">
          <div className="rental-modal-shell">
            <div className="rental-modal-head">
              <div>
                <h4 className="rental-modal-title">Tạo phiếu mượn mới</h4>
                <p className="rental-modal-subtitle">Thiết kế ưu tiên điện thoại để quét máy ảnh liên tục khi cần.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="rental-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="rental-modal-form">
              <div className="rental-form-left">
                <div>
                  <label className="rental-label">Người mượn</label>
                  <input
                    required
                    type="text"
                    className="rental-input"
                    value={formData.renterName}
                    onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="rental-label">Bộ phận</label>
                  <select
                    required
                    className="rental-input"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  >
                    <option value="" disabled>
                      Chọn bộ phận
                    </option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="rental-label">Hạn trả</label>
                  <input
                    required
                    type="date"
                    className="rental-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="rental-label">Ghi chú</label>
                  <textarea
                    rows={4}
                    className="rental-textarea"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="rental-form-right">
                <div className="rental-search-row">
                  <div className="rental-search-wrap">
                    <Search className="rental-search-icon" />
                    <input
                      type="text"
                      placeholder="Nhập hoặc quét mã vạch"
                      className="rental-search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </div>
                  <button type="button" onClick={() => setIsScanning(true)} className="rental-camera-btn">
                    <Camera className="w-4 h-4" /> Máy ảnh
                  </button>
                </div>

                <p className="rental-selected-count">Đã chọn {formData.selectedItems.length} thiết bị.</p>

                <div className="rental-items-list">
                  {filteredItems.map((item) => {
                    const isSelected = formData.selectedItems.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={cn('rental-item-btn', isSelected && 'rental-item-btn-active')}
                      >
                        <div className="rental-item-row">
                          <div>
                            <p className="rental-item-name">{item.equipment_name}</p>
                            <p className="rental-item-code">{item.barcode_stt}</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary mt-0.5" />}
                        </div>
                      </button>
                    );
                  })}
                  {filteredItems.length === 0 && <p className="rental-empty">Không có thiết bị phù hợp.</p>}
                </div>
              </div>
            </form>

            <div className="rental-modal-foot">
              <div>
                {error ? (
                  <p className="rental-error">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                    {conflictTicket && (
                      <button
                        type="button"
                        onClick={() => (window.location.href = `/dashboard/rental?ticket=${conflictTicket.id}`)}
                        className="rental-conflict-link"
                      >
                        Xem #{conflictTicket.no} <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </p>
                ) : (
                  <p className="rental-tip">Mẹo: Trên điện thoại, mở Máy ảnh để quét liên tục nhiều thiết bị.</p>
                )}
              </div>

              <div className="rental-actions">
                <button type="button" onClick={() => setIsOpen(false)} className="rental-cancel-btn">
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || formData.selectedItems.length === 0}
                  className="rental-submit-btn"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Xác nhận tạo phiếu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isScanning && <QRScanner onScanSuccess={addByBarcode} onClose={() => setIsScanning(false)} continuous />}
    </>
  );
}
