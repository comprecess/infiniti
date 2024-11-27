<?php

namespace Database\Seeders;

use App\Models\Resident\Client\Activity;
use App\Models\Resident\Settings\Currency;
use App\Models\Users\Client;
use Carbon\Carbon;
use Database\Seeders\normalization\Data;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Normalization extends Seeder
{
    protected $has = null;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->has = new Data();

        $this->isHas();
        $this->create();
        $this->update();
        $this->delete();
    }

    protected function isHas()
    {
        $this->has->set('activityTime', !Schema::hasColumn('sys_activity', 'created_at'));
        $this->has->set('clientCurrency', Schema::hasColumn('crm_accounts', 'currency'));
    }

    protected function create()
    {
        $this->has->is('activityTime', function(){
            Schema::table('sys_activity', function(Blueprint $table){
                $table->timestamps();
            });
        });

        $this->has->is('clientCurrency', function(){
            Schema::table('crm_accounts', function(Blueprint $table){
                $table->string('currency_iso_code')->after('balance')->nullable();
            });
        });
    }

    protected function update()
    {
        $this->has->is('activityTime', function(){
            Activity::all()->each(function($item){
                $item->created_at = $this->updated_at = Carbon::createFromTimestamp($item->stime);
                $item->save();
            });
        });

        $this->has->is('clientCurrency', function(){
            $currency = Currency::all();
            $default = Currency::getDefault();
            Client::withTrashed()->get()->each(function($item) use($currency, $default){
                $findCur = $currency->where('id', $item->currency)->first();
                $item->currency_iso_code = ($findCur ?? $default)->iso_code;
                $item->save();
            });
        });
    }

    protected function delete()
    {
        $this->has->is('activityTime', function(){
            Schema::table('sys_activity', function(Blueprint $table){
                $table->dropColumn('stime');
                $table->dropColumn('sdate');
            });
        });

        $this->has->is('clientCurrency', function(){
            Schema::table('crm_accounts', function(Blueprint $table){
                $table->dropColumn('currency');
            });
        });
    }
}
