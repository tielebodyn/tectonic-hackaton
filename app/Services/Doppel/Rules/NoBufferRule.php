<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Enums\TransactionCategory;
use App\Models\Customer;
use App\Models\Transaction;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * No savings and less than one month of spending on the account. When the customer does save
 * (really or in the save_100 scenario) the same rule reports the growing buffer instead.
 */
class NoBufferRule implements Rule
{
    public function key(): string
    {
        return 'no_buffer';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Starter;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $savings = Ledger::ofCategory($tx, TransactionCategory::Savings);

        if ($savings->isNotEmpty()) {
            return $this->buffer($savings, $today);
        }

        $balance = Ledger::balance($tx, $today);
        $spending = Ledger::monthlySpending($tx, $today);

        if ($spending === 0 || $balance >= $spending) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'Op het eind van de maand stond mijn rekening bijna op nul',
            body: 'Ik had geen spaarbuffer. Eén onverwachte rekening, zoals een kapotte laptop, en ik kwam krap te zitten.',
            expectedOn: $today->addMonthNoOverflow()->endOfMonth()->startOfDay(),
            confidence: 75,
            impactCents: null,
            urgency: 60,
            signals: [
                ['label' => 'Geen spaarrekening', 'detail' => 'Geen overschrijvingen naar een spaarrekening gevonden'],
                ['label' => 'Saldo vandaag', 'detail' => Ledger::euro($balance).' op je zichtrekening'],
                ['label' => 'Uitgaven per maand', 'detail' => Ledger::euro($spending).' in de laatste 30 dagen'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Kbc,
                    title: 'Automatisch sparen bij KBC',
                    body: 'Zet elke maand automatisch een vast bedrag opzij, vanaf €25. Stoppen of pauzeren kan altijd.',
                    ctaLabel: 'Start een spaarplan',
                ),
            ],
        );
    }

    private function buffer(Collection $savings, CarbonImmutable $today): PredictionData
    {
        $monthly = (int) abs($savings->sortByDesc('booked_on')->first()->amount_cents);
        $firstUpcoming = $savings->filter(fn (Transaction $t) => $t->booked_on->gt($today))->sortBy('booked_on')->first();
        $horizon = $today->addDays(30);
        $saved = (int) abs($savings->filter(fn (Transaction $t) => $t->booked_on->lte($horizon))->sum('amount_cents'));

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'Ik zette '.Ledger::euro($monthly).' opzij en had mijn eerste buffer',
            body: 'Elke maand ging er automatisch '.Ledger::euro($monthly).' naar mijn spaarrekening. Na een maand lag er al een eerste buffer klaar voor een onverwachte rekening.',
            expectedOn: $firstUpcoming?->booked_on ?? $horizon,
            confidence: 90,
            impactCents: $saved,
            urgency: 20,
            signals: [
                ['label' => 'Maandelijks sparen', 'detail' => Ledger::euro($monthly).' per maand naar je spaarrekening'],
                ['label' => 'Buffer over 30 dagen', 'detail' => Ledger::euro($saved).' gespaard'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Je buffer groeit 👍',
                    body: 'Geen actie nodig. Ik hou het voor je in de gaten.',
                    ctaLabel: 'Top',
                ),
            ],
        );
    }
}
