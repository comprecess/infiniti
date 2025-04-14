<?php

namespace App\Models;


use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $casts = [
        'date_active' => 'datetime',
        'data' => 'json',
    ];

    public function model()
    {
        return $this->morphTo('model');
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
        if($this->model) {
            return $this->model->notificationGetMessage();
        }

        if($this->type) {
            return __('notification.type', $this->data ?? []);
        }

        if($this->message) {
            return $this->message;
        }
    }

    public function scopeMyQuery($query)
    {
        $date = now();
        $query->selectRaw("*, IF(notifications.viewed = 0 OR notifications.date_active > '".$date->format('Y-m-d H:i:s')."', 0,1) AS typeSort")
            ->orderByRaw('typeSort asc, notifications.id desc');
    }

}
