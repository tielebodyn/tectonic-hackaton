<?php

namespace Database\Seeders;

use App\Enums\TransactionCategory;
use App\Models\Customer;
use Carbon\CarbonInterface;
use Database\Factories\CustomerFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Scale demo: 10,000 anonymous customers with a few transactions each.
 * Not called by DatabaseSeeder. Run: ddev artisan db:seed --class=BatchCustomerSeeder
 */
class BatchCustomerSeeder extends Seeder
{
    private const TOTAL = 10_000;

    private const CHUNK = 1_000;

    public function run(): void
    {
        $today = Carbon::parse(config('doppel.today'))->startOfDay();
        $faker = fake('nl_BE');
        $now = now();

        for ($done = 0; $done < self::TOTAL; $done += self::CHUNK) {
            $lastId = (int) Customer::query()->max('id');

            $customers = CustomerFactory::new()->count(self::CHUNK)->raw();
            DB::table('customers')->insert(array_map(fn (array $c) => [...$c, 'created_at' => $now, 'updated_at' => $now], $customers));

            $transactions = [];
            foreach (Customer::query()->where('id', '>', $lastId)->pluck('id') as $customerId) {
                $transactions[] = $this->row($customerId, $today->copy()->subDays(90), $faker->numberBetween(50_000, 500_000), 'Beginsaldo', TransactionCategory::Other, $now);
                $transactions[] = $this->row($customerId, $today->copy()->subDays($faker->numberBetween(0, 30)), $faker->numberBetween(150_000, 400_000), $faker->company(), TransactionCategory::Income, $now);
                $transactions[] = $this->row($customerId, $today->copy()->subDays($faker->numberBetween(0, 30)), -$faker->numberBetween(50_000, 120_000), 'Rent', TransactionCategory::Rent, $now);
                foreach (range(1, $faker->numberBetween(1, 4)) as $ignored) {
                    $transactions[] = $this->row($customerId, $today->copy()->subDays($faker->numberBetween(0, 90)), -$faker->numberBetween(1_000, 15_000), $faker->randomElement(['Colruyt', 'Delhaize', 'Aldi', 'Lidl', 'Carrefour']), TransactionCategory::Groceries, $now);
                }
            }

            foreach (array_chunk($transactions, self::CHUNK) as $chunk) {
                DB::table('transactions')->insert($chunk);
            }

            $this->command?->info('Seeded '.($done + self::CHUNK).' / '.self::TOTAL.' customers');
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function row(int $customerId, Carbon $bookedOn, int $amountCents, string $counterparty, TransactionCategory $category, CarbonInterface $now): array
    {
        return [
            'customer_id' => $customerId,
            'booked_on' => $bookedOn->toDateString(),
            'amount_cents' => $amountCents,
            'counterparty' => $counterparty,
            'category' => $category->value,
            'description' => null,
            'is_simulated' => false,
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
