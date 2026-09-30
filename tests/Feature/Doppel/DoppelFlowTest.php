<?php

use App\Enums\Mood;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    Http::preventStrayRequests();
    config(['doppel.demo_mode' => true, 'doppel.gemini_key' => null]);
    $this->seed();
});

function karim(): Customer
{
    return Customer::where('persona_key', 'karim')->firstOrFail();
}

function cardKeys($page): array
{
    return collect($page->toArray()['props']['cards'])->pluck('rule_key')->all();
}

it('shows the persona picker in demo mode', function () {
    $this->get('/personas')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('welcome')->has('personas', 12));
});

it('opens the app as karim for guests on the home page', function () {
    $this->get('/')->assertRedirect('/doppel');

    $this->assertAuthenticatedAs(karim()->user);
});

it('switches persona with ?as= on the home page', function () {
    $this->get('/?as=marc')->assertRedirect('/doppel');

    $this->assertAuthenticatedAs(Customer::where('persona_key', 'marc')->first()->user);
});

it('shows a scripted persona through the same diary', function () {
    $this->actingAs(Customer::where('persona_key', 'georgette')->first()->user)
        ->get('/doppel')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('customer.persona_key', 'georgette')
            ->where('customer.mood', 'paused')
            ->has('cards')
            ->has('monthly.income_cents'));
});

it('logs in as a demo persona without a password', function () {
    $this->post('/demo/login/karim')->assertRedirect('/doppel');

    $this->assertAuthenticatedAs(karim()->user);
});

it('hides the demo endpoints outside demo mode', function () {
    config(['doppel.demo_mode' => false]);

    $this->post('/demo/login/karim')->assertNotFound();

    $this->actingAs(karim()->user)->post('/doppel/reset')->assertNotFound();
});

it('redirects guests to the login page', function () {
    $this->get('/doppel')->assertRedirect('/login');
});

it('shows karim to users without a doppel in demo mode', function () {
    $this->actingAs(User::factory()->create())
        ->get('/doppel')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('customer.persona_key', 'karim'));
});

it('sends users without a doppel to the home page outside demo mode', function () {
    config(['doppel.demo_mode' => false]);

    $this->actingAs(User::factory()->create())->get('/doppel')->assertRedirect('/');
});

it('lets a logged-in user switch persona', function () {
    $this->actingAs(User::factory()->create())->post('/demo/login/lotte')->assertRedirect('/doppel');

    $this->assertAuthenticatedAs(Customer::where('persona_key', 'lotte')->first()->user);
});

it('shows karim his €900 VAT shortfall and clears it when the invoice is paid', function () {
    $this->actingAs(karim()->user);

    $this->get('/doppel')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('doppel/show')
            ->where('balance_cents', 145000)
            ->where('customer.persona_key', 'karim')
            ->where('opener', fn ($opener) => filled($opener))
            ->where('cards', fn ($cards) => collect($cards)->contains(
                fn ($card) => $card['rule_key'] === 'vat_shortfall' && abs($card['impact_cents']) === 90000,
            )));

    $this->post('/doppel/events/karim_invoice_paid')->assertRedirect('/doppel');
    $this->post('/doppel/events/karim_invoice_paid'); // idempotent

    expect(karim()->transactions()->where('is_simulated', true)->count())->toBe(1);
    expect(karim()->mood)->toBe(Mood::Relieved);

    $this->get('/doppel')->assertInertia(fn (Assert $page) => $page
        ->where('balance_cents', 465000)
        ->where('cards', fn ($cards) => ! collect($cards)->contains('rule_key', 'vat_shortfall')));

    $this->post('/doppel/reset')->assertRedirect('/doppel');

    expect(karim()->transactions()->where('is_simulated', true)->count())->toBe(0);
    $this->get('/doppel')->assertInertia(fn (Assert $page) => $page
        ->where('cards', fn ($cards) => collect($cards)->contains('rule_key', 'vat_shortfall')));
});

it('stops predicting a rule after "Dat ben ik niet"', function () {
    $this->actingAs(karim()->user);

    $prediction = karim()->predictions()->where('scenario', 'base')->where('rule_key', 'vat_shortfall')->firstOrFail();

    $this->from('/doppel')
        ->post('/doppel/feedback', ['prediction_id' => $prediction->id, 'reason' => 'Mijn boekhouder regelt dat'])
        ->assertRedirect('/doppel');

    expect(karim()->feedback()->where('rule_key', 'vat_shortfall')->exists())->toBeTrue();
    $this->get('/doppel')->assertInertia(fn (Assert $page) => $page
        ->where('cards', fn ($cards) => ! collect($cards)->contains('rule_key', 'vat_shortfall')));
});

it('rejects feedback on another customer\'s prediction', function () {
    $lotte = Customer::where('persona_key', 'lotte')->firstOrFail();
    $foreign = karim()->predictions()->firstOrFail();

    $this->actingAs($lotte->user)
        ->post('/doppel/feedback', ['prediction_id' => $foreign->id])
        ->assertNotFound();
});

it('computes a scenario fork on first visit', function (string $scenario) {
    $this->actingAs(karim()->user)
        ->get('/doppel?scenario='.$scenario)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('scenario', $scenario)->where('opener', fn ($o) => filled($o)));

    expect(karim()->predictions()->where('scenario', $scenario)->exists())->toBeTrue();
})->with(['save_100', 'fixed_energy']);
