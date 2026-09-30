<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Models\Customer;
use App\Models\Transaction;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * A new (variable) energy contract after a move: the first winter bill comes in higher.
 * In the fixed_energy scenario the contract is fixed, so the rule reports a stable bill instead.
 */
class WinterEnergyBillRule implements Rule
{
    private const WINTER_INCREASE_CENTS = 18000;

    public function key(): string
    {
        return 'winter_energy_bill';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Moving;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $energy = $tx->filter(fn (Transaction $t) => $t->amount_cents < 0 && $t->booked_on->lte($today) && Ledger::isEnergy($t))
            ->sortBy('booked_on');
        $first = $energy->first();

        if (! $first || $first->booked_on->lt($today->subDays(90))) {
            return null;
        }

        $last = $energy->last();
        $supplier = $last->counterparty;
        $signals = [
            ['label' => 'New energy contract', 'detail' => "First payment to {$supplier} on ".Ledger::date($first->booked_on)],
            ['label' => 'Advance now', 'detail' => Ledger::euro($last->amount_cents).' a month'],
        ];

        if (Ledger::mentions($last, [Ledger::FIXED_TARIFF_MARKER])) {
            return new PredictionData(
                ruleKey: $this->key(),
                title: 'My energy advance stayed the same all winter',
                body: "With a fixed rate at {$supplier} I paid the same advance, even in the cold months.",
                expectedOn: $today->addDays(30),
                confidence: 80,
                impactCents: 0,
                urgency: 20,
                signals: [...$signals, ['label' => 'Fixed rate', 'detail' => 'Your price was locked in for the whole winter']],
                actions: [
                    new ActionData(
                        kind: ActionKind::NoSale,
                        title: 'No winter surprise',
                        body: 'Nothing to do. Your advance stays the same.',
                        ctaLabel: 'Great',
                    ),
                ],
            );
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'My first winter in the new home cost '.Ledger::euro(self::WINTER_INCREASE_CENTS).' more in energy',
            body: "New home, new contract at {$supplier} with a variable rate. When it got colder my usage went up and the advance followed.",
            expectedOn: $today->addDays(30),
            confidence: 70,
            impactCents: -self::WINTER_INCREASE_CENTS,
            urgency: 55,
            signals: [...$signals, ['label' => 'First winter', 'detail' => 'No winter usage known yet for this address']],
            actions: [
                new ActionData(
                    kind: ActionKind::Partner,
                    title: 'Compare energy contracts',
                    body: 'Compare fixed and variable rates for your new address before winter starts.',
                    ctaLabel: 'Compare now',
                    partnerName: 'Mijnenergie',
                ),
            ],
        );
    }
}
