'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleGroupProps {
    title: string;
    count: number;
    defaultOpen?: boolean;
    children: React.ReactNode;
    colorClass?: string;
}

export function CollapsibleGroup({ title, count, defaultOpen = true, children, colorClass = 'bg-brand-primary' }: CollapsibleGroupProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden border border-slate-50 mb-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-5 px-8 py-6 hover:bg-slate-50/50 transition-all text-left group"
            >
                <div className={cn("w-2 h-10 rounded-full shadow-sm", colorClass)} />
                <div className="flex-1 flex flex-col">
                    <span className="font-black text-slate-900 text-sm tracking-tight uppercase">{title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Phân loại theo mức độ ưu tiên</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group-hover:bg-white transition-all">
                        {count} thiết bị
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-brand-primary transition-all shadow-sm">
                        {open
                            ? <ChevronDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            : <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        }
                    </div>
                </div>
            </button>
            {open && (
                <div className="border-t border-slate-50 bg-white shadow-inner">
                    {children}
                </div>
            )}
        </div>
    );
}
