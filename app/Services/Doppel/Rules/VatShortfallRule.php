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
 * Balance today, minus the fixed outflows until the next quarterly VAT deadline, minus a VAT
 * payment as big as the previous one. Negative means Doppel came up short.
 */
class VatShortfallRule implements Rule
{
    public function key(): string
    {
        return 'vat_shortfall';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::SelfEmployed;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $previousVat = Ledger::ofCategory($tx, TransactionCategory::Tax)
            ->filter(fn (Transaction $t) => $t->amount_cents < 0 && $t->booked_on->lte($today))
            ->sortBy('booked_on')
            ->last();

        if (! $previousVat) {
            return null;
        }

        $deadline = self::nextVatDeadline($today);
        $balance = Ledger::balance($tx, $today);
        $outflows = Ledger::projectedOutflows($tx, $today, $deadline);
        $outflowCents = (int) $outflows->sum('amount_cents');
        $vatCents = (int) abs($previousVat->amount_cents);
        $shortfall = $balance - $outflowCents - $vatCents;

        if ($shortfall >= 0) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'On '.Ledger::date($deadline).' I was '.Ledger::euro($shortfall).' short for my VAT',
            body: 'That was the deadline for this quarter\'s VAT, but after my fixed costs there was not enough left in the account.',
            expectedOn: $deadline,
            confidence: 85,
            impactCents: $shortfall,
            urgency: 90,
            signals: [
                ['label' => 'Balance today', 'detail' => Ledger::euro($balance).' in your business account'],
                ['label' => 'Fixed costs until '.Ledger::date($deadline), 'detail' => Ledger::euro($outflowCents).' in '.$outflows->count().' fixed payments'],
                ['label' => 'VAT last quarter', 'detail' => Ledger::euro($vatCents).' paid on '.Ledger::date($previousVat->booked_on)],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Kbc,
                    title: 'KBC Cash Credit',
                    body: 'A flexible credit line for your business. You only pay interest on what you actually use.',
                    ctaLabel: 'View cash credit',
                ),
            ],
        );
    }

    /** Quarterly VAT is due on the 20th of January, April, July and October. */
    public static function nextVatDeadline(CarbonImmutable $today): CarbonImmutable
    {
        $candidate = $today->startOfMonth()->setDay(20);

        while ($candidate->lte($today) || ! in_array($candidate->month, [1, 4, 7, 10], true)) {
            $candidate = $candidate->addMonthNoOverflow();
        }

        return $candidate;
    }
}
