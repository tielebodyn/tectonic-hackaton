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

/** Two subscriptions that could go. No sales pitch, just money kept. */
class SubscriptionCleanupRule implements Rule
{
    public function key(): string
    {
        return 'subscription_cleanup';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::SelfEmployed;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $subs = Ledger::ofCategory(Ledger::between($tx, $today->subDays(45), $today), TransactionCategory::Subscription)
            ->filter(fn (Transaction $t) => $t->amount_cents < 0)
            ->sortByDesc('booked_on')
            ->unique(fn (Transaction $t) => mb_strtolower($t->counterparty ?? ''))
            ->sortBy(fn (Transaction $t) => abs($t->amount_cents))
            ->take(2)
            ->values();

        if ($subs->count() < 2) {
            return null;
        }

        $monthly = (int) abs($subs->sum('amount_cents'));
        $names = $subs->pluck('counterparty')->join(' and ');

        return new PredictionData(
            ruleKey: $this->key(),
            title: "{$names} kept running: together ".Ledger::euro($monthly).' a month',
            body: 'Whether I used them or not, the money left my account every month. Over a year that was '.Ledger::euro($monthly * 12).'.',
            expectedOn: Ledger::nextOccurrence($subs->first()->booked_on->day, $today),
            confidence: 60,
            impactCents: $monthly,
            urgency: 35,
            signals: $subs->map(fn (Transaction $t) => [
                'label' => $t->counterparty,
                'detail' => Ledger::euro($t->amount_cents).' a month, last on '.Ledger::date($t->booked_on),
            ])->all(),
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Cancel 2 subscriptions',
                    body: "Check whether you still need both {$names}.",
                    ctaLabel: 'Show subscriptions',
                ),
            ],
        );
    }
}
