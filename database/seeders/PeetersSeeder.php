<?php

namespace Database\Seeders;

use App\Enums\LifeStage;
use App\Enums\TransactionCategory as C;

class PeetersSeeder extends PersonaSeeder
{
    public function run(): void
    {
        $this->monthly(25, 2480.00, 'Stad Gent', C::Income, 'Loon Jonas Peeters');
        $this->monthly(25, 1940.00, 'AZ Sint-Lucas', C::Income, 'Loon Sarah Peeters');

        // Old apartment (energy included in rent) until the move mid September.
        $this->tx($this->day(1, 1), -1050.00, 'Immo Dampoort', C::Rent, 'Huur appartement augustus');
        $this->tx($this->day(0, 1), -1050.00, 'Immo Dampoort', C::Rent, 'Huur appartement september');
        $this->monthly(5, -420.00, 'Kinderdagverblijf Bengeltje', C::Other, 'Kinderopvang');

        // The move.
        $this->tx($this->day(0, 2), -2400.00, 'KBC Huurwaarborg', C::Moving, 'Huurwaarborg nieuwe woning');
        $this->tx($this->day(0, 10), -235.40, 'Brico Gent', C::Moving, 'Verf en materiaal');
        $this->tx($this->day(0, 12), -890.00, 'Verhuisfirma Snel', C::Moving, 'Verhuis Dampoort naar Sint-Amandsberg');
        $this->tx($this->day(0, 14), -1300.00, 'IKEA Gent', C::Moving, 'Keuken en kinderkamer');
        $this->tx($this->day(0, 27), -649.00, 'Coolblue', C::Other, 'Wasmachine');
        $this->tx($this->day(0, 26), -499.00, 'Vanden Borre', C::Other, 'Koelkast');
        $this->tx($this->day(0, 29), -389.00, 'Leen Bakker', C::Other, 'Gordijnen');
        $this->tx($this->day(0, 20), -186.00, 'Engie', C::Utilities, 'Eerste voorschot nieuw energiecontract');

        $this->weekly(6, [-118.40, -126.75, -109.90, -131.20], 'Delhaize Gent', C::Groceries);
        $this->weekly(3, [-23.80, -26.45], 'Kruidvat', C::Groceries, 'Luiers en verzorging');
        $this->weekly(1, [0, -64.50], 'Q8 Sint-Amandsberg', C::Other, 'Brandstof');

        $this->tx($this->day(2, 10), -1640.00, 'TUI', C::Other, 'Zomervakantie Portugal');
        $this->tx($this->day(2, 22), -349.00, 'Dreambaby', C::Other, 'Autostoel en buggy');

        $this->persist([
            'persona_key' => 'peeters',
            'display_name' => 'Jonas & Sarah Peeters',
            'age' => 34,
            'city' => 'Gent',
            'life_stage' => LifeStage::Moving,
            'persona_summary' => 'Jonas (34) en Sarah (33) Peeters verhuizen met hun peuter binnen Gent. Ze betaalden een huurwaarborg, een verhuisfirma en een nieuwe keuken, en hebben net een nieuw Engie-contract. Voor de nieuwe woning loopt nog geen verzekering.',
            'diary_opener' => 'Hey Jonas en Sarah, ik heb jullie komende maand al geleefd. Mijn eerste winter in het nieuwe huis werd duurder dan gedacht, en toen bleek mijn inboedel nergens verzekerd.',
        ], 3100.00);
    }
}
