<?php

namespace Database\Seeders;

use App\Enums\LifeStage;
use App\Enums\TransactionCategory;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Shared helpers for the three deterministic demo personas.
 * Subclasses queue transactions with tx()/monthly() and call persist().
 */
abstract class PersonaSeeder extends Seeder
{
    /** @var array<int, array<string, mixed>> */
    private array $rows = [];

    protected function today(): Carbon
    {
        return Carbon::parse(config('doppel.today'))->startOfDay();
    }

    /** First day of the ~90 day history window. */
    protected function start(): Carbon
    {
        return $this->today()->subDays(90);
    }

    /** Date in a month relative to today: monthsAgo 0 = this month. */
    protected function day(int $monthsAgo, int $day): Carbon
    {
        $month = $this->today()->startOfMonth()->subMonthsNoOverflow($monthsAgo);

        return $month->setDay(min($day, $month->daysInMonth));
    }

    protected function tx(Carbon $date, float $euros, string $counterparty, TransactionCategory $category, ?string $description = null): void
    {
        $this->rows[] = [
            'booked_on' => $date->copy(),
            'amount_cents' => (int) round($euros * 100),
            'counterparty' => $counterparty,
            'category' => $category,
            'description' => $description,
            'is_simulated' => false,
        ];
    }

    /** Same transaction on the same day of every month inside the window. */
    protected function monthly(int $day, float $euros, string $counterparty, TransactionCategory $category, ?string $description = null): void
    {
        for ($monthsAgo = 3; $monthsAgo >= 0; $monthsAgo--) {
            $date = $this->day($monthsAgo, $day);
            if ($date->gt($this->start()) && $date->lte($this->today())) {
                $this->tx($date, $euros, $counterparty, $category, $description);
            }
        }
    }

    /** Weekly transaction on a fixed weekday, cycling through the amounts (0 = skip that week). */
    protected function weekly(int $dayOfWeek, array $amounts, string $counterparty, TransactionCategory $category, ?string $description = null): void
    {
        $date = $this->start()->next($dayOfWeek);
        $i = 0;
        while ($date->lte($this->today())) {
            $amount = $amounts[$i % count($amounts)];
            if ($amount != 0) {
                $this->tx($date, $amount, $counterparty, $category, $description);
            }
            $date = $date->copy()->addWeek();
            $i++;
        }
    }

    /**
     * @param  array{persona_key: string, display_name: string, age: int, city: string, life_stage: LifeStage, persona_summary: string, diary_opener: string}  $attributes
     */
    protected function persist(array $attributes, float $targetBalanceEuros): Customer
    {
        $user = User::query()->forceCreate([
            'name' => $attributes['display_name'],
            'email' => $attributes['persona_key'].'@doppel.test',
            'email_verified_at' => $this->today(),
            'password' => Hash::make(Str::random(32)),
            'is_demo' => true,
        ]);

        $customer = Customer::query()->forceCreate([...$attributes, 'user_id' => $user->id]);

        $opening = (int) round($targetBalanceEuros * 100) - array_sum(array_column($this->rows, 'amount_cents'));

        $customer->transactions()->create([
            'booked_on' => $this->start(),
            'amount_cents' => $opening,
            'counterparty' => 'Beginsaldo',
            'category' => TransactionCategory::Other,
            'description' => 'Balance at the start of the period',
            'is_simulated' => false,
        ]);

        usort($this->rows, fn (array $a, array $b) => $a['booked_on'] <=> $b['booked_on']);
        $customer->transactions()->createMany($this->rows);
        $this->rows = [];

        return $customer;
    }
}
