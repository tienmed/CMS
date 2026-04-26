import { cn } from '@/lib/utils';

interface UsageBarProps {
    value: number;  // usage per year
    maxValue?: number;
    showLabel?: boolean;
}

export function UsageBar({ value, maxValue = 100, showLabel = true }: UsageBarProps) {
    const pct = Math.min(100, Math.max(0, (value / maxValue) * 100));

    // Color based on usage level
    let barColor = 'bg-slate-300';
    let textColor = 'text-slate-500';
    if (pct > 0) { barColor = 'bg-emerald-500'; textColor = 'text-emerald-700'; }
    if (pct > 30) { barColor = 'bg-blue-500'; textColor = 'text-blue-700'; }
    if (pct > 60) { barColor = 'bg-amber-500'; textColor = 'text-amber-700'; }
    if (pct > 80) { barColor = 'bg-red-500'; textColor = 'text-red-700'; }

    return (
        <div className="flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", barColor)}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <span className={cn("text-xs font-bold tabular-nums w-14 text-right", textColor)}>
                    {value.toFixed(1)}/năm
                </span>
            )}
        </div>
    );
}
