import Doppel from '@/components/doppel/Doppel';
import type { FaceMood, MascotVariant } from '@/components/doppel/types';

type Props = {
    className?: string;
    /** Push text; without it, the static welcome notification shows. */
    text?: string;
    mood?: FaceMood;
    variant?: MascotVariant;
    /** Tap on the notification, e.g. to open the card it came from. */
    onClick?: () => void;
};

/** Notification mockup: how Doppel reaches the customer, from the same diary as the app. */
export default function PushPreview({
    className,
    text,
    mood = 'relaxed',
    variant = 'backpack',
    onClick,
}: Props) {
    const Tag = onClick ? 'button' : 'div';

    return (
        <Tag
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={`flex animate-doppel-float items-start gap-3 rounded-[22px] bg-white/85 p-3 text-left shadow-[0_12px_40px_rgba(11,31,58,0.12)] backdrop-blur-md ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}
        >
            <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-kbc/10">
                <Doppel mood={mood} variant={variant} size={36} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between">
                    <span className="text-[13px] font-bold text-ink">
                        Doppel
                    </span>
                    <span className="text-[11px] text-ink/45">now</span>
                </span>
                <span className="block text-[13px] leading-snug text-ink/75">
                    {text ??
                        "I've already lived your next month. Want to see what I saw?"}
                </span>
            </span>
        </Tag>
    );
}
