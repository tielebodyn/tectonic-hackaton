<?php

namespace App\Http\Controllers\Doppel;

use App\Enums\DemoEvent;
use App\Enums\Scenario;
use App\Enums\TransactionCategory;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\Doppel\DoppelRefresher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/** Demo-only endpoints: persona login, live events and reset. All 404 unless DEMO_MODE is on. */
class DemoController extends Controller
{
    public function login(Request $request, string $persona): RedirectResponse
    {
        $this->ensureDemoMode();

        $customer = Customer::where('persona_key', $persona)->with('user')->firstOrFail();

        abort_unless($customer->user?->is_demo, 404);

        Auth::login($customer->user);
        $request->session()->regenerate();

        return redirect()->route('doppel');
    }

    public function event(Request $request, DemoEvent $event, DoppelRefresher $refresher): RedirectResponse
    {
        $this->ensureDemoMode();
        $customer = DoppelController::customerFor($request);

        match ($event) {
            DemoEvent::KarimInvoicePaid => $this->payKarimInvoice($customer),
        };

        $this->rebuild($customer, $refresher);

        return redirect()->route('doppel')->with('status', 'Brouwerij De Leie heeft betaald.');
    }

    public function reset(Request $request, DoppelRefresher $refresher): RedirectResponse
    {
        $this->ensureDemoMode();
        $customer = DoppelController::customerFor($request);

        $customer->transactions()->where('is_simulated', true)->delete();
        $customer->feedback()->delete();

        $this->rebuild($customer, $refresher);

        return redirect()->route('doppel')->with('status', 'Demo teruggezet.');
    }

    private function payKarimInvoice(Customer $customer): void
    {
        abort_unless($customer->persona_key === 'karim', 422, 'Dit event hoort bij Karim.');

        // Idempotent: clicking twice during the demo must not double the income.
        $customer->transactions()->firstOrCreate(
            ['counterparty' => 'Brouwerij De Leie', 'is_simulated' => true],
            [
                'booked_on' => config('doppel.today'),
                'amount_cents' => 320000,
                'category' => TransactionCategory::Income,
                'description' => 'Factuur betaald',
            ],
        );
    }

    private function rebuild(Customer $customer, DoppelRefresher $refresher): void
    {
        $customer->predictions()->where('scenario', '!=', Scenario::Base)->delete();
        $refresher->refresh($customer, Scenario::Base);
    }

    private function ensureDemoMode(): void
    {
        abort_unless(config('doppel.demo_mode'), 404);
    }
}
