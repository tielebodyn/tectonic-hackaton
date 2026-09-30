import { cn } from '@/lib/utils';

type Props = {
    text: string;
    /** Toont drie stipjes in plaats van de tekst. */
    thinking?: boolean;
    /** Op de donkere dagboekkaart */
    onDark?: boolean;
    className?: string;
};

/** Spraakbubbel met staartje rechtsonder, richting Doppel. */
export default function SpeechBubble({
    text,
    thinking = false,
    onDark = false,
    className,
}: Props) {
    return (
        <div className={className}>
            <div
                className={cn(
                    'relative rounded-[20px] px-4 py-3',
                    onDark
                        ? 'bg-white/12 text-white backdrop-blur-sm'
                        : 'bg-white text-ink shadow-[0_10px_30px_rgba(11,31,58,0.08)]',
                )}
            >
                <span
                    aria-hidden
                    className={cn(
                        'absolute right-5 -bottom-1.5 size-3 rotate-45 rounded-[2px]',
                        onDark ? 'bg-white/12' : 'bg-white',
                    )}
                />
                {thinking ? (
                    <div
                        className="flex h-10 items-center gap-1.5"
                        aria-label="Doppel denkt na"
                    >
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="size-2 animate-doppel-dots rounded-full bg-current"
                                style={{ animationDelay: `${i * 160}ms` }}
                            />
                        ))}
                    </div>
                ) : (
                    <p
                        key={text}
                        className="animate-doppel-rise text-[15px] leading-snug font-semibold"
                    >
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}
