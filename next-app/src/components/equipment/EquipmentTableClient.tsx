'use client';

import { Equipment } from '@/types/equipment';
import { Package, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type EquipmentTableClientProps = {
    equipment: Equipment[];
};

export default function EquipmentTableClient({ equipment }: EquipmentTableClientProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEquipment = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) return equipment;

        return equipment.filter((item) => {
            const name = item.name?.toLowerCase() || '';
            const barcode = item.barcode?.toLowerCase() || '';
            const note = item.note?.toLowerCase() || '';

            return name.includes(keyword) || barcode.includes(keyword) || note.includes(keyword);
        });
    }, [equipment, searchTerm]);

    return (
        <>
            <div className="bento-card !p-6 flex flex-wrap gap-4 items-center mb-8">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="w-5 h-5 text-gray-text absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Tìm kiếm theo tên, mã barcode..."
                        className="w-full pl-16 pr-8 h-14 rounded-2xl bg-background border border-transparent focus:bg-white focus:border-brand-primary/20 focus:ring-8 focus:ring-brand-primary/5 transition-all text-sm font-bold placeholder:text-gray-text/40 text-navy"
                    />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tổng: {equipment.length}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Hiển thị: {filteredEquipment.length}</span>
                </div>
            </div>

            <div className="bento-card !p-0 overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/20 dark:bg-white/5">
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em]">Tên thiết bị</th>
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em]">Barcode Identifier</th>
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em] text-center">Số lượng</th>
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em]">Annotation</th>
                                <th className="px-10 py-8 font-black text-gray-text text-[11px] uppercase tracking-[0.2em] text-right">System Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-white/5">
                            {filteredEquipment.map((item) => {
                                const detailHref = `/dashboard/equipment/${item.id}`;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-10 py-10">
                                            <Link href={detailHref} className="block">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/20 text-brand-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                        <Package className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-black text-navy text-lg tracking-tight leading-tight">{item.name}</span>
                                                        <span className="text-[10px] font-black text-gray-text uppercase tracking-widest mt-1">EID: {item.id.toString().padStart(4, '0')}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-10 py-10">
                                            <Link href={detailHref} className="block w-fit">
                                                <span className="text-xs font-black text-navy bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800 font-mono tracking-wider">{item.barcode || '---'}</span>
                                            </Link>
                                        </td>
                                        <td className="px-10 py-10 text-center">
                                            <Link href={detailHref} className="inline-flex">
                                                <span className="text-xs font-black text-brand-primary bg-blue-50 px-4 py-2 rounded-xl">
                                                    {item.item_count || 0}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-10 py-10 text-xs font-bold text-gray-text max-w-xs truncate italic opacity-60">
                                            <Link href={detailHref} className="block">
                                                {item.note || '---'}
                                            </Link>
                                        </td>
                                        <td className="px-10 py-10 text-right">
                                            <Link
                                                href={detailHref}
                                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-background dark:bg-white/5 text-xs font-black text-navy hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest shadow-sm hover:shadow-pro whitespace-nowrap"
                                            >
                                                View Matrix
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden p-4 space-y-3">
                    {filteredEquipment.map((item) => {
                        const detailHref = `/dashboard/equipment/${item.id}`;
                        return (
                            <Link key={item.id} href={detailHref} className="block rounded-2xl border border-slate-200 p-4 active:scale-[0.99] transition bg-white">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-black text-slate-900 leading-tight">{item.name}</p>
                                        <p className="text-[11px] text-slate-500 font-mono mt-1">{item.barcode || '---'}</p>
                                    </div>
                                    <span className="text-xs font-black text-brand-primary bg-blue-50 px-3 py-1.5 rounded-xl">{item.item_count || 0}</span>
                                </div>
                                <p className="text-xs text-slate-500 italic mt-2 line-clamp-2">{item.note || '---'}</p>
                            </Link>
                        );
                    })}
                </div>
                {filteredEquipment.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Không tìm thấy thiết bị phù hợp</p>
                    </div>
                )}
            </div>
        </>
    );
}
