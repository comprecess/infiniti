<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('catalog_prop', function(Blueprint $table){
            $table->dropColumn('type');
        });

        Schema::table('catalog_prop', function(Blueprint $table){
            $table->enum('type',\App\Models\Catalog\Prop::TYPE)->nullable();
            $table->smallInteger('filter')->nullable()->change();
            $table->smallInteger('sort')->nullable();
            $table->json('options')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_prop', function(Blueprint $table){
            $table->dropColumn('options');
            $table->dropColumn('sort');
        });
    }
};
