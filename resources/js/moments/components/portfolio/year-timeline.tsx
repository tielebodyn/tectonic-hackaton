import { CalendarDays } from 'lucide-react';
import { MONTHS, short } from '../../data/portfolio';
import type { YearItem } from '../../data/portfolio';
import { cn } from '@/lib/utils';

/** Stagger labels that would collide into extra rows. */
function rows(xs: number[], gap: number): number[] {
    const last: number[] = [];

    return xs.map((x) => {
        let row = last.findIndex((l) => x - l >= gap);

        if (row === -1) {
            row = last.length;
            last.push(0);
        }

        last[row] = x;

        return row;
    });
}

export function YearTimeline({
    items,
    selectedId,
    onSelect,
}: {
    items: YearItem[];
    selectedId?: string;
    onSelect: (id: string) => void;
}) {
    const moments = items.filter((i) => i.kind === 'moment');
    const seasonal = items.filter((i) => i.kind === 'seasonal');
    const n = Math.max(1, moments.length);
    const placed = moments.map((item, i) => ({
        item,
        n: i + 1,
        x: (item.days / 365) * 100,
        cx: ((i + 0.5) / n) * 100,
    }));
    const seasonRows = rows(
        seasonal.map((s) => (s.days / 365) * 100),
        16,
    );

    return (
        <div className="select-none">
            {/* moment cards in time order, each wired to its real date on the axis */}
            <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
            >
                {placed.map(({ item, n: num }) => {
                    const m = item.moment!;
                    const active = item.id === selectedId;
                    const now = m.daysAhead <= 7;

                    return (
                        <div key={item.id} className="px-1.5">
                            <button
                                onClick={() => onSelect(item.id)}
                                className={cn(
                                    'flex h-[128px] w-full flex-col rounded-2xl border p-4 text-left transition-all duration-200',
                                    active
                                        ? 'border-kbc-navy bg-white shadow-[0_10px_28px_-10px_rgba(0,54,101,0.35)]'
                                        : 'border-line bg-white hover:border-ink-3/40 hover:shadow-[0_6px_20px_-12px_rgba(16,24,40,0.2)]',
                                )}
                            >
                                <div className="flex items-center gap-2 text-[12px]">
                                    <span
                                        className={cn(
                                            'flex size-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums',
                                            active
                                                ? 'bg-kbc-navy text-white'
                                                : 'bg-mist text-ink-2',
                                        )}
                                    >
                                        {num}
                                    </span>
                                    <span
                                        className={cn(
                                            'font-medium',
                                            now ? 'text-kbc-sky' : 'text-ink-3',
                                        )}
                                    >
                                        {now ? 'Right now' : m.horizon}
                                    </span>
                                    <span className="ml-auto text-ink-3 tabular-nums">
                                        {m.confidence}% sure
                                    </span>
                                </div>
                                <div className="mt-2.5 line-clamp-2 text-[16px] leading-snug font-semibold tracking-tight text-ink">
                                    {m.title}
                                </div>
                                <div className="mt-auto flex items-center gap-3 pt-2">
                                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-mist">
                                        <div
                                            className={cn(
                                                'h-full rounded-full',
                                                active
                                                    ? 'bg-kbc-navy'
                                                    : 'bg-ink-3/50',
                                            )}
                                            style={{
                                                width: `${m.confidence}%`,
                                            }}
                                        />
                                    </div>
                                    {item.impactCents !== 0 && (
                                        <span
                                            className={cn(
                                                'text-[12px] font-medium tabular-nums',
                                                item.impactCents > 0
                                                    ? 'text-k-nosale'
                                                    : 'text-k-human',
                                            )}
                                        >
                                            {item.impactCents > 0 ? '+' : ''}
                                            {short(item.impactCents)}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>

            <svg
                viewBox="0 0 1000 56"
                preserveAspectRatio="none"
                className="block h-14 w-full"
            >
                {placed.map(({ item, x, cx }) => {
                    const active = item.id === selectedId;
                    const a = cx * 10;
                    const b = x * 10;

                    return (
                        <path
                            key={item.id}
                            d={`M${a},0 C${a},30 ${b},26 ${b},56`}
                            fill="none"
                            stroke={active ? '#003665' : '#d5dde6'}
                            strokeWidth={active ? 1.75 : 1.25}
                            vectorEffect="non-scaling-stroke"
                            className="transition-[stroke] duration-200"
                        />
                    );
                })}
            </svg>

            {/* the axis */}
            <div className="relative h-11">
                <div className="absolute inset-x-0 top-[9px] h-[3px] rounded-full bg-gradient-to-r from-kbc-sky via-kbc-navy/25 to-line" />
                <div className="absolute top-0 left-0 -translate-x-1/2">
                    <span className="relative flex size-[21px] items-center justify-center">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-kbc-sky/40" />
                        <span className="relative size-3 rounded-full border-[3px] border-white bg-kbc-sky shadow" />
                    </span>
                </div>
                {placed.map(({ item, x }) => (
                    <span
                        key={item.id}
                        className={cn(
                            'absolute top-[5px] size-[11px] -translate-x-1/2 rounded-full border-2 border-white shadow-sm',
                            item.id === selectedId ? 'bg-kbc-navy' : 'bg-ink-3',
                        )}
                        style={{ left: `${x}%` }}
                    />
                ))}
                <div className="absolute inset-x-0 top-6 grid grid-cols-12 text-[12px] text-ink-3">
                    {MONTHS.map((m, i) => (
                        <div
                            key={m}
                            className="border-l border-line pl-2 first:border-transparent"
                        >
                            <span
                                className={cn(
                                    i === 0 && 'font-medium text-ink-2',
                                    i === 3 && 'font-medium text-ink-2',
                                )}
                            >
                                {m}
                            </span>
                            {(i === 0 || i === 3) && (
                                <span className="ml-1 text-ink-3">
                                    {i === 0 ? '2026' : '2027'}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* the ordinary calendar, so the year feels complete */}
            <div
                className="relative mt-3"
                style={{ height: Math.max(...seasonRows, 0) * 34 + 30 }}
            >
                {seasonal.map((s, i) => (
                    <div
                        key={s.id}
                        title={s.note}
                        className="absolute flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-dashed border-line bg-white/60 px-2.5 py-1 text-[12px] whitespace-nowrap text-ink-2"
                        style={{
                            left: `${(s.days / 365) * 100}%`,
                            top: seasonRows[i] * 34,
                        }}
                    >
                        <CalendarDays className="size-3 text-ink-3" />
                        {s.title}
                        {s.impactCents !== 0 && (
                            <span className="text-ink-3 tabular-nums">
                                {short(s.impactCents)}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
