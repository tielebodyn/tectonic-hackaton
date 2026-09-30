<?php

namespace App\Enums;

enum ActionKind: string
{
    case Kbc = 'kbc';
    case Partner = 'partner';
    case NoSale = 'no_sale';
    case Human = 'human';
}
