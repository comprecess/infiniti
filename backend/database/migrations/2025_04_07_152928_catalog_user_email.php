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
        Schema::table('catalog_user', function (Blueprint $table){
            $table->string('email')->nullable()->after('name');
        });

        Schema::create('catalog_user_employment', function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_catalog_user');
            $table->nullableMorphs('model');
            $table->dateTime('from');
            $table->dateTime('to');

            $table->foreign('id_catalog_user')->references('id')->on('catalog_user')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_user', function (Blueprint $table){
            $table->dropColumn('email');
        });

        Schema::table('catalog_user_employment', function (Blueprint $table){
            $table->dropForeign(['id_catalog_user']);
        });

        Schema::dropIfExists('catalog_user_employment');
    }
};
