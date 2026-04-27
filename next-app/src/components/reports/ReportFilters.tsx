'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ReportFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'month' | 'year' | 'range'>(
        (searchParams.get('type') as any) || 'month'
    );
    const [month, setMonth] = useState(searchParams.get('month') || new Date().getMonth() + 1 + '');
    const [year, setYear] = useState(searchParams.get('year') || new Date().getFullYear() + '');
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

    const handleApply = () => {
        const params = new URLSearchParams();
        params.set('type', type);

        if (type === 'month') {
            params.set('month', month);
            params.set('year', year);
        } else if (type === 'year') {
            params.set('year', year);
        } else {
            params.set('startDate', startDate);
            params.set('endDate', endDate);
        }

        router.push(`/dashboard/reports?${params.toString()}`);
        setIsOpen(false);
    };

    const handleReset = () => {
        router.push('/dashboard/reports');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all bg-white shadow-sm"
            >
                <Calendar className="w-4 h-4 text-blue-500" />
                {type === 'month' ? `Tháng ${month}/${year}` : type === 'year' ? `Năm ${year}` : 'Khoảng thời gian'}
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Bộ lọc thời gian</h4>
                            <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                        </div>

                        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                            {(['month', 'year', 'range'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={cn(
                                        "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all",
                                        type === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {t === 'month' ? 'Tháng' : t === 'year' ? 'Năm' : 'Khoảng'}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 mb-8">
                            {type === 'month' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tháng</label>
                                        <select
                                            value={month}
                                            onChange={(e) => setMonth(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Năm</label>
                                        <select
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <option key={i} value={2024 + i}>{2024 + i}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {type === 'year' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chọn năm</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <option key={i} value={2024 + i}>{2024 + i}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {type === 'range' && (
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Từ ngày</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Đến ngày</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleReset}
                                className="flex-1 py-3 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Thiết lập lại
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
