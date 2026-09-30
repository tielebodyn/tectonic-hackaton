<?php

namespace App\Services\Doppel;

use App\Enums\Mood;
use App\Enums\Scenario;
use App\Enums\TransactionCategory;
use App\Models\Customer;
use App\Services\Doppel\Data\PredictionData;
use App\Services\Doppel\Rules\Ledger;
use Illuminate\Support\Collection;

/**
 * Runs every rule against a customer's transactions. Plain PHP, no AI, so it can run in batch
 * for every customer.
 */
class SignalDetector
{
    /** Predictions that count as "Doppel ran out of money" for the paused mood. */
    private const SHORTFALL_RULES = ['vat_shortfall'];

    /** @return list<Rules\Rule> */
    public function rules(): array
    {
        return [
            new Rules\StudentDiscountEndsRule,
            new Rules\FirstTaxBillRule,
            new Rules\NoBufferRule,
            new Rules\MobileCheaperRule,
            new Rules\BudgetOkRule,
            new Rules\AddressChangesRule,
            new Rules\WinterEnergyBillRule,
            new Rules\HomeInsuranceRule,
            new Rules\VatShortfallRule,
            new Rules\UnpaidClientRule,
            new Rules\SubscriptionCleanupRule,
            new Rules\AdvisorCallRule,
        ];
    }

    /** @return list<PredictionData> */
    public function detect(Customer $customer, Collection $transactions, Scenario $scenario = Scenario::Base): array
    {
        $today = Ledger::today();
        $predictions = [];

        foreach ($this->rules() as $rule) {
            if (! $rule->appliesTo($customer)) {
                continue;
            }

            if ($prediction = $rule->evaluate($customer, $transactions, $today)) {
                $predictions[] = $prediction;
            }
        }

        return $predictions;
    }

    /**
     * Paused: the balance is dropping, there is a buy-now-pay-later purchase and a shortfall ahead.
     * Relieved: it was paused and that no longer holds. It stays relieved on later refreshes
     * (a second click, feedback) until something pauses Doppel again. Otherwise neutral.
     *
     * @param  list<PredictionData>  $predictions
     */
    public function mood(Collection $transactions, array $predictions, ?Mood $previous): Mood
    {
        $today = Ledger::today();
        $declining = Ledger::balance($transactions, $today) < Ledger::balance($transactions, $today->subDays(30));
        $bnpl = Ledger::ofCategory(Ledger::between($transactions, $today->subDays(60), $today), TransactionCategory::Bnpl)->isNotEmpty();
        $shortfall = collect($predictions)->contains(fn (PredictionData $p) => in_array($p->ruleKey, self::SHORTFALL_RULES, true));

        if ($declining && $bnpl && $shortfall) {
            return Mood::Paused;
        }

        return in_array($previous, [Mood::Paused, Mood::Relieved], true) ? Mood::Relieved : Mood::Neutral;
    }
}
