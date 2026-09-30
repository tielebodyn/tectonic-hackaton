import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Kobe } from '@/components/doppel/kobe';
import type { MascotVariant } from '@/components/doppel/kobe';
import { Button } from '@/components/ui/button';
import { doppel, login } from '@/routes';
import { login as demoLogin } from '@/routes/demo';

type Persona = {
    persona_key: string;
    display_name: string;
    age: number;
    city: string;
    mascot_variant: MascotVariant;
    persona_summary: string | null;
};

export default function Welcome({ personas }: { personas: Persona[] }) {
    const { auth, flash } = usePage<{
        auth: { user: unknown };
        flash: { status: string | null };
    }>().props;

    return (
        <>
            <Head title="Doppel" />
            <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[#F4F8FB] p-6 text-[#003665] dark:bg-[#0a0a0a] dark:text-sky-100">
                <header className="max-w-xl text-center">
                    <h1 className="text-4xl font-semibold">Doppel</h1>
                    <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                        Je digitale dubbelganger heeft de komende 30 dagen al
                        beleefd. Kobe vertelt je wat er gebeurde, voor het echt
                        gebeurt.
                    </p>
                </header>

                {flash?.status && (
                    <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                        {flash.status}
                    </p>
                )}

                {personas.length > 0 ? (
                    <div className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
                        {personas.map((persona) => (
                            <Form
                                key={persona.persona_key}
                                {...demoLogin.form(persona.persona_key)}
                                className="flex flex-col items-center gap-4 rounded-xl border bg-white p-6 text-center shadow-sm dark:bg-[#161615]"
                            >
                                {({ processing }) => (
                                    <>
                                        <Kobe
                                            variant={persona.mascot_variant}
                                        />
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {persona.display_name}
                                            </h2>
                                            <p className="text-sm text-slate-500">
                                                {persona.age} jaar,{' '}
                                                {persona.city}
                                            </p>
                                        </div>
                                        {persona.persona_summary && (
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                {persona.persona_summary}
                                            </p>
                                        )}
                                        <Button
                                            type="submit"
                                            className="mt-auto w-full"
                                            disabled={processing}
                                        >
                                            Bekijk als{' '}
                                            {persona.display_name.split(' ')[0]}
                                        </Button>
                                    </>
                                )}
                            </Form>
                        ))}
                    </div>
                ) : auth.user ? (
                    <Button asChild size="lg">
                        <Link href={doppel()}>Naar mijn Doppel</Link>
                    </Button>
                ) : (
                    <Button asChild size="lg">
                        <Link href={login()}>Inloggen</Link>
                    </Button>
                )}
            </div>
        </>
    );
}
