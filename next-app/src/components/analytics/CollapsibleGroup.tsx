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

export function CollapsibleGroup({ title, count, defaultOpen = true, children, colorClass = 'bg-blue-500' }: CollapsibleGroupProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50/80 transition-colors text-left"
            >
                <div className={cn("w-1.5 h-8 rounded-full", colorClass)} />
                {open
                    ? <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                }
                <span className="font-bold text-slate-800 text-sm flex-1">{title}</span>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {count} thiết bị
                </span>
            </button>
            {open && (
                <div className="border-t border-slate-100">
                    {children}
                </div>
            )}
        </div>
    );
}
