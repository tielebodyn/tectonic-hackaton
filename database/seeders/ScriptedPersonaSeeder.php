<?php

namespace Database\Seeders;

use App\Enums\LifeStage;
use App\Enums\TransactionCategory;
use App\Models\Customer;
use App\Models\User;
use App\Services\Doppel\ScriptedPersonas;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/** Seeds the extra demo personas from database/data/personas/*.json (diary is scripted, not rule-based). */
class ScriptedPersonaSeeder extends Seeder
{
    public function run(): void
    {
        $today = Carbon::parse(config('doppel.today'))->startOfDay();

        foreach (ScriptedPersonas::all() as $script) {
            $user = User::query()->forceCreate([
                'name' => $script['display_name'],
                'email' => $script['persona_key'].'@doppel.test',
                'email_verified_at' => $today,
                'password' => Hash::make(Str::random(32)),
                'is_demo' => true,
            ]);

            $customer = Customer::query()->forceCreate([
                'user_id' => $user->id,
                'persona_key' => $script['persona_key'],
                'display_name' => $script['display_name'],
                'age' => $script['age'],
                'city' => $script['city'],
                'life_stage' => LifeStage::from($script['life_stage']),
                'persona_summary' => $script['persona_summary'],
                'diary_opener' => $script['diary_opener'],
            ]);

            $rows = collect($script['transactions'])->map(fn (array $t) => [
                'booked_on' => $today->copy()->subDays((int) $t['days_ago']),
                'amount_cents' => (int) $t['amount_cents'],
                'counterparty' => $t['counterparty'],
                'category' => TransactionCategory::tryFrom($t['category']) ?? TransactionCategory::Other,
                'description' => $t['description'] ?? null,
                'is_simulated' => false,
            ]);

            $customer->transactions()->create([
                'booked_on' => $today->copy()->subDays(90),
                'amount_cents' => (int) $script['balance_cents'] - $rows->sum('amount_cents'),
                'counterparty' => 'Beginsaldo',
                'category' => TransactionCategory::Other,
                'description' => 'Balance at the start of the period',
                'is_simulated' => false,
            ]);
            $customer->transactions()->createMany($rows->all());
        }
    }
}
