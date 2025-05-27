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
        'service_update' => 'json',
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

    public function notificationMessage($notification)
    {
        if($this->deleted_at) {
            return __("notification.delete.Meeting");
        } else {
            $tag = $this->responseFail() ? 'fail.' : '';
            $date = $this->date->setTimezone($this->timezone);
            $link = $this->getJson('data.join_url', '');

            return __("notification.{$tag}Meeting", ['date' => $date->toRfc2822String(), 'link' => $link]);
        }

    }

    public function notificationPushMessage($notification)
    {
        if($this->deleted_at) {
            return __("notification.push.delete.Meeting");
        }elseif ($this->service_update){
            return __("notification.push.update.Meeting");
        } else {
            return __("notification.push.create.Meeting");
        }
    }

    public function responseFail()
    {
        return !$this->service_response || !Arr::get($this->service_response ?? [], 'data.id', null);
    }

    public function getJson($data, $default = null, $name = 'service_response')
    {
        return Arr::get($this->{$name}, $data, $default);
    }
}
