<?php

namespace Database\Seeders;

use App\Enums\LifeStage;
use App\Enums\TransactionCategory as C;

class PeetersSeeder extends PersonaSeeder
{
    public function run(): void
    {
        $this->monthly(25, 2480.00, 'Stad Gent', C::Income, 'Salary Jonas Peeters');
        $this->monthly(25, 1940.00, 'AZ Sint-Lucas', C::Income, 'Salary Sarah Peeters');

        // Old apartment (energy included in rent) until the move mid September.
        $this->tx($this->day(1, 1), -1050.00, 'Immo Dampoort', C::Rent, 'Apartment rent August');
        $this->tx($this->day(0, 1), -1050.00, 'Immo Dampoort', C::Rent, 'Apartment rent September');
        $this->monthly(5, -420.00, 'Kinderdagverblijf Bengeltje', C::Other, 'Childcare');

        // The move.
        $this->tx($this->day(0, 2), -2400.00, 'KBC Rental Deposit', C::Moving, 'Rental deposit new home');
        $this->tx($this->day(0, 10), -235.40, 'Brico Gent', C::Moving, 'Paint and supplies');
        $this->tx($this->day(0, 12), -890.00, 'Verhuisfirma Snel', C::Moving, 'Move from Dampoort to Sint-Amandsberg');
        $this->tx($this->day(0, 14), -1300.00, 'IKEA Gent', C::Moving, 'Kitchen and nursery');
        $this->tx($this->day(0, 27), -649.00, 'Coolblue', C::Other, 'Washing machine');
        $this->tx($this->day(0, 26), -499.00, 'Vanden Borre', C::Other, 'Fridge');
        $this->tx($this->day(0, 29), -389.00, 'Leen Bakker', C::Other, 'Curtains');
        $this->tx($this->day(0, 20), -186.00, 'Engie', C::Utilities, 'First advance, new energy contract');

        $this->weekly(6, [-118.40, -126.75, -109.90, -131.20], 'Delhaize Gent', C::Groceries);
        $this->weekly(3, [-23.80, -26.45], 'Kruidvat', C::Groceries, 'Nappies and care products');
        $this->weekly(1, [0, -64.50], 'Q8 Sint-Amandsberg', C::Other, 'Fuel');

        $this->tx($this->day(2, 10), -1640.00, 'TUI', C::Other, 'Summer holiday Portugal');
        $this->tx($this->day(2, 22), -349.00, 'Dreambaby', C::Other, 'Car seat and pushchair');

        $this->persist([
            'persona_key' => 'peeters',
            'display_name' => 'Jonas & Sarah Peeters',
            'age' => 34,
            'city' => 'Gent',
            'life_stage' => LifeStage::Moving,
            'persona_summary' => 'Jonas (34) and Sarah (33) Peeters are moving within Gent with their toddler. They paid a rental deposit, a removal company and a new kitchen, and just signed a new Engie contract. The new home is not insured yet.',
            'diary_opener' => 'Hey Jonas and Sarah, I\'ve already lived your next month. The new home turned out not to be insured yet, and the first winter cost more than expected.',
        ], 3100.00);
    }
}
