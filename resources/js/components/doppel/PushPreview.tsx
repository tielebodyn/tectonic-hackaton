import Doppel from '@/components/doppel/Doppel';

/** Statische notificatie-mockup: zo komt Doppel bij de klant binnen. */
export default function PushPreview({ className }: { className?: string }) {
    return (
        <div
            className={`flex animate-doppel-float items-start gap-3 rounded-[22px] bg-white/85 p-3 shadow-[0_12px_40px_rgba(11,31,58,0.12)] backdrop-blur-md ${className ?? ''}`}
        >
            <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-kbc/10">
                <Doppel mood="relaxed" variant="backpack" size={36} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between">
                    <span className="text-[13px] font-bold text-ink">
                        Doppel
                    </span>
                    <span className="text-[11px] text-ink/45">nu</span>
                </span>
                <span className="block text-[13px] leading-snug text-ink/75">
                    Ik heb je komende maand al geleefd. Wil je zien wat ik zag?
                </span>
            </span>
        </div>
    );
}
