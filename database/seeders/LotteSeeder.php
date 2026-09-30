<?php

namespace Database\Seeders;

use App\Enums\LifeStage;
use App\Enums\TransactionCategory as C;

class LotteSeeder extends PersonaSeeder
{
    public function run(): void
    {
        // Student job income until her first real salary.
        $this->tx($this->day(2, 5), 380.00, 'Delhaize Gent', C::Income, 'Student job July');
        $this->tx($this->day(1, 5), 380.00, 'Delhaize Gent', C::Income, 'Student job August');
        $this->tx($this->day(1, 25), 2050.00, 'Accenture', C::Income, 'Salary August');
        $this->tx($this->day(0, 25), 2050.00, 'Accenture', C::Income, 'Salary September');

        // Student room in July, own studio from August.
        $this->tx($this->day(2, 3), -420.00, 'Kotbaas Overpoort', C::Rent, 'Student room rent July');
        $this->tx($this->day(1, 1), -650.00, 'Immo Gentse Kaaien', C::Rent, 'Studio rent August');
        $this->tx($this->day(0, 1), -650.00, 'Immo Gentse Kaaien', C::Rent, 'Studio rent September');

        $this->monthly(7, -5.99, 'Spotify', C::Subscription, 'Spotify Premium Student');
        $this->monthly(16, -6.99, 'Netflix', C::Subscription, 'Netflix student plan');
        $this->monthly(12, -35.00, 'Proximus', C::Utilities, 'Mobile plan');
        $this->monthly(20, -60.00, 'NMBS', C::Other, 'Train pass');

        $this->weekly(6, [-42.30, -55.10, -38.75, -61.20], 'Colruyt Gent', C::Groceries);

        // Setting up her first place and spending the first salary.
        $this->tx($this->day(2, 8), -289.00, 'Pukkelpop', C::Other, 'Festivalticket');
        $this->tx($this->day(1, 2), -245.00, 'IKEA Gent', C::Other, 'Bed and wardrobe for the studio');
        $this->tx($this->day(1, 28), -214.00, 'Ryanair', C::Other, 'Citytrip Barcelona');
        $this->tx($this->day(0, 26), -899.00, 'MediaMarkt Gent', C::Other, 'Laptop');
        $this->tx($this->day(0, 27), -136.40, 'Zara', C::Other);
        $this->tx($this->day(0, 28), -79.99, 'Bol.com', C::Other);
        $this->tx($this->day(1, 29), -165.00, 'Zalando', C::Other);
        $this->tx($this->day(1, 30), -24.00, 'Kinepolis Gent', C::Other);
        $this->monthly(26, -29.99, 'Basic-Fit', C::Other, 'Gym membership');
        $this->tx($this->day(0, 26), -600.00, 'M. & P. De Smet', C::Other, 'Paying back parents');
        $this->tx($this->day(0, 27), -120.00, 'Decathlon Gent', C::Other);
        foreach ([[1, 9], [1, 23], [0, 4], [0, 14], [0, 19], [0, 27]] as $i => [$monthsAgo, $day]) {
            $this->tx($this->day($monthsAgo, $day), [-24.50, -18.90, -31.20, -22.40, -27.80, -19.60][$i], 'Uber Eats', C::Other);
        }

        $this->persist([
            'persona_key' => 'lotte',
            'display_name' => 'Lotte',
            'age' => 24,
            'city' => 'Gent',
            'life_stage' => LifeStage::Starter,
            'persona_summary' => 'Lotte (24) lives in Gent and just started her first job at Accenture. She rents a €650 studio, still has student subscriptions and no savings buffer yet.',
            'diary_opener' => 'Hey Lotte, I\'ve already lived your next month. On 7 October I lost my student discount.',
        ], 900.00);
    }
}
