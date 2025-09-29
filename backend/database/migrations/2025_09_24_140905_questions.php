<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Resident\Question;

return new class extends Migration
{
    const FIELD = ['string','checkbox', 'radiobox', 'boolean'];
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questions', function(Blueprint $table){
            $table->id();
            $table->enum('type', Question::TYPE)->default(Question::TYPE[0]);
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('key_lang')->nullable();
            $table->string('lang')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->integer('position')->default(0);
            $table->enum('field', self::FIELD)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('questions');
    }
};
