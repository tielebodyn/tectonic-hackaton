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

/** A client that used to pay every month has missed two or more payments. */
class UnpaidClientRule implements Rule
{
    public function key(): string
    {
        return 'unpaid_client';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::SelfEmployed;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $late = Ledger::income($tx)
            ->filter(fn (Transaction $t) => $t->booked_on->lte($today))
            ->groupBy(fn (Transaction $t) => mb_strtolower($t->counterparty ?? ''))
            ->filter(fn (Collection $payments) => $payments->count() >= 2)
            ->map(function (Collection $payments) use ($today) {
                $sorted = $payments->sortBy('booked_on')->values();
                $last = $sorted->last();
                $interval = max(1, (int) round($sorted->first()->booked_on->diffInDays($last->booked_on) / ($sorted->count() - 1)));
                $daysSince = (int) $last->booked_on->diffInDays($today);

                return [
                    'client' => $last->counterparty,
                    'last' => $last,
                    'count' => $sorted->count(),
                    'amount_cents' => (int) round($sorted->avg('amount_cents')),
                    'days_since' => $daysSince,
                    // A few days of slack so "paid on the 1st, today is the 30th" still counts.
                    'missed' => intdiv($daysSince + 5, $interval),
                ];
            })
            ->filter(fn (array $client) => $client['missed'] >= 2)
            ->sortByDesc('amount_cents')
            ->first();

        if (! $late) {
            return null;
        }

        $missed = $late['missed'] === 2 ? 'two' : $late['missed'];

        return new PredictionData(
            ruleKey: $this->key(),
            title: "{$late['client']} hadn't paid me for {$missed} months",
            body: 'A regular client who paid every month suddenly went quiet. That left me '.Ledger::euro($late['amount_cents'] * $late['missed']).' short that I had counted on.',
            expectedOn: $today->addDays(3),
            confidence: 75,
            impactCents: -$late['amount_cents'] * $late['missed'],
            urgency: 70,
            signals: [
                ['label' => 'Regular client', 'detail' => "{$late['client']} paid {$late['count']}× about ".Ledger::euro($late['amount_cents'])],
                ['label' => 'Last payment', 'detail' => Ledger::date($late['last']->booked_on).", {$late['days_since']} days ago"],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::NoSale,
                    title: 'Send a payment reminder',
                    body: "A friendly reminder to {$late['client']} often sorts it out.",
                    ctaLabel: 'Write a reminder',
                ),
            ],
        );
    }
}
