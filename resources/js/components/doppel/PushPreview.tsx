import Doppel from '@/components/doppel/Doppel';
import type { FaceMood, MascotVariant } from '@/components/doppel/types';

type Props = {
    className?: string;
    /** Pushtekst; zonder tekst toont het de statische welkomstmelding. */
    text?: string;
    mood?: FaceMood;
    variant?: MascotVariant;
    /** Tik op de melding, bv. om de kaart te openen waar ze uit komt. */
    onClick?: () => void;
};

/** Notificatie-mockup: zo komt Doppel bij de klant binnen, uit hetzelfde dagboek als de app. */
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
                    <span className="text-[11px] text-ink/45">nu</span>
                </span>
                <span className="block text-[13px] leading-snug text-ink/75">
                    {text ??
                        'Ik heb je komende maand al geleefd. Wil je zien wat ik zag?'}
                </span>
            </span>
        </Tag>
    );
}
