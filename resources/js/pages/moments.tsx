import { Head } from '@inertiajs/react';
import { Presentation, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { IntelligencePanel } from '@/moments/components/console/intelligence-panel';
import { PhoneApp } from '@/moments/components/phone/phone-app';
import { PortfolioView } from '@/moments/components/portfolio/portfolio-view';
import { personas } from '@/moments/data/personas';
import { view as buildView } from '@/moments/engine';
import { Avatar } from '@/moments/ui';
import { cn } from '@/lib/utils';

type Mode = 'app' | 'year';

/** ?p=karim&mode=year&fire=event-id deep-links a demo state (also used for screenshots). */
const params =
    typeof window === 'undefined'
        ? new URLSearchParams()
        : new URLSearchParams(window.location.search);
const initialMode: Mode = ['year', 'portfolio'].includes(
    params.get('mode') ?? '',
)
    ? 'year'
    : 'app';

export default function Moments() {
    const [mode, setMode] = useState<Mode>(initialMode);
    const [selectedId, setSelectedId] = useState(
        params.get('p') ?? personas[0]?.id ?? '',
    );
    const [fired, setFired] = useState<Record<string, string[]>>(() =>
        params.get('fire')
            ? {
                  [params.get('p') ?? personas[0]?.id ?? '']: params
                      .get('fire')!
                      .split(','),
              }
            : {},
    );
    const [dismissed, setDismissed] = useState<Record<string, string[]>>({});
    const [query, setQuery] = useState('');

    const persona = personas.find((p) => p.id === selectedId) ?? personas[0];
    const current = persona
        ? buildView(
              persona,
              fired[persona.id] ?? [],
              dismissed[persona.id] ?? [],
          )
        : null;

    const filtered = personas.filter((p) =>
        `${p.name} ${p.lifeStage} ${p.city} ${p.tagline}`
            .toLowerCase()
            .includes(query.toLowerCase()),
    );

    const fire = (eventId: string) =>
        setFired((f) => ({
            ...f,
            [selectedId]: [...new Set([...(f[selectedId] ?? []), eventId])],
        }));
    const dismiss = (recId: string) =>
        setDismissed((d) => ({
            ...d,
            [selectedId]: [...new Set([...(d[selectedId] ?? []), recId])],
        }));
    const reset = () => {
        setFired((f) => ({ ...f, [selectedId]: [] }));
        setDismissed((d) => ({ ...d, [selectedId]: [] }));
    };

    return (
        <>
            <Head title="KBC Moments" />
            <div className="flex h-screen min-h-[720px] flex-col bg-mist font-sans text-ink">
                <header className="flex h-14 shrink-0 items-center gap-6 border-b border-line bg-white px-5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-kbc-navy text-[10px] font-bold tracking-tight text-white">
                            KBC
                        </div>
                        <div className="leading-tight">
                            <div className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight">
                                Moments
                                <Sparkles
                                    className="size-3.5 text-kbc-sky"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div className="text-[11px] text-ink-3">
                                Your bank, one step ahead of you
                            </div>
                        </div>
                    </div>

                    <nav className="ml-4 flex rounded-lg bg-mist p-0.5 text-[13px] font-medium">
                        {(
                            [
                                ['app', 'Your app'],
                                ['year', 'Your year ahead'],
                            ] as const
                        ).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setMode(key)}
                                className={cn(
                                    'rounded-md px-3 py-1.5 transition-colors',
                                    mode === key
                                        ? 'bg-white text-ink shadow-sm'
                                        : 'text-ink-2 hover:text-ink',
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-3 text-[12px] text-ink-3">
                        <span className="flex items-center gap-1.5">
                            <Presentation className="size-3.5" />
                            Demo · fictional customers
                        </span>
                        <span className="rounded-md border border-line px-2 py-1 tabular-nums">
                            Wed 30 Sep 2026
                        </span>
                    </div>
                </header>

                <div
                    className={cn(
                        'grid min-h-0 flex-1',
                        mode === 'app'
                            ? 'grid-cols-[248px_auto_minmax(0,1fr)]'
                            : 'grid-cols-[248px_minmax(0,1fr)]',
                    )}
                >
                    <aside className="flex min-h-0 flex-col border-r border-line bg-white/70">
                        <div className="space-y-3 px-4 pt-4 pb-3">
                            <div className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">
                                Demo · be one of them
                            </div>
                            <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px]">
                                <Search className="size-3.5 text-ink-3" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search people"
                                    className="w-full bg-transparent outline-none placeholder:text-ink-3"
                                />
                            </label>
                        </div>
                        <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
                            {filtered.map((p) => {
                                const active = p.id === persona?.id;

                                return (
                                    <li key={p.id}>
                                        <button
                                            onClick={() => setSelectedId(p.id)}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors',
                                                active
                                                    ? 'bg-white shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-line'
                                                    : 'hover:bg-white',
                                            )}
                                        >
                                            <Avatar
                                                initials={p.avatar.initials}
                                                hue={p.avatar.hue}
                                                size={34}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span
                                                        className={cn(
                                                            'truncate text-[13px] font-semibold',
                                                            active &&
                                                                'text-kbc-navy',
                                                        )}
                                                    >
                                                        {p.firstName}
                                                    </span>
                                                    <span className="text-[12px] text-ink-3 tabular-nums">
                                                        {p.age}
                                                    </span>
                                                </div>
                                                <div className="truncate text-[12px] text-ink-2">
                                                    {p.lifeStage}
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </aside>

                    {mode === 'app' ? (
                        <>
                            <section className="flex min-h-0 items-start justify-center overflow-y-auto px-8 py-6">
                                {current && (
                                    <PhoneApp
                                        key={current.id}
                                        view={current}
                                        onDismiss={dismiss}
                                    />
                                )}
                            </section>
                            <section className="min-h-0 overflow-y-auto border-l border-line bg-white">
                                {current && (
                                    <IntelligencePanel
                                        key={current.id}
                                        view={current}
                                        onFire={fire}
                                        onReset={reset}
                                    />
                                )}
                            </section>
                        </>
                    ) : (
                        <main className="min-h-0 overflow-y-auto">
                            {current && (
                                <PortfolioView
                                    key={current.id}
                                    personas={personas}
                                    view={current}
                                    onOpenPersona={(id) => {
                                        setSelectedId(id);
                                        setMode('app');
                                    }}
                                />
                            )}
                        </main>
                    )}
                </div>
            </div>
        </>
    );
}
