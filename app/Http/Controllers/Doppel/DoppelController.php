<?php

namespace App\Http\Controllers\Doppel;

use App\Enums\DemoEvent;
use App\Enums\Scenario;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\Doppel\AiService;
use App\Services\Doppel\CardComposer;
use App\Services\Doppel\DoppelRefresher;
use App\Services\Doppel\Rules\Ledger;
use App\Services\Doppel\ScriptedPersonas;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DoppelController extends Controller
{
    public function show(
        Request $request,
        DoppelRefresher $refresher,
        CardComposer $composer,
        AiService $ai,
    ): Response|RedirectResponse {
        $customer = self::findCustomerFor($request);

        if ($customer === null) {
            return redirect()->route('home')->with('status', 'This user has no Doppel yet. Pick a persona below.');
        }
        $scenario = Scenario::tryFrom((string) $request->query('scenario')) ?? Scenario::Base;

        // Forks are computed lazily on first visit; base is kept fresh by seeders and actions.
        if (! $customer->predictions()->where('scenario', $scenario)->exists()) {
            $refresher->refresh($customer, $scenario);
            $customer->refresh();
        }

        $predictions = $customer->predictions()
            ->where('scenario', $scenario)
            ->with('actions')
            ->get();

        $cards = $composer->compose($predictions, $customer->mood);

        return Inertia::render('doppel/show', [
            'customer' => [
                'display_name' => $customer->display_name,
                'age' => $customer->age,
                'city' => $customer->city,
                'life_stage' => $customer->life_stage->value,
                'mascot_variant' => $customer->life_stage->mascotVariant(),
                'mood' => $customer->mood->value,
                'persona_key' => $customer->persona_key,
            ],
            'balance_cents' => $customer->balanceCents(),
            'monthly' => ScriptedPersonas::monthly($customer) ?? $this->monthlyFor($customer),
            'today' => config('doppel.today'),
            'scenario' => $scenario->value,
            'opener' => $this->openerFor($customer, $scenario, $cards, $ai),
            'cards' => $cards->map(fn ($card) => $card->toArray())->values(),
            'demo' => [
                'enabled' => (bool) config('doppel.demo_mode'),
                'events' => collect(DemoEvent::cases())->map(fn (DemoEvent $e) => $e->value),
                'personas' => Customer::whereNotNull('persona_key')->orderBy('id')->get(['persona_key', 'display_name'])
                    ->map(fn (Customer $c) => ['key' => $c->persona_key, 'label' => explode(' ', $c->display_name)[0]]),
            ],
        ]);
    }

    /** Average month over the 90 days up to today; the opening-balance row is not income. */
    private function monthlyFor(Customer $customer): array
    {
        $tx = $customer->transactions()
            ->whereBetween('booked_on', [Ledger::today()->subDays(90), Ledger::today()])
            ->where('counterparty', '!=', 'Beginsaldo')
            ->get(['amount_cents']);

        return [
            'income_cents' => (int) round($tx->where('amount_cents', '>', 0)->sum('amount_cents') / 3),
            'spend_cents' => (int) round(abs($tx->where('amount_cents', '<', 0)->sum('amount_cents')) / 3),
        ];
    }

    private function openerFor(Customer $customer, Scenario $scenario, $cards, AiService $ai): string
    {
        if ($scenario === Scenario::Base) {
            return $customer->diary_opener ?? $ai->writeOpener($customer, $cards, $scenario);
        }

        // Fork openers are not persisted; prediction ids change on every refresh, so they make a good cache key.
        $key = sprintf('doppel.opener.%d.%s.%s', $customer->id, $scenario->value, md5($cards->pluck('id')->implode(',')));

        return Cache::remember($key, now()->addHour(), fn () => $ai->writeOpener($customer, $cards, $scenario));
    }

    public static function customerFor(Request $request): Customer
    {
        $customer = self::findCustomerFor($request);

        abort_if($customer === null, 403, 'This user has no Doppel.');

        return $customer;
    }

    /** In demo mode, accounts without their own Doppel (e.g. test@example.com) look at Karim's. */
    private static function findCustomerFor(Request $request): ?Customer
    {
        return $request->user()->customer
            ?? (config('doppel.demo_mode') ? Customer::where('persona_key', 'karim')->first() : null);
    }
}
