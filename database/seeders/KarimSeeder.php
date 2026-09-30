<?php

namespace Database\Seeders;

use App\Enums\LifeStage;
use App\Enums\TransactionCategory as C;

/**
 * Karim's numbers are part of the shared contract: balance on today €1,450, €650 of
 * recurring outflows between today and the 20th (tax excluded), VAT €1,700 on the 20th.
 */
class KarimSeeder extends PersonaSeeder
{
    public function run(): void
    {
        // Big client stopped paying two months ago; smaller clients keep paying.
        $this->tx($this->day(2, 3), 3200.00, 'Studio Noord', C::Income, 'Invoice 2026-061');
        $this->tx($this->day(2, 30), 3200.00, 'Studio Noord', C::Income, 'Invoice 2026-068');
        $this->monthly(15, 650.00, 'Bakkerij Verhaeghe', C::Income, 'Invoice web design maintenance');
        $this->monthly(22, 420.00, 'Fietsen Claes', C::Income, 'Invoice webshop support');

        $this->tx($this->day(2, 20), -1700.00, 'FOD Financiën', C::Tax, 'VAT Q2');

        // Recurring fixed outflows, all on day 1-20: exactly 650.00 per month.
        $this->monthly(3, -38.50, 'Farys', C::Utilities, 'Water');
        $this->monthly(5, -350.00, 'KBC Autolening', C::Other, 'Van loan repayment');
        $this->monthly(7, -156.50, 'Xerius', C::Other, 'Social contributions, self-employed');
        $this->monthly(10, -24.19, 'Adobe', C::Subscription, 'Creative Cloud');
        $this->monthly(12, -11.99, 'Canva', C::Subscription, 'Canva Pro');
        $this->monthly(14, -68.82, 'Ethias', C::Insurance, 'Professional liability');
        // Variable spend (groceries, fuel with varying amounts) is not projected as recurring.
        $this->monthly(4, -61.35, 'Colruyt Gent', C::Groceries);
        $this->monthly(11, -48.20, 'Delhaize Gent', C::Groceries);
        foreach ([[2, 17, -71.20], [1, 16, -38.40], [0, 17, -54.85]] as [$monthsAgo, $day, $euros]) {
            $this->tx($this->day($monthsAgo, $day), $euros, 'Q8 Gentbrugge', C::Other, 'Fuel');
        }
        // Outside the window.
        $this->monthly(24, -72.40, 'Colruyt Gent', C::Groceries);
        $this->monthly(28, -850.00, 'Immo Van Laere', C::Rent, 'Rent');

        $this->tx($this->day(2, 14), -1399.00, 'Coolblue', C::Other, 'Laptop');
        $this->tx($this->day(1, 8), -980.00, 'Airbnb', C::Other, 'Holiday');
        $this->tx($this->day(1, 19), -1150.00, 'Garage Van Damme', C::Other, 'Van maintenance');
        $this->tx($this->today()->subDays(5), -89.97, 'Klarna', C::Bnpl, 'First instalment desk chair');

        $this->persist([
            'persona_key' => 'karim',
            'display_name' => 'Karim',
            'age' => 47,
            'city' => 'Gent',
            'life_stage' => LifeStage::SelfEmployed,
            'persona_summary' => 'Karim (47) is a self-employed web designer in Gent. His biggest client, Studio Noord, has not paid for two months, his balance is dropping and he recently made his first buy-now-pay-later purchase. On 20 October he owes €1,700 in VAT.',
            'diary_opener' => 'Hey Karim, I\'ve already lived your next month. On 20 October I was €900 short for my VAT.',
        ], 1450.00);
    }
}
