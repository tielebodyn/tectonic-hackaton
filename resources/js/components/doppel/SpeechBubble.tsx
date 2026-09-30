type Props = {
    text: string;
    /** Toont drie stipjes in plaats van de tekst. */
    thinking?: boolean;
    className?: string;
};

/** Glazen spraakbubbel met staartje linksonder, richting Doppel. */
export default function SpeechBubble({
    text,
    thinking = false,
    className,
}: Props) {
    return (
        <div className={className}>
            <div className="relative rounded-[22px] border border-white/15 bg-white/10 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
                <span
                    aria-hidden
                    className="absolute -bottom-2 left-6 size-4 rotate-45 rounded-[3px] border-r border-b border-white/15 bg-[#1d2a4f]"
                />
                {thinking ? (
                    <div
                        className="flex h-10 items-center justify-center gap-1.5"
                        aria-label="Doppel denkt na"
                    >
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="size-2 animate-doppel-dots rounded-full bg-white"
                                style={{ animationDelay: `${i * 160}ms` }}
                            />
                        ))}
                    </div>
                ) : (
                    <p
                        key={text}
                        className="animate-doppel-rise text-[14px] leading-snug font-medium text-white"
                    >
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}
