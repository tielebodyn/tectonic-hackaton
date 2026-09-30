import { X } from 'lucide-react';
import { Confidence, relativeDay } from '@/components/doppel/diary';
import type { Prediction } from '@/types/doppel';

type Props = {
    prediction: Prediction | null;
    onClose: () => void;
    onNotMe: (prediction: Prediction) => void;
};

// "What Doppel saw": the signals behind a diary line, shown inside the phone.
export function SignalsDrawer({ prediction, onClose, onNotMe }: Props) {
    if (prediction === null) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-30 flex flex-col justify-end">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 animate-in bg-doppel-ink/40 fade-in"
            />
            <section className="relative max-h-[80%] animate-in overflow-y-auto rounded-t-3xl bg-white p-6 pb-8 shadow-2xl duration-300 slide-in-from-bottom">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-doppel-line" />
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 text-doppel-muted hover:text-doppel-ink"
                    aria-label="Close"
                >
                    <X className="size-5" />
                </button>

                <p className="text-xs font-semibold tracking-wide text-doppel-sky uppercase">
                    What Doppel saw
                </p>
                <p className="mt-2 font-diary text-lg leading-snug text-doppel-ink italic">
                    "{prediction.title}"
                </p>
                <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-doppel-muted">
                        {relativeDay(prediction.expected_at)}
                    </span>
                    <Confidence value={prediction.confidence} />
                </div>

                <ul className="mt-5 space-y-3">
                    {prediction.signals.map((signal) => (
                        <li
                            key={signal.label}
                            className="rounded-xl bg-doppel-paper p-3"
                        >
                            <p className="text-sm font-semibold text-doppel-ink">
                                {signal.label}
                            </p>
                            <p className="mt-0.5 text-sm text-doppel-muted">
                                {signal.detail}
                            </p>
                        </li>
                    ))}
                </ul>

                <p className="mt-5 text-xs leading-relaxed text-doppel-muted">
                    Doppel only uses your own KBC transactions. Predictions come
                    from clear rules, so every line can be explained.
                </p>

                <button
                    type="button"
                    onClick={() => onNotMe(prediction)}
                    className="mt-4 w-full rounded-full border border-doppel-line py-2.5 text-sm font-semibold text-doppel-ink hover:bg-doppel-paper"
                >
                    That's not me: correct my Doppel
                </button>
            </section>
        </div>
    );
}
