<?php

namespace App\Services\Doppel\Rules;

use App\Enums\ActionKind;
use App\Enums\LifeStage;
use App\Models\Customer;
use App\Services\Doppel\Data\ActionData;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/** Income fell by 30% or more compared to the months before: offer a human, not a product. */
class AdvisorCallRule implements Rule
{
    public function key(): string
    {
        return 'advisor_call';
    }

    public function appliesTo(Customer $customer): bool
    {
        return $customer->life_stage === LifeStage::SelfEmployed;
    }

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData
    {
        $income = Ledger::income($tx);
        $lastMonth = (int) Ledger::between($income, $today->subDays(30), $today)->sum('amount_cents');
        $before = (int) round(Ledger::between($income, $today->subDays(90), $today->subDays(30))->sum('amount_cents') / 2);

        if ($before === 0 || $lastMonth > $before * 0.7) {
            return null;
        }

        return new PredictionData(
            ruleKey: $this->key(),
            title: 'My income dropped from '.Ledger::euro($before).' to '.Ledger::euro($lastMonth).' a month',
            body: 'I wanted to talk it through with someone who knows the self-employed, not with an app.',
            expectedOn: $today->addDays(7),
            confidence: 80,
            impactCents: $lastMonth - $before,
            urgency: 60,
            signals: [
                ['label' => 'Income last 30 days', 'detail' => Ledger::euro($lastMonth)],
                ['label' => 'Average over the 2 months before', 'detail' => Ledger::euro($before).' a month'],
            ],
            actions: [
                new ActionData(
                    kind: ActionKind::Human,
                    title: 'Want an adviser to call you?',
                    body: 'A KBC adviser for the self-employed calls you, with no sales pitch.',
                    ctaLabel: 'Yes, call me',
                ),
            ],
        );
    }
}
