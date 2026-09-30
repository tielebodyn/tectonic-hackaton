import { BatteryFull, SignalHigh, Wifi } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** iPhone-like device shell. The screen is `relative` so overlays (push, sheet, toast) position inside it. */
export function PhoneFrame({
    children,
    statusTone = 'light',
}: {
    children: ReactNode;
    statusTone?: 'light' | 'dark';
}) {
    return (
        <div className="relative shrink-0 rounded-[58px] bg-[#1b2230] p-[3px] shadow-[0_30px_60px_-20px_rgba(11,31,51,0.35),0_0_0_1px_rgba(11,31,51,0.08)]">
            {/* side buttons */}
            <div className="absolute top-[150px] -left-[3px] h-8 w-[3px] rounded-l bg-[#2a3342]" />
            <div className="absolute top-[200px] -left-[3px] h-14 w-[3px] rounded-l bg-[#2a3342]" />
            <div className="absolute top-[268px] -left-[3px] h-14 w-[3px] rounded-l bg-[#2a3342]" />
            <div className="absolute top-[220px] -right-[3px] h-20 w-[3px] rounded-r bg-[#2a3342]" />

            <div className="rounded-[55px] bg-black p-[9px]">
                <div className="bg-mist relative isolate h-[788px] w-[372px] overflow-hidden rounded-[46px]">
                    {children}

                    {/* status bar + dynamic island */}
                    <div
                        className={cn(
                            'pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[50px] items-center justify-between px-8 pt-1 text-[15px] font-semibold',
                            statusTone === 'light' ? 'text-white' : 'text-ink',
                        )}
                    >
                        <span className="w-14 tabular-nums">9:41</span>
                        <span className="absolute top-[11px] left-1/2 h-[33px] w-[118px] -translate-x-1/2 rounded-full bg-black" />
                        <span className="flex w-14 items-center justify-end gap-1">
                            <SignalHigh className="size-4" strokeWidth={2.5} />
                            <Wifi className="size-4" strokeWidth={2.5} />
                            <BatteryFull className="size-5" strokeWidth={2} />
                        </span>
                    </div>

                    {/* home indicator */}
                    <div className="pointer-events-none absolute bottom-2 left-1/2 z-40 h-[5px] w-[128px] -translate-x-1/2 rounded-full bg-ink/85" />
                </div>
            </div>
        </div>
    );
}
