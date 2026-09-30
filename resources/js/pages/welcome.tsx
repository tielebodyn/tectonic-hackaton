import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import Doppel from '@/components/doppel/Doppel';
import PushPreview from '@/components/doppel/PushPreview';
import type { Persona } from '@/components/doppel/types';
import { doppel, login } from '@/routes';
import { login as demoLogin } from '@/routes/demo';

export default function Welcome({ personas }: { personas: Persona[] }) {
    const { auth, flash } = usePage<{
        auth: { user: unknown };
        flash: { status: string | null };
    }>().props;

    return (
        <div className="doppel min-h-dvh bg-[#eef1f6] text-ink sm:px-4 sm:py-6">
            <Head title="Doppel" />
            <main className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-white sm:min-h-[844px] sm:rounded-[40px] sm:border sm:border-ink/6 sm:shadow-[0_30px_80px_rgba(11,31,58,0.18)]">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[460px] opacity-70 blur-3xl"
                    style={{
                        background:
                            'radial-gradient(circle at 15% 15%, #cfeee0, transparent 50%), radial-gradient(circle at 85% 25%, rgb(0 163 224 / 0.35), transparent 50%), radial-gradient(circle at 50% 75%, #e9def7, transparent 55%)',
                    }}
                />

                <section className="relative flex flex-col items-center px-5 pt-8">
                    <PushPreview className="w-full" />
                    <div className="mt-2">
                        <Doppel
                            mood="relaxed"
                            variant="backpack"
                            size={250}
                            wave
                        />
                    </div>
                </section>

                <section className="relative px-6 pt-4 text-center">
                    <h1 className="text-[28px] leading-[1.15] font-bold tracking-tight">
                        Je dubbelganger heeft volgende maand al geleefd
                    </h1>
                    <p className="mt-3 text-[15px] leading-snug text-ink/55">
                        Doppel leeft in je KBC-app een maand vooruit en vertelt
                        wat hem overkwam, voor het jou overkomt.
                    </p>
                </section>

                {flash?.status && (
                    <p className="mx-6 mt-4 rounded-2xl bg-orange-50 px-4 py-2 text-center text-[13px] text-orange-800">
                        {flash.status}
                    </p>
                )}

                <section className="relative px-5 pt-6 pb-8">
                    {personas.length > 0 ? (
                        <>
                            <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-ink/45 uppercase">
                                Verbind met KBC als
                            </p>
                            <div className="flex flex-col gap-2">
                                {personas.map((persona, i) => (
                                    <Form
                                        key={persona.persona_key}
                                        {...demoLogin.form(persona.persona_key)}
                                    >
                                        {({ processing }) => (
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex w-full animate-doppel-rise items-center gap-3 rounded-[22px] bg-[#f4f6fa] p-3 text-left transition-transform active:scale-[0.98] disabled:opacity-60"
                                                style={{
                                                    animationDelay: `${200 + i * 60}ms`,
                                                }}
                                            >
                                                <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white">
                                                    <Doppel
                                                        mood="relaxed"
                                                        variant={
                                                            persona.mascot_variant
                                                        }
                                                        size={40}
                                                    />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[15px] font-bold">
                                                        {persona.display_name}
                                                    </span>
                                                    <span className="block truncate text-[12px] text-ink/50">
                                                        {persona.age} jaar,{' '}
                                                        {persona.city}
                                                    </span>
                                                </span>
                                                <ChevronRight className="size-5 text-ink/40" />
                                            </button>
                                        )}
                                    </Form>
                                ))}
                            </div>
                        </>
                    ) : auth.user ? (
                        <Link
                            href={doppel()}
                            className="flex w-full items-center justify-center rounded-full bg-ink py-4 text-[16px] font-bold text-white"
                        >
                            Naar mijn Doppel
                        </Link>
                    ) : (
                        <div className="flex gap-3">
                            <Link
                                href={login()}
                                className="flex flex-1 items-center justify-center rounded-full bg-ink py-4 text-[16px] font-bold text-white"
                            >
                                Verbind met KBC
                            </Link>
                            <Link
                                href={login()}
                                className="flex flex-1 items-center justify-center rounded-full border border-ink/15 py-4 text-[16px] font-bold text-ink"
                            >
                                Aanmelden
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
