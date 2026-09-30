<?php

use App\Enums\LifeStage;
use App\Enums\Scenario;
use App\Models\Customer;
use App\Models\Feedback;
use App\Models\Prediction;
use App\Services\Doppel\DoppelRefresher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use Tests\Unit\Doppel\KarimFixture;

uses(TestCase::class, RefreshDatabase::class);

it('never brings a dismissed rule_key back', function () {
    Http::fake();
    $karim = Customer::create([
        'persona_key' => 'karim', 'display_name' => 'Karim', 'age' => 47, 'city' => 'Gent',
        'life_stage' => LifeStage::SelfEmployed,
    ]);
    KarimFixture::transactions()->each(fn ($t) => $karim->transactions()->save($t));
    $refresher = app(DoppelRefresher::class);
    $keys = fn () => Prediction::where('customer_id', $karim->id)->where('scenario', Scenario::Base)->pluck('rule_key')->all();

    $refresher->refresh($karim);
    expect($keys())->toContain('vat_shortfall');

    Feedback::create(['customer_id' => $karim->id, 'rule_key' => 'vat_shortfall', 'reason' => 'Dat ben ik niet']);
    $refresher->refresh($karim->fresh());
    $refresher->refresh($karim->fresh());
    $refresher->refresh($karim->fresh(), Scenario::Save100);

    expect($keys())->not->toContain('vat_shortfall')
        ->and($keys())->toContain('unpaid_client')
        ->and(Prediction::where('customer_id', $karim->id)->where('rule_key', 'vat_shortfall')->exists())->toBeFalse();
});
