'use client';

import React from 'react';
import { Package, CheckCircle2, AlertTriangle, Activity, History, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
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
        tone: string;
        type: string;
    }[]
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {stats.map((stat) => {
                const CardIcon = ICON_MAP[stat.icon] || Activity;
                return (
                    <Link
                        key={stat.name}
                        href={`/dashboard/analytics/detailed/${stat.type}`}
                        className="bento-card flex flex-col justify-between group overflow-hidden min-h-[220px]"
                    >
                        <div className="flex items-start justify-between">
                            <div className={cn("p-3 rounded-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6", `stat-icon-surface-${stat.tone}`)}>
                                <CardIcon className={cn("w-5 h-5", `stat-icon-tone-${stat.tone}`)} />
                            </div>
                            <div className="stat-trend-badge text-[10px] font-black px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                +12%
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-[11px] font-black text-gray-text uppercase tracking-[0.2em] mb-2">{stat.name}</p>
                            <h3 suppressHydrationWarning className="text-6xl font-black text-navy tracking-tighter text-number">
                                {stat.value.toLocaleString()}
                            </h3>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border-light dark:border-white/5 flex items-center justify-between">
                            <span className="text-[9px] font-bold text-gray-text uppercase tracking-widest">Live Metrics</span>
                            <div className="w-1.5 h-1.5 rounded-full stat-live-dot animate-pulse"></div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
