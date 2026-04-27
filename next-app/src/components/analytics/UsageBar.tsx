import { cn } from '@/lib/utils';

interface UsageBarProps {
    value: number;  // usage per year
    maxValue?: number;
    showLabel?: boolean;
}

export function UsageBar({ value, maxValue = 100, showLabel = true }: UsageBarProps) {
    const pct = Math.min(100, Math.max(0, (value / maxValue) * 100));

    // Color based on usage level - Modern Vibrancy
    let barColor = 'bg-slate-200';
    let textColor = 'text-slate-400';
    if (pct > 0) { barColor = 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'; textColor = 'text-emerald-600'; }
    if (pct > 30) { barColor = 'bg-brand-primary shadow-[0_0_12px_rgba(67,24,255,0.2)]'; textColor = 'text-brand-primary'; }
    if (pct > 60) { barColor = 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]'; textColor = 'text-amber-600'; }
    if (pct > 80) { barColor = 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)]'; textColor = 'text-red-600'; }

    return (
        <div className="flex items-center gap-4 min-w-[140px] group/bar">
            <div className="flex-1 bg-slate-50 rounded-full h-2.5 overflow-hidden border border-slate-100/50">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColor)}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <span className={cn("text-[10px] font-black tabular-nums w-12 text-right uppercase tracking-tighter opacity-80 group-hover/bar:opacity-100 transition-opacity", textColor)}>
                    {value.toFixed(1)} <span className="opacity-40">/YR</span>
                </span>
            )}
        </div>
    );
}
