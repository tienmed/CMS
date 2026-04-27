'use client';

import { useState } from 'react';
import { fetchDetailedItems } from '@/app/actions/analytics';
import { X, Package, Activity, Layers, ActivitySquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsCellProps {
    type: 'equipment' | 'items' | 'rentable' | 'non-rentable';
    groupCode: string;
    levelCode: string;
    value: number;
    colorClass: string;
}

const GROUP_LABELS: Record<string, string> = {
    'MH': 'Mô hình',
    'TB': 'Thiết bị',
    'VP': 'Văn phòng',
};

const LEVEL_LABELS: Record<string, string> = {
    'H': 'High Priority',
    'M': 'Medium',
    'L': 'Standard',
};

export default function AnalyticsCell({ type, groupCode, levelCode, value, colorClass }: AnalyticsCellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);

    const handleOpen = async () => {
        if (value <= 0) return;
        setIsOpen(true);
        setIsLoading(true);
        try {
            const data = await fetchDetailedItems(type, groupCode, levelCode);

            // Group by equipment_name and status_name since user wants 'số lượng'
            const grouped: Record<string, any> = {};
            data.forEach(item => {
                const key = `${item.equipment_name}_${item.status_name}`;
                if (grouped[key]) {
                    grouped[key].quantity += 1;
                    if (item.barcode_stt) {
                        grouped[key].barcodes.push(item.barcode_stt);
                    }
                } else {
                    grouped[key] = {
                        ...item,
                        quantity: 1,
                        barcodes: item.barcode_stt ? [item.barcode_stt] : []
                    };
                }
            });

            setItems(Object.values(grouped).sort((a, b) => b.quantity - a.quantity));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <td className="py-10 px-8 text-center border-l border-border-light/40 dark:border-white/5">
            <div
                onClick={handleOpen}
                className={cn(
                    "inline-flex flex-col items-center justify-center min-w-[80px] py-3 rounded-2xl transition-all duration-500",
                    value > 0
                        ? "bg-white dark:bg-white/5 shadow-pro ring-1 ring-border-light dark:ring-white/10 group-hover/row:scale-110 group-hover/row:ring-brand-primary/30 cursor-pointer"
                        : "opacity-10 translate-y-2 grayscale group-hover/row:opacity-5 group-hover/row:translate-y-0 transition-all",
                    isOpen && "ring-brand-primary/50 scale-110 shadow-xl"
                )}
            >
                <span className={cn(
                    "font-black text-xl tabular-nums tracking-tighter text-number leading-none",
                    value > 0 ? "text-navy" : "text-gray-text"
                )}>
                    {value > 0 ? value.toLocaleString() : '0'}
                </span>
                {value > 0 && <span className="text-[8px] font-black text-gray-text uppercase mt-2 tracking-widest opacity-40">Click to view</span>}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div
                        className="bg-white rounded-[2rem] shadow-[0_32px_120px_rgba(0,0,0,0.15)] w-full max-w-3xl overflow-hidden border border-white relative animate-in zoom-in-95 duration-500 flex flex-col max-h-[85vh] text-left"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                            className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-slate-900 z-10 bg-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-8 border-b border-border-soft flex items-center gap-5 bg-surface z-0">
                            <div className="w-14 h-14 bg-primary-soft rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                <Layers className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-primary tracking-tight">Chi tiết dữ liệu</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-white bg-primary px-2 py-0.5 rounded-md uppercase tracking-widest">{GROUP_LABELS[groupCode] || groupCode}</span>
                                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest", colorClass.replace('text-', 'bg-').replace('500', '100') + ' ' + colorClass)}>{LEVEL_LABELS[levelCode] || levelCode}</span>
                                    <span className="text-[10px] font-black text-muted uppercase tracking-widest ml-2">{value} Tổng số</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                                    <p className="text-xs font-black text-muted uppercase tracking-[0.2em]">Đang tải dữ liệu...</p>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <ActivitySquare className="w-12 h-12 text-slate-200 mb-4" />
                                    <p className="text-sm font-black text-muted uppercase tracking-widest">Không có dữ liệu chi tiết</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-12 gap-4 px-6 mb-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                                        <div className="col-span-6">Tên thiết bị</div>
                                        <div className="col-span-3 text-center">Số lượng / Danh sách</div>
                                        <div className="col-span-3 text-right">Tình trạng</div>
                                    </div>
                                    {items.map((item, idx) => (
                                        <div key={idx} className="bg-white p-5 rounded-2xl border border-border-soft shadow-sm flex items-center justify-between group hover:border-primary-soft transition-all">
                                            <div className="grid grid-cols-12 w-full items-center gap-4">
                                                <div className="col-span-6 flex items-center gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-primary opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all shrink-0" />
                                                    <span className="text-sm font-black text-primary leading-tight">{item.equipment_name}</span>
                                                </div>
                                                <div className="col-span-3 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-lg font-black text-primary tabular-nums tracking-tighter leading-none mb-1">{item.quantity}</span>
                                                        {item.barcodes.length > 0 && item.barcodes.length <= 3 && (
                                                            <div className="flex flex-wrap justify-center gap-1">
                                                                {item.barcodes.map((stt: string, i: number) => (
                                                                    <span key={i} className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                                                        #{stt}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-3 text-right">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent-1/10 text-accent-1 border border-accent-1/20 whitespace-nowrap">
                                                        {item.status_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </td>
    );
}
