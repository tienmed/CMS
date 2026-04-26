import { equipmentService } from '@/services/EquipmentService';
import { Package, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EquipmentPage() {
    const equipment = await equipmentService.getAllEquipment();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kho thiết bị</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý danh sách mô hình và thiết bị y tế</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-100">
                    <Plus className="w-4 h-4" />
                    Thêm thiết bị mới
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, mã barcode..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Equipment Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">Tên thiết bị</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">Mã barcode</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">Ghi chú</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-sm uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {equipment.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-slate-800">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono text-slate-600">{item.barcode || '---'}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 font-medium max-w-xs truncate">
                                    {item.note || '---'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/dashboard/equipment/${item.id}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                        Chi tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
