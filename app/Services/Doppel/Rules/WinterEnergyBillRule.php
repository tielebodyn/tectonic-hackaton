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
            ['label' => 'Nieuw energiecontract', 'detail' => "Eerste betaling aan {$supplier} op ".Ledger::date($first->booked_on)],
            ['label' => 'Voorschot nu', 'detail' => Ledger::euro($last->amount_cents).' per maand'],
        ];

        if (Ledger::mentions($last, [Ledger::FIXED_TARIFF_MARKER])) {
            return new PredictionData(
                ruleKey: $this->key(),
                title: 'Mijn energiefactuur bleef deze winter gewoon gelijk',
                body: "Met een vast tarief bij {$supplier} betaalde ik ook in de koude maanden hetzelfde voorschot.",
                expectedOn: $today->addDays(30),
                confidence: 80,
                impactCents: 0,
                urgency: 20,
                signals: [...$signals, ['label' => 'Vast tarief', 'detail' => 'Je prijs lag vast voor de hele winter']],
                actions: [
                    new ActionData(
                        kind: ActionKind::NoSale,
                        title: 'Geen winterverrassing 👍',
                        body: 'Geen actie nodig. Je voorschot blijft gelijk.',
                        ctaLabel: 'Top',
                    ),
                ],
            );
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'Mijn eerste winterafrekening viel '.Ledger::euro(self::WINTER_INCREASE_CENTS).' hoger uit',
            body: "Nieuw huis, nieuw contract bij {$supplier} met een variabel tarief. Toen het kouder werd, ging mijn verbruik omhoog en het voorschot volgde.",
            expectedOn: $today->addDays(30),
            confidence: 70,
            impactCents: -self::WINTER_INCREASE_CENTS,
            urgency: 55,
            signals: [...$signals, ['label' => 'Eerste winter', 'detail' => 'Nog geen winterverbruik bekend voor dit adres']],
            actions: [
                new ActionData(
                    kind: ActionKind::Partner,
                    title: 'Vergelijk energiecontracten',
                    body: 'Vergelijk vaste en variabele tarieven voor je nieuwe adres voor de winter begint.',
                    ctaLabel: 'Vergelijk nu',
                    partnerName: 'Mijnenergie',
                ),
            ],
        );
    }
}
