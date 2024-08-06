<?php

namespace Database\Seeders;

use App\Models\Resident\Client\Activity;
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
//        $this->delete();
    }

    protected function isHas()
    {
        $this->has->set('activityTime', !Schema::hasColumn('sys_activity', 'created_at'));
    }

    protected function create()
    {
        $this->has->is('activityTime', function(){
            Schema::table('sys_activity', function(Blueprint $table){
                $table->timestamps();
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
    }

    protected function delete()
    {
        $this->has->isCreated('activityTime', function(){
            Schema::table('sys_activity', function(Blueprint $table){
                $table->dropColumn('stime');
                $table->dropColumn('sdate');
            });
        });
    }
}
