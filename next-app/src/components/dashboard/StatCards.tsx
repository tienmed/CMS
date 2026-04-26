'use client';

import React from 'react';
import { Package, CheckCircle2, AlertTriangle, Activity, History } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, any> = {
    'package': Package,
    'check-circle': CheckCircle2,
    'alert-triangle': AlertTriangle,
    'activity': Activity,
    'history': History,
};

export default function StatCards({ stats }: {
    stats: {
        name: string;
        value: number;
        icon: string;
        color: string;
        bg: string;
        type: string;
    }[]
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {stats.map((stat) => {
                const CardIcon = ICON_MAP[stat.icon] || Activity;
                return (
                    <Link
                        key={stat.name}
                        href={`/dashboard/analytics/detailed/${stat.type}`}
                        className="bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all cursor-pointer group hover:border-blue-200/50 hover:-translate-y-1 block relative overflow-hidden"
                    >
                        <div className="absolute top-[-10px] right-[-10px] p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                            <CardIcon className="w-28 h-28 rotate-12" />
                        </div>

                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <div className={cn("p-2 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", stat.bg, "shadow-sm")}>
                                <CardIcon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className="text-[9px] font-black text-slate-400 bg-slate-100/50 px-2 py-1 rounded-full uppercase tracking-widest leading-none border border-slate-100 backdrop-blur-sm relative z-20">Chi tiết</span>
                        </div>

                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                            <h3 suppressHydrationWarning className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value.toLocaleString()}</h3>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
