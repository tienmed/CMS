import { rentalService } from '@/services/RentalService';
import { equipmentService } from '@/services/EquipmentService';
import { ClipboardList, Plus, Clock, CheckCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function RentalPage() {
    const activeTickets = await rentalService.getActiveTickets();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Mượn / Trả</h1>
                    <p className="text-sm text-slate-500 mt-1">Theo dõi lộ trình và trạng thái sử dụng thiết bị</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-100 font-bold">
                    <Plus className="w-4 h-4" />
                    Tạo phiếu mượn mới
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Stats Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            Đang mượn
                        </h3>
                        <p className="text-4xl font-black text-slate-900">{activeTickets.length}</p>
                        <p className="text-sm text-slate-400 mt-2">Phiếu chưa hoàn tất</p>
                    </div>
                </div>

                {/* Active Tickets List */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Danh sách phiếu đang hoạt động</h3>
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo số phiếu..."
                                    className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                                {activeTickets.length > 0 ? (
                                    activeTickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-slate-900">{ticket.ticket_no}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{ticket.rented_full_name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(ticket.rented_date).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">Ghi nhận trả</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                            Hiện không có phiếu mượn nào chưa trả.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
