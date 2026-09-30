<?php

namespace App\Services\Doppel\Rules;

use App\Enums\TransactionCategory;
use App\Models\Transaction;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Plain math over a customer's transactions, shared by the rules.
 * Everything works on an in-memory collection so scenario transforms can add virtual rows.
 */
class Ledger
{
    public const ENERGY_KEYWORDS = ['engie', 'luminus', 'totalenergies', 'eneco', 'mega', 'bolt', 'octa', 'energie'];

    public const MOBILE_KEYWORDS = ['proximus', 'orange', 'telenet', 'base', 'mobile', 'gsm', 'mobiel'];

    public const FIXED_TARIFF_MARKER = 'vast tarief';

    public static function today(): CarbonImmutable
    {
        return CarbonImmutable::parse(config('doppel.today', '2026-09-30'))->startOfDay();
    }

    /** Balance = sum of everything booked on or before the given day. */
    public static function balance(Collection $tx, CarbonImmutable $on): int
    {
        return (int) $tx->filter(fn (Transaction $t) => $t->booked_on->lte($on))->sum('amount_cents');
    }

    public static function is(Transaction $t, TransactionCategory ...$categories): bool
    {
        return in_array($t->category, $categories, true);
    }

    public static function ofCategory(Collection $tx, TransactionCategory ...$categories): Collection
    {
        return $tx->filter(fn (Transaction $t) => self::is($t, ...$categories))->values();
    }

    /** @param  list<string>  $keywords */
    public static function mentions(Transaction $t, array $keywords): bool
    {
        $haystack = mb_strtolower(($t->counterparty ?? '').' '.($t->description ?? ''));

        foreach ($keywords as $keyword) {
            if (str_contains($haystack, $keyword)) {
                return true;
            }
        }

        return false;
    }

    public static function between(Collection $tx, CarbonImmutable $from, CarbonImmutable $to): Collection
    {
        return $tx->filter(fn (Transaction $t) => $t->booked_on->gt($from) && $t->booked_on->lte($to))->values();
    }

    public static function isEnergy(Transaction $t): bool
    {
        return self::is($t, TransactionCategory::Utilities) && self::mentions($t, self::ENERGY_KEYWORDS);
    }

    /** Income without the opening-balance row the seeders use. */
    public static function income(Collection $tx): Collection
    {
        return $tx->filter(fn (Transaction $t) => self::is($t, TransactionCategory::Income)
            && $t->amount_cents > 0
            && ! self::mentions($t, ['beginsaldo']))->values();
    }

    /** Money spent in the 30 days up to today, savings not counted as spending. */
    public static function monthlySpending(Collection $tx, CarbonImmutable $today): int
    {
        return (int) abs(self::between($tx, $today->subDays(30), $today)
            ->filter(fn (Transaction $t) => $t->amount_cents < 0 && ! self::is($t, TransactionCategory::Savings))
            ->sum('amount_cents'));
    }

    /** The first real salary (student jobs don't count) if it arrived in the last 45 days. */
    public static function firstSalary(Collection $tx, CarbonImmutable $today): ?Transaction
    {
        $first = self::income($tx)
            ->filter(fn (Transaction $t) => $t->booked_on->lte($today) && ! self::mentions($t, ['student']))
            ->sortBy('booked_on')
            ->first();

        return $first && $first->booked_on->gte($today->subDays(45)) ? $first : null;
    }

    /**
     * Fixed monthly outflows: same counterparty in 2+ of the last 3 months with a stable amount.
     * Groceries, tax and bnpl are never "fixed", even when they repeat.
     *
     * @return Collection<int, array{counterparty: string, category: TransactionCategory, amount_cents: int, day: int}>
     */
    public static function recurringOutflows(Collection $tx, CarbonImmutable $today): Collection
    {
        return self::between($tx, $today->subMonthsNoOverflow(3), $today)
            ->filter(fn (Transaction $t) => $t->amount_cents < 0
                && ! self::is($t, TransactionCategory::Groceries, TransactionCategory::Tax, TransactionCategory::Bnpl))
            ->groupBy(fn (Transaction $t) => mb_strtolower($t->counterparty ?? ''))
            ->filter(function (Collection $group) {
                $months = $group->map(fn (Transaction $t) => $t->booked_on->format('Y-m'))->unique()->count();
                $amounts = $group->map(fn (Transaction $t) => abs($t->amount_cents));

                return $months >= 2 && $amounts->max() <= $amounts->min() * 1.1;
            })
            ->map(function (Collection $group) {
                $last = $group->sortBy('booked_on')->last();

                return [
                    'counterparty' => $last->counterparty,
                    'category' => $last->category,
                    'amount_cents' => abs($last->amount_cents),
                    'day' => $last->booked_on->day,
                ];
            })
            ->values();
    }

    /**
     * Outflows expected in (from, to]: fixed monthly payments projected forward, plus anything
     * already booked in the future that is not one of those fixed payments.
     *
     * @return Collection<int, array{counterparty: string, amount_cents: int, on: CarbonImmutable}>
     */
    public static function projectedOutflows(Collection $tx, CarbonImmutable $from, CarbonImmutable $to): Collection
    {
        $recurring = self::recurringOutflows($tx, $from);
        $recurringNames = $recurring->map(fn (array $r) => mb_strtolower($r['counterparty'] ?? ''))->all();

        $projected = $recurring->map(fn (array $r) => [
            'counterparty' => $r['counterparty'],
            'amount_cents' => $r['amount_cents'],
            'on' => self::nextOccurrence($r['day'], $from),
        ])->filter(fn (array $r) => $r['on']->lte($to));

        $scheduled = self::between($tx, $from, $to)
            ->filter(fn (Transaction $t) => $t->amount_cents < 0
                && ! in_array(mb_strtolower($t->counterparty ?? ''), $recurringNames, true))
            ->map(fn (Transaction $t) => [
                'counterparty' => $t->counterparty,
                'amount_cents' => abs($t->amount_cents),
                'on' => $t->booked_on,
            ]);

        return $projected->concat($scheduled)->values();
    }

    /** First date after $after that falls on the given day of the month. */
    public static function nextOccurrence(int $day, CarbonImmutable $after): CarbonImmutable
    {
        $candidate = $after->startOfMonth()->addDays(min($day, $after->daysInMonth) - 1);

        if ($candidate->lte($after)) {
            $next = $after->startOfMonth()->addMonthNoOverflow();
            $candidate = $next->addDays(min($day, $next->daysInMonth) - 1);
        }

        return $candidate;
    }

    public static function euro(int $cents): string
    {
        $cents = abs($cents);

        return '€'.number_format($cents / 100, $cents % 100 === 0 ? 0 : 2, ',', '.');
    }

    public static function date(CarbonImmutable $date): string
    {
        return $date->locale('nl')->translatedFormat('j F');
    }
}
