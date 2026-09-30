<?php

namespace Database\Seeders;

use App\Enums\LifeStage;
use App\Enums\TransactionCategory as C;

/**
 * Karim's numbers are part of the shared contract: balance on today €1.450, €650 of
 * recurring outflows between today and the 20th (tax excluded), VAT €1.700 on the 20th.
 */
class KarimSeeder extends PersonaSeeder
{
    public function run(): void
    {
        // Big client stopped paying two months ago; smaller clients keep paying.
        $this->tx($this->day(2, 3), 3200.00, 'Studio Noord', C::Income, 'Factuur 2026-061');
        $this->tx($this->day(2, 30), 3200.00, 'Studio Noord', C::Income, 'Factuur 2026-068');
        $this->monthly(15, 650.00, 'Bakkerij Verhaeghe', C::Income, 'Factuur webdesign onderhoud');
        $this->monthly(22, 420.00, 'Fietsen Claes', C::Income, 'Factuur webshop support');

        $this->tx($this->day(2, 20), -1700.00, 'FOD Financiën', C::Tax, 'BTW Q2');

        // Recurring fixed outflows, all on day 1-20: exactly 650,00 per month.
        $this->monthly(3, -38.50, 'Farys', C::Utilities, 'Water');
        $this->monthly(5, -350.00, 'KBC Autolening', C::Other, 'Aflossing bestelwagen');
        $this->monthly(7, -156.50, 'Xerius', C::Other, 'Sociale bijdragen zelfstandige');
        $this->monthly(10, -24.19, 'Adobe', C::Subscription, 'Creative Cloud');
        $this->monthly(12, -11.99, 'Canva', C::Subscription, 'Canva Pro');
        $this->monthly(14, -68.82, 'Ethias', C::Insurance, 'Beroepsaansprakelijkheid');
        // Variable spend (groceries, fuel with varying amounts) is not projected as recurring.
        $this->monthly(4, -61.35, 'Colruyt Gent', C::Groceries);
        $this->monthly(11, -48.20, 'Delhaize Gent', C::Groceries);
        foreach ([[2, 17, -71.20], [1, 16, -38.40], [0, 17, -54.85]] as [$monthsAgo, $day, $euros]) {
            $this->tx($this->day($monthsAgo, $day), $euros, 'Q8 Gentbrugge', C::Other, 'Brandstof');
        }
        // Outside the window.
        $this->monthly(24, -72.40, 'Colruyt Gent', C::Groceries);
        $this->monthly(28, -850.00, 'Immo Van Laere', C::Rent, 'Huur');

        $this->tx($this->day(2, 14), -1399.00, 'Coolblue', C::Other, 'Laptop');
        $this->tx($this->day(1, 8), -980.00, 'Airbnb', C::Other, 'Vakantie');
        $this->tx($this->day(1, 19), -1150.00, 'Garage Van Damme', C::Other, 'Onderhoud bestelwagen');
        $this->tx($this->today()->subDays(5), -89.97, 'Klarna', C::Bnpl, 'Eerste termijn bureaustoel');

        $this->persist([
            'persona_key' => 'karim',
            'display_name' => 'Karim',
            'age' => 47,
            'city' => 'Gent',
            'life_stage' => LifeStage::SelfEmployed,
            'persona_summary' => 'Karim (47) is zelfstandig webdesigner in Gent. Zijn grootste klant Studio Noord betaalt al twee maanden niet meer, zijn saldo daalt en hij deed onlangs zijn eerste betaling in schijven. Op 20 oktober moet hij €1.700 btw betalen.',
            'diary_opener' => 'Hey Karim, ik heb je komende maand al geleefd. Op 20 oktober kwam ik €900 tekort voor mijn btw.',
        ], 1450.00);
    }
}
