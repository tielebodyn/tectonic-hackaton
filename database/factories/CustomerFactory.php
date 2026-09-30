<?php

namespace Database\Factories;

use App\Enums\LifeStage;
use App\Enums\Mood;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Anonymous bulk customers (no user, no persona) for the scale demo.
 *
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = fake('nl_BE');

        return [
            'user_id' => null,
            'persona_key' => null,
            'display_name' => $faker->name(),
            'age' => $faker->numberBetween(18, 80),
            'city' => $faker->randomElement(['Gent', 'Antwerpen', 'Brussel', 'Leuven', 'Brugge', 'Hasselt', 'Mechelen', 'Kortrijk', 'Aalst', 'Genk']),
            'life_stage' => $faker->randomElement(LifeStage::cases())->value,
            'mood' => Mood::Neutral->value,
            'persona_summary' => null,
            'diary_opener' => null,
        ];
    }
}
