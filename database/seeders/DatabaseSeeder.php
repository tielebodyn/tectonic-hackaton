<?php

namespace Database\Seeders;

use App\Enums\Scenario;
use App\Models\Customer;
use App\Models\User;
use App\Services\Doppel\DoppelRefresher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Throwable;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            LotteSeeder::class,
            PeetersSeeder::class,
            KarimSeeder::class,
            ScriptedPersonaSeeder::class,
        ]);

        // Detection logic may not be merged yet; seeding must still pass without it.
        if (! class_exists(DoppelRefresher::class)) {
            $this->command?->warn('DoppelRefresher not found, skipping predictions.');

            return;
        }

        foreach (Customer::query()->whereNotNull('persona_key')->get() as $customer) {
            try {
                app(DoppelRefresher::class)->refresh($customer, Scenario::Base);
            } catch (Throwable $e) {
                $this->command?->warn("Refresh failed for {$customer->persona_key}: {$e->getMessage()}");
            }
        }
    }
}
