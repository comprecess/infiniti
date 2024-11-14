<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Resident\Invoices\Offer;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sys_quotes', function(Blueprint $table){
            $table->enum('stage', Offer::STAGE)->change();
        });

        Schema::table('sys_activity', function(Blueprint $table){
            $table->boolean('no_delete')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sys_activity', function(Blueprint $table){
            $table->dropColumn('no_delete');
        });
    }
};
