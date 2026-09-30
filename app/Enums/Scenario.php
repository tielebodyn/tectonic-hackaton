<?php

namespace App\Enums;

enum Scenario: string
{
    case Base = 'base';
    case Save100 = 'save_100';
    case FixedEnergy = 'fixed_energy';
}
