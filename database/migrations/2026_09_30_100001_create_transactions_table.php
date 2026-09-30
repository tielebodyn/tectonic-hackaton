<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->date('booked_on');
            $table->integer('amount_cents');
            $table->string('counterparty');
            $table->string('category');
            $table->string('description')->nullable();
            $table->boolean('is_simulated')->default(false);
            $table->timestamps();

            $table->index(['customer_id', 'booked_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
