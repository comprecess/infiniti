<?php


namespace App\Models\Traits;


use App\Models\Catalog\User;

trait CatalogUserTeamTrait
{
    public function teams()
    {
        return $this->morphToMany(related: User::class, name:'model', table:'catalog_team', relatedPivotKey: 'catalog_user_id');
    }
}
