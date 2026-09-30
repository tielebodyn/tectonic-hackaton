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

/** Income comfortably covers rent and fixed costs: a card that sells nothing. */
class BudgetOkRule implements Rule
{
    public function key(): string
    {
        return 'budget_ok';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Starter;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $income = (int) Ledger::income(Ledger::between($tx, $today->subDays(30), $today))
            ->filter(fn (Transaction $t) => $t->booked_on->lte($today))
            ->sum('amount_cents');
        $fixed = (int) Ledger::recurringOutflows($tx, $today)->sum('amount_cents');
        $left = $income - $fixed;

        if ($income === 0 || $left <= 0) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'Na de huur en de vaste kosten hield ik '.Ledger::euro($left).' over',
            body: 'Mijn loon dekte ruim mijn vaste kosten. Wat ik daarna uitgaf, koos ik zelf.',
            expectedOn: $today->addMonthNoOverflow()->endOfMonth()->startOfDay(),
            confidence: 80,
            impactCents: $left,
            urgency: 10,
            signals: [
                ['label' => 'Inkomsten', 'detail' => Ledger::euro($income).' in de laatste 30 dagen'],
                ['label' => 'Vaste kosten', 'detail' => Ledger::euro($fixed).' per maand aan huur en abonnementen'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Je budget zit goed 👍',
                    body: 'Geen actie nodig. Ik hou het voor je in de gaten.',
                    ctaLabel: 'Top',
                ),
            ],
        );
    }
}
