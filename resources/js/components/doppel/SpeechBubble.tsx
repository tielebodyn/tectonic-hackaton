type Props = {
    text: string;
    /** Toont drie stipjes in plaats van de tekst. */
    thinking?: boolean;
};

/** Doppels opener, als een citaat in de display-serif. */
export default function SpeechBubble({ text, thinking = false }: Props) {
    return (
        <div className="relative mx-auto w-full">
            {/* staartje richting Doppel */}
            <span
                aria-hidden
                className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 rounded-[3px] border-t border-l border-ink/8 bg-white"
            />
            <div className="rounded-frame border border-ink/8 bg-white px-6 py-5">
                {thinking ? (
                    <div
                        className="flex h-[3.4rem] items-center justify-center gap-1.5"
                        aria-label="Doppel denkt na"
                    >
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="size-2 animate-doppel-dots rounded-full bg-ink"
                                style={{ animationDelay: `${i * 160}ms` }}
                            />
                        ))}
                    </div>
                ) : (
                    <p
                        key={text}
                        className="animate-doppel-rise font-display text-[1.55rem] leading-[1.2] text-ink"
                    >
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}
