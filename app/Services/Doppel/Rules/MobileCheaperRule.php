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

/** A mobile plan above €25 a month: a partner plan is cheaper. */
class MobileCheaperRule implements Rule
{
    private const THRESHOLD_CENTS = 2500;

    private const PARTNER_PRICE_CENTS = 1500;

    public function key(): string
    {
        return 'mobile_cheaper';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::Starter;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $mobile = Ledger::ofCategory(Ledger::between($tx, $today->subDays(45), $today), TransactionCategory::Utilities, TransactionCategory::Subscription)
            ->filter(fn (Transaction $t) => $t->amount_cents < 0 && Ledger::mentions($t, Ledger::MOBILE_KEYWORDS))
            ->sortByDesc('booked_on')
            ->first();

        if (! $mobile || abs($mobile->amount_cents) <= self::THRESHOLD_CENTS) {
            return null;
        }

        $amount = (int) abs($mobile->amount_cents);
        $saving = $amount - self::PARTNER_PRICE_CENTS;

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'I paid '.Ledger::euro($amount).' for my mobile plan again',
            body: 'A similar plan cost about '.Ledger::euro(self::PARTNER_PRICE_CENTS).'. That was '.Ledger::euro($saving * 12).' a year I left on the table.',
            expectedOn: Ledger::nextOccurrence($mobile->booked_on->day, $today),
            confidence: 80,
            impactCents: -$saving,
            urgency: 30,
            signals: [
                ['label' => 'Mobile plan', 'detail' => $mobile->counterparty.': '.Ledger::euro($amount).' a month'],
                ['label' => 'Above average', 'detail' => 'More than '.Ledger::euro(self::THRESHOLD_CENTS).' a month for a starter'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Partner,
                    title: 'Cheaper calls through a KBC partner',
                    body: 'Similar data and minutes for about '.Ledger::euro(self::PARTNER_PRICE_CENTS).' a month. You keep your number.',
                    ctaLabel: 'Compare plans',
                    partnerName: 'Belmo',
                ),
            ],
        );
    }
}
