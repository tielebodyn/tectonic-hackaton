<?php

use App\Enums\LifeStage;
use App\Enums\Scenario;
use App\Models\Customer;
use App\Services\Doppel\Data\PredictionData;
use App\Services\Doppel\Rules\Ledger;
use App\Services\Doppel\SignalDetector;
use Illuminate\Support\Collection;
use Tests\TestCase;
use Tests\Unit\Doppel\KarimFixture;

uses(TestCase::class);

function vatShortfall(Collection $tx): ?PredictionData
{
    $karim = new Customer(['life_stage' => LifeStage::SelfEmployed]);

    return collect(app(SignalDetector::class)->detect($karim, $tx, Scenario::Base))
        ->first(fn (PredictionData $p) => $p->ruleKey === 'vat_shortfall');
}

it('predicts exactly €900 VAT shortfall for Karim', function () {
    $tx = KarimFixture::transactions();

    expect(Ledger::balance($tx, Ledger::today()))->toBe(145000)
        ->and((int) Ledger::projectedOutflows($tx, Ledger::today(), Ledger::today()->setDate(2026, 10, 20))->sum('amount_cents'))->toBe(65000);

    $prediction = vatShortfall($tx);

    expect($prediction)->not->toBeNull()
        ->and($prediction->impactCents)->toBe(-90000)
        ->and($prediction->title)->toContain('€900')
        ->and($prediction->expectedOn->toDateString())->toBe('2026-10-20');
});

it('drops the shortfall once the €3.200 invoice is paid', function () {
    $tx = KarimFixture::transactions()->push(KarimFixture::invoicePaid());

    expect(vatShortfall($tx))->toBeNull();
});
