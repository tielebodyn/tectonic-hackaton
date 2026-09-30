<?php

namespace App\Models;

use App\Enums\LifeStage;
use App\Enums\Mood;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id', 'persona_key', 'display_name', 'age', 'city', 'life_stage', 'mood',
    'persona_summary', 'diary_opener',
])]
class Customer extends Model
{
    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'life_stage' => LifeStage::class,
            'mood' => Mood::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function predictions(): HasMany
    {
        return $this->hasMany(Prediction::class);
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    /** Sum of all transactions booked up to and including config('doppel.today'). */
    public function balanceCents(): int
    {
        return (int) $this->transactions()
            ->whereDate('booked_on', '<=', config('doppel.today'))
            ->sum('amount_cents');
    }

    protected function mascotVariant(): Attribute
    {
        return Attribute::get(fn () => $this->life_stage?->mascotVariant());
    }
}
