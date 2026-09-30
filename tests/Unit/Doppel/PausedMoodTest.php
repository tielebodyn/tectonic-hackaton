<?php

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Enums\Mood;
use App\Enums\Scenario;
use App\Models\Customer;
use App\Services\Doppel\CardComposer;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use App\Services\Doppel\SignalDetector;
use Tests\TestCase;
use Tests\Unit\Doppel\KarimFixture;

uses(TestCase::class);

it('pauses Karim and removes every sales card', function () {
    $detector = app(SignalDetector::class);
    $tx = KarimFixture::transactions();
    $predictions = $detector->detect(new Customer(['life_stage' => LifeStage::SelfEmployed]), $tx, Scenario::Base);
    $partner = new PredictionData(
        ruleKey: 'partner_card', title: 'Partner', body: null, expectedOn: now()->toImmutable(),
        confidence: 50, impactCents: null, urgency: 95, signals: [],
        actions: [new ActionData(kind: ActionKind::Partner, title: 'Koop', body: null, ctaLabel: 'Ja', partnerName: 'X')],
    );

    $mood = $detector->mood($tx, $predictions, Mood::Neutral);
    $cards = app(CardComposer::class)->compose(collect([...$predictions, $partner]), $mood);
    $kinds = $cards->flatMap(fn (PredictionData $p) => $p->actions)->map(fn (ActionData $a) => $a->kind);

    expect($mood)->toBe(Mood::Paused)
        ->and($cards->first()->ruleKey)->toBe(CardComposer::HANDOVER_RULE)
        ->and($kinds)->not->toContain(ActionKind::Kbc)
        ->and($kinds)->not->toContain(ActionKind::Partner)
        ->and($kinds)->toContain(ActionKind::Human)
        ->and($kinds)->toContain(ActionKind::NoSale);
});

it('is relieved once the pause no longer holds', function () {
    $detector = app(SignalDetector::class);
    $tx = KarimFixture::transactions()->push(KarimFixture::invoicePaid());
    $predictions = $detector->detect(new Customer(['life_stage' => LifeStage::SelfEmployed]), $tx, Scenario::Base);

    expect($detector->mood($tx, $predictions, Mood::Paused))->toBe(Mood::Relieved)
        ->and($detector->mood($tx, $predictions, Mood::Relieved))->toBe(Mood::Relieved)
        ->and($detector->mood($tx, $predictions, Mood::Neutral))->toBe(Mood::Neutral);
});

it('shows at most one sales card on top and always one no_sale card', function () {
    $card = fn (string $key, int $urgency, ActionKind $kind) => new PredictionData(
        ruleKey: $key, title: $key, body: null, expectedOn: now()->toImmutable(), confidence: 50,
        impactCents: null, urgency: $urgency, signals: [],
        actions: [new ActionData(kind: $kind, title: $key, body: null, ctaLabel: 'Ok')],
    );

    $cards = app(CardComposer::class)->compose(collect([
        $card('kbc', 90, ActionKind::Kbc),
        $card('partner', 80, ActionKind::Partner),
        $card('human', 10, ActionKind::Human),
    ]), Mood::Neutral);

    expect($cards->pluck('ruleKey')->all())->toBe(['kbc', 'human', 'partner', 'all_good']);
});
