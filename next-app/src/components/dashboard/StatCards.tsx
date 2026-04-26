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
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-200 hover:-translate-y-1 block"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-xl transition-colors", stat.bg, "group-hover:bg-opacity-80")}>
                                <CardIcon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Chi tiết</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.name}</p>
                            <h3 suppressHydrationWarning className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value.toLocaleString()}</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold uppercase tracking-wider">Xem báo cáo chi tiết</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
