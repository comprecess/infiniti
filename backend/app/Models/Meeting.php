<?php

namespace App\Models;

use App\Models\Traits\CatalogUserEmploymentTrait;
use App\Models\Traits\CatalogUserTeamTrait;
use App\Models\Traits\NotificationTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;

class Meeting extends Model
{
    use HasFactory, SoftDeletes, CatalogUserTeamTrait, CatalogUserEmploymentTrait, NotificationTrait;

    const TIME = 40;

    protected $casts = [
        'date' => 'datetime',
        'date_timezone' => 'datetime',
        'service_response' => 'json',
        'create_data' => 'json',
    ];

    public function model()
    {
        return $this->morphTo('meeting')->withTrashed();
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

    public function notificationData()
    {
        $date = $this->date->setTimezone($this->timezone);
        return ['date' => $date->toRfc2822String()];
    }

    public function responseFail()
    {
        return !$this->service_response || !Arr::get($this->service_response ?? [], 'data.id', null);
    }
}
