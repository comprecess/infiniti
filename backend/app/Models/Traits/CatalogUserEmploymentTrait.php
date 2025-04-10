<?php


namespace App\Models\Traits;


use App\Models\Catalog\UserEmployment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

trait CatalogUserEmploymentTrait
{
    public function userCatalogEmployment()
    {
        return $this->morphMany(UserEmployment::class, 'model');
    }

    public function userCatalogEmploymentToday()
    {
        $date = now();
        return $this->morphMany(UserEmployment::class, 'model')->where('from', '>', $date);
    }

    public function createUserEmployment(Model|Collection $catalogUsers,Carbon $from, Carbon $to)
    {
        if($catalogUsers instanceof Model) {
            $catalogUsers = collect([$catalogUsers]);
        }

        $catalogUsers->each(function($item) use($from, $to){
            $userEmployment = new UserEmployment();
            $userEmployment->id_catalog_user = $item->id;
            $userEmployment->from = $from;
            $userEmployment->to = $to;
            $userEmployment->model()->associate($this);
            $userEmployment->save();
        });

    }
}
