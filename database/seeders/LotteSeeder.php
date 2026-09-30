<?php

namespace Database\Seeders;

use App\Enums\LifeStage;
use App\Enums\TransactionCategory as C;

class LotteSeeder extends PersonaSeeder
{
    public function run(): void
    {
        // Student job income until her first real salary.
        $this->tx($this->day(2, 5), 380.00, 'Delhaize Gent', C::Income, 'Studentenjob juli');
        $this->tx($this->day(1, 5), 380.00, 'Delhaize Gent', C::Income, 'Studentenjob augustus');
        $this->tx($this->day(1, 25), 2050.00, 'Accenture', C::Income, 'Loon augustus');
        $this->tx($this->day(0, 25), 2050.00, 'Accenture', C::Income, 'Loon september');

        // Student room in July, own studio from August.
        $this->tx($this->day(2, 3), -420.00, 'Kotbaas Overpoort', C::Rent, 'Kothuur juli');
        $this->tx($this->day(1, 1), -650.00, 'Immo Gentse Kaaien', C::Rent, 'Huur studio augustus');
        $this->tx($this->day(0, 1), -650.00, 'Immo Gentse Kaaien', C::Rent, 'Huur studio september');

        $this->monthly(7, -5.99, 'Spotify', C::Subscription, 'Spotify Premium Student');
        $this->monthly(16, -6.99, 'Netflix', C::Subscription, 'Netflix studententarief');
        $this->monthly(12, -35.00, 'Proximus', C::Utilities, 'Mobiel abonnement');
        $this->monthly(20, -60.00, 'NMBS', C::Other, 'Treinabonnement');

        $this->weekly(6, [-42.30, -55.10, -38.75, -61.20], 'Colruyt Gent', C::Groceries);

        // Setting up her first place and spending the first salary.
        $this->tx($this->day(2, 8), -289.00, 'Pukkelpop', C::Other, 'Festivalticket');
        $this->tx($this->day(1, 2), -245.00, 'IKEA Gent', C::Other, 'Bed en kast studio');
        $this->tx($this->day(1, 28), -214.00, 'Ryanair', C::Other, 'Citytrip Barcelona');
        $this->tx($this->day(0, 26), -899.00, 'MediaMarkt Gent', C::Other, 'Laptop');
        $this->tx($this->day(0, 27), -136.40, 'Zara', C::Other);
        $this->tx($this->day(0, 28), -79.99, 'Bol.com', C::Other);
        $this->tx($this->day(1, 29), -165.00, 'Zalando', C::Other);
        $this->tx($this->day(1, 30), -24.00, 'Kinepolis Gent', C::Other);
        $this->monthly(26, -29.99, 'Basic-Fit', C::Other, 'Fitnessabonnement');
        $this->tx($this->day(0, 26), -600.00, 'M. en P. De Smet', C::Other, 'Terugbetaling ouders');
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
            'persona_summary' => 'Lotte (24) woont in Gent en heeft net haar eerste job bij Accenture. Ze huurt een studio van €650, heeft nog studentenabonnementen en nog geen spaarbuffer.',
            'diary_opener' => 'Hey Lotte, ik heb je komende maand al geleefd. Volgende week verloor ik mijn studentenkorting.',
        ], 900.00);
    }
}
