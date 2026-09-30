<?php

namespace App\Enums;

enum LifeStage: string
{
    case Starter = 'starter';
    case Moving = 'moving';
    case SelfEmployed = 'self_employed';

    public function mascotVariant(): string
    {
        return match ($this) {
            self::Starter => 'backpack',
            self::Moving => 'box',
            self::SelfEmployed => 'laptop',
        };
    }
}
