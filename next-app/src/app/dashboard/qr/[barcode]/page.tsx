import { equipmentService } from '@/services/EquipmentService';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle2, Package, History, UserRound } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function QrBarcodeDetailPage({ params }: { params: Promise<{ barcode: string }> }) {
    const { barcode: rawBarcode } = await params;
    const barcode = decodeURIComponent(rawBarcode).trim().toUpperCase();
    const result = await equipmentService.getItemDetailByBarcode(barcode);

    if (!result.item) {
        return (
            <div className="space-y-4">
                <Link href="/dashboard/qr" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại tra cứu QR
                </Link>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h1 className="text-lg font-bold text-slate-900">Không tìm thấy mẫu vật</h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Không có item nào với mã <span className="font-mono">{barcode}</span>.
                    </p>
                </div>
            </div>
        );
    }

    const { item, activeTicket } = result;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/dashboard/qr" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại tra cứu QR
                </Link>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {item.barcode_stt}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h1 className="text-2xl font-bold text-slate-900">{item.equipment_name}</h1>
                        <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Chi tiết mẫu vật theo QR</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <InfoRow label="Barcode thiết bị gốc" value={item.equipment_barcode || '---'} mono />
                            <InfoRow label="Barcode STT" value={item.barcode_stt} mono />
                            <InfoRow label="STT nội bộ" value={String(item.stt)} />
                            <InfoRow label="Số lượt sử dụng" value={String(item.usage_count)} />
                            <InfoRow label="Tình trạng (Condition)" value={item.condition_name} />
                            <InfoRow label="Trạng thái (Status)" value={item.status_name} />
                        </div>

                        {item.equipment_note && (
                            <div className="mt-5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ghi chú thiết bị</p>
                                <p className="mt-1 text-sm text-slate-700">{item.equipment_note}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 mb-3">Khả dụng cho mượn</h2>
                        <div className="space-y-2">
                            <StatusLine ok={item.condition_is_rentable} label={`Condition: ${item.condition_name}`} />
                            <StatusLine ok={item.status_is_rentable} label={`Status: ${item.status_name}`} />
                        </div>
                        {!item.condition_is_rentable && item.condition_reject_msg && (
                            <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                                {item.condition_reject_msg}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {item.equipment_image_url && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hình ảnh</p>
                            <img src={item.equipment_image_url} alt={item.equipment_name} className="w-full rounded-xl object-cover" />
                        </div>
                    )}

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Phiếu đang giữ (nếu có)</p>
                        {activeTicket ? (
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold text-slate-800 flex items-center gap-2"><History className="w-4 h-4 text-blue-500" />{activeTicket.ticket_no}</p>
                                <p className="text-slate-600 flex items-center gap-2"><UserRound className="w-4 h-4 text-slate-400" />{activeTicket.renter}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">Hiện không có phiếu mượn nào đang giữ mẫu vật này.</p>
                        )}
                    </div>

                    <Link
                        href={`/dashboard/equipment/${item.equipment_id}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                        <Package className="w-4 h-4" />
                        Mở trang thiết bị gốc
                    </Link>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <p className={`mt-1 text-sm font-semibold text-slate-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    );
}

function StatusLine({ ok, label }: { ok: boolean; label: string }) {
    return (
        <div className={`rounded-xl border p-3 text-sm font-semibold flex items-center gap-2 ${ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            {ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {label}
        </div>
    );
}
