<?php

namespace App\Models;

use App\Models\Traits\CatalogUserEmploymentTrait;
use App\Models\Traits\CatalogUserTeamTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meeting extends Model
{
    use HasFactory, SoftDeletes, CatalogUserTeamTrait, CatalogUserEmploymentTrait;

    const TIME = 40;

    protected $casts = [
        'date' => 'datetime',
        'date_timezone' => 'datetime',
        'service_response' => 'json',
        'create_data' => 'json',
    ];

    public function model()
    {
        return $this->morphTo('meeting');
    }

    public function owner()
    {
        return $this->morphTo('owner');
    }

    public function setUser()
    {
        $user = User::getAuth();
        $this->owner_type = $user::class;
        $this->owner_id = $user->id;
    }

    public function setModel($model)
    {
        $this->meeting_type = $model::class;
        $this->meeting_id = $model->id;
    }
}
