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

/** Student-priced subscriptions plus a first salary: the student discount is about to end. */
class StudentDiscountEndsRule implements Rule
{
    public function key(): string
    {
        return 'student_discount_ends';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Starter;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $salary = Ledger::firstSalary($tx, $today);
        $studentSubs = Ledger::ofCategory(Ledger::between($tx, $today->subDays(45), $today), TransactionCategory::Subscription)
            ->filter(fn (Transaction $t) => Ledger::mentions($t, ['student']))
            ->unique(fn (Transaction $t) => mb_strtolower($t->counterparty ?? ''))
            ->values();

        if (! $salary || $studentSubs->isEmpty()) {
            return null;
        }

        $names = $studentSubs->pluck('counterparty')->join(', ', ' and ');
        // Regular price is roughly double the student price.
        $extra = (int) abs($studentSubs->sum('amount_cents'));

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'On '.Ledger::date($today->addDays(7)).' I lost my student discount',
            body: "With my first permanent job I was no longer a student. {$names} switched to the regular price: about ".Ledger::euro($extra).' a month more.',
            expectedOn: $today->addDays(7),
            confidence: 85,
            impactCents: -$extra,
            urgency: 70,
            signals: [
                ['label' => 'Student price', 'detail' => $studentSubs->map(fn (Transaction $t) => $t->counterparty.' ('.Ledger::euro($t->amount_cents).'/month)')->join(', ')],
                ['label' => 'First salary', 'detail' => $salary->counterparty.' paid '.Ledger::euro($salary->amount_cents).' on '.Ledger::date($salary->booked_on)],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Line up your subscriptions',
                    body: 'See which ones you really use before the discount ends. You can usually cancel monthly.',
                    ctaLabel: 'View subscriptions',
                ),
            ],
        );
    }
}
