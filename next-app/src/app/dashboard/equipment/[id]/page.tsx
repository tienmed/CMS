import { equipmentService } from '@/services/EquipmentService';
import { qrService } from '@/services/QrService';
import { Package, Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EquipmentDetailPage({ params }: { params: { id: string } }) {
    const equipmentId = parseInt(params.id);
    const equipment = await equipmentService.getEquipmentById(equipmentId);
    const items = await equipmentService.getItemsByEquipmentId(equipmentId);

    if (!equipment) return <div>Không tìm thấy thiết bị</div>;

    // Sinh mã QR cho từng item (dùng barcode_stt - mã cụ thể cho từng mẫu vật)
    const itemsWithQr = await Promise.all(items.map(async (item) => ({
        ...item,
        qrCode: await qrService.generateQrDataUrl(item.barcode_stt)
    })));

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/equipment" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">{equipment.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Info Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                            Thông tin chung
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Mã barcode</p>
                                <p className="text-sm font-mono font-semibold text-slate-700">{equipment.barcode || '---'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Ghi chú</p>
                                <p className="text-sm text-slate-700">{equipment.note || '---'}</p>
                            </div>
                            {equipment.url && (
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Hình ảnh</p>
                                    <img src={equipment.url} alt={equipment.name} className="mt-2 rounded-xl w-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="lg:col-span-3 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 px-2">Danh sách mẫu vật ({items.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {itemsWithQr.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-6 hover:shadow-md transition-shadow group">
                                <div className="flex-shrink-0">
                                    <img src={item.qrCode} alt={item.barcode_stt} className="w-24 h-24 rounded-lg bg-slate-50 p-2" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                            {item.barcode_stt}
                                        </span>
                                        <button className="text-slate-400 hover:text-blue-500 transition-colors">
                                            <Printer className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-2">STT: {item.stt}</h4>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${item.is_rentable
                                        ? 'text-green-600 bg-green-50'
                                        : 'text-amber-600 bg-amber-50'
                                        }`}>
                                        {item.status_name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
