<?php

namespace App\Models;


use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Services\Push\Contracts\PushContract;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    const ACTIVE_HOUR = 24;

    protected $casts = [
        'date_active' => 'datetime',
        'data' => 'json',
    ];

    public function model()
    {
        return $this->morphTo('model');
    }

    public function modelTrashed()
    {
        return $this->morphTo('model')->withTrashed();
    }

    public function user()
    {
        return $this->morphTo('user');
    }

    public function setUser(Admin|Client $user)
    {
        $this->user_type = $user::class;
        $this->user_id = $user->id;
    }

    public function setModel($model)
    {
        $this->model_type = $model::class;
        $this->model_id = $model->id;
    }

    public function getMessage()
    {
        if($model = $this->modelTrashed) {
            $message = $model->getMessage($this);
            if($message !== null) {
                return $message;
            }
        }

        if($this->type) {
            return __('notification.type', $this->data ?? []);
        }

        if($this->message) {
            return $this->message;
        }
    }

    public function getPushMessage()
    {
        if($model = $this->modelTrashed) {
            $message = $model->getPushMessage($this);
            if($message !== null) {
                return $message;
            }
        }
    }

    public function getTitle()
    {
        if($this->model) {
            return $this->model->notificationGetTitle();
        }

        if($this->type) {
            return __('notification.title.type', $this->data ?? []);
        }

    }

    public function scopeMyActive($query)
    {
        $date = now();
        $dateViewed = now()->subHours(self::ACTIVE_HOUR);
        $query->selectRaw("*, IF((notifications.viewed = 0 OR notifications.updated_at > '".$dateViewed->format('Y-m-d H:i:s')."') OR notifications.date_active > '".$date->format('Y-m-d H:i:s')."', 0,1) AS typeSort")
            ->orderByRaw('typeSort asc, notifications.id desc');
    }

    public function isActive()
    {
        $date = now();
        $dateViewed = now()->subHours(self::ACTIVE_HOUR);
        return ($this->viewed == 0 || $this->updated_at > $dateViewed) || $this->date_active > $date;
    }

    public static function createMain(User $user, ?Model $model = null, ?Carbon $dateActive = null, $message = null, $type = null, ?array $data = null, bool $isPush = true)
    {
        $not = new Notification();
        $not->setUser($user);
        if($model) {
            $not->setModel($model);
        }
        $not->date_active = $dateActive;
        $not->message = $message;
        $not->type = $type;
        $not->data = $data;
        $not->save();

        if(($push = $user->push) && $isPush) {
            #Отправляем пушь уведомление
            self::sendPush($user, $not->getPushMessage());
        }

        return $not;
    }

    public static function sendPush(User $user, $message, $title = 'push', $url = null)
    {
        $puser = app(PushContract::class);
        $puser->sendUser($user, $title, $message, $url);
    }

    #обновить или создать активные по модели
    public static function updateActiveAndCreateByModel(User $user, ?Model $model, ?Carbon $dateActive = null, $message = null, $type = null, ?array $data = null, bool $isPush = true)
    {
        $notification = $model->notification()->myActive()->first();
        if($notification) {
            $notification->viewed = 0;
            $notification->date_active = $dateActive;
            self::sendPush($user, $notification->getPushMessage());
        } else {
            self::createMain($user, $model, $dateActive, $message, $type, $data , $isPush);
        }

    }


}
