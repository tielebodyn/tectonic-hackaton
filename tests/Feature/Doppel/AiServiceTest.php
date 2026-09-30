<?php

use App\Enums\LifeStage;
use App\Enums\Scenario;
use App\Models\Customer;
use App\Services\Doppel\AiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

beforeEach(function () {
    Http::preventStrayRequests();

    $this->customer = new Customer([
        'display_name' => 'Karim El Amrani',
        'age' => 34,
        'city' => 'Gent',
        'life_stage' => LifeStage::SelfEmployed,
    ]);

    $this->predictions = collect([[
        'title' => 'Over drie weken kwam ik €900 tekort voor mijn BTW.',
        'expected_on' => '2026-10-20',
        'impact_cents' => -90000,
    ]]);
});

it('returns the Gemini text when the call succeeds', function () {
    config(['doppel.gemini_key' => 'test-key', 'doppel.gemini_model' => 'gemini-test']);

    Http::fake([
        'generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => "Hey Karim, op 20 oktober kwam ik €900 tekort.\n"]]]]],
        ]),
    ]);

    $opener = app(AiService::class)->writeOpener($this->customer, $this->predictions, Scenario::Base);

    expect($opener)->toBe('Hey Karim, op 20 oktober kwam ik €900 tekort.');

    Http::assertSent(fn ($request) => str_contains($request->url(), 'models/gemini-test:generateContent')
        && $request->hasHeader('x-goog-api-key', 'test-key')
        && str_contains($request['contents'][0]['parts'][0]['text'], '€900'));
});

it('falls back to a Dutch sentence when Gemini fails', function () {
    config(['doppel.gemini_key' => 'test-key']);
    Http::fake(['generativelanguage.googleapis.com/*' => Http::response('boom', 500)]);

    $opener = app(AiService::class)->writeOpener($this->customer, $this->predictions, Scenario::Base);

    expect($opener)->toBe('Hey Karim, ik heb je komende maand al geleefd. Over drie weken kwam ik €900 tekort voor mijn BTW.');
});

it('never throws and makes no call without a key', function () {
    config(['doppel.gemini_key' => null]);
    Http::fake();

    $opener = app(AiService::class)->writeOpener($this->customer, collect(), Scenario::Save100);

    expect($opener)->toContain('Hey Karim')->toContain('€100');
    Http::assertNothingSent();
});
