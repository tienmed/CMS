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
        <div className="stat-cards-grid">
            {stats.map((stat) => {
                const CardIcon = ICON_MAP[stat.icon] || Activity;
                return (
                    <Link
                        key={stat.name}
                        href={`/dashboard/analytics/detailed/${stat.type}`}
                        className="stat-card-shell group"
                    >
                        <div className="flex items-start justify-between">
                            <div className={cn("stat-card-icon-wrap", `stat-icon-surface-${stat.tone}`)}>
                                <CardIcon className={cn("w-5 h-5", `stat-icon-tone-${stat.tone}`)} />
                            </div>
                            <div className="stat-badge">
                                +12%
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="stat-card-title">{stat.name}</p>
                            <h3 suppressHydrationWarning className="stat-card-value text-number">
                                {stat.value.toLocaleString()}
                            </h3>
                        </div>
                        <div className="stat-card-footer">
                            <span className="stat-footer-text">Live Metrics</span>
                            <div className="stat-live-dot"></div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
