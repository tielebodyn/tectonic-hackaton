<?php

namespace App\Services\Doppel\Rules;

use App\Models\Customer;
use App\Services\Doppel\Data\PredictionData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * One deterministic signal rule. No AI: every rule is plain PHP over the customer's
 * transactions, so the detector can run in batch for every customer.
 */
interface Rule
{
    public function key(): string;

    public function appliesTo(Customer $customer): bool;

    public function evaluate(Customer $customer, Collection $tx, CarbonImmutable $today): ?PredictionData;
}
