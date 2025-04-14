<?php


namespace App\Models\Traits;


use App\Models\Meeting;

trait NotificationTrait
{
    public function notification()
    {
        return $this->morphMany(Meeting::class, 'meeting')->orderByDesc('id');
    }

    public function notificationGetMessage()
    {
        $data = [];
        $class = explode("\\", $this::class);
        if(method_exists($this, 'notificationData')) {
            $data = $this->notificationData();
        }
        return __('notification.'. $class[count($class) - 1], $data);
    }


}
