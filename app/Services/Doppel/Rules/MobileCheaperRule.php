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
            title: 'Ik betaalde weer '.Ledger::euro($amount).' voor mijn gsm-abonnement',
            body: 'Een vergelijkbaar abonnement kostte ongeveer '.Ledger::euro(self::PARTNER_PRICE_CENTS).'. Dat was '.Ledger::euro($saving * 12).' per jaar dat ik liet liggen.',
            expectedOn: Ledger::nextOccurrence($mobile->booked_on->day, $today),
            confidence: 80,
            impactCents: -$saving,
            urgency: 30,
            signals: [
                ['label' => 'Gsm-abonnement', 'detail' => $mobile->counterparty.': '.Ledger::euro($amount).' per maand'],
                ['label' => 'Boven het gemiddelde', 'detail' => 'Meer dan '.Ledger::euro(self::THRESHOLD_CENTS).' per maand voor een starter'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Partner,
                    title: 'Goedkoper bellen via een KBC-partner',
                    body: 'Vergelijkbare data en belminuten voor ongeveer '.Ledger::euro(self::PARTNER_PRICE_CENTS).' per maand. Je nummer blijft hetzelfde.',
                    ctaLabel: 'Vergelijk abonnementen',
                    partnerName: 'Belmo',
                ),
            ],
        );
    }
}
