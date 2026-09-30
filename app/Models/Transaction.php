<?php

namespace App\Models;

use App\Enums\TransactionCategory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['customer_id', 'booked_on', 'amount_cents', 'counterparty', 'category', 'description', 'is_simulated'])]
class Transaction extends Model
{
    protected function casts(): array
    {
        return [
            'booked_on' => 'immutable_date',
            'amount_cents' => 'integer',
            'category' => TransactionCategory::class,
            'is_simulated' => 'boolean',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
