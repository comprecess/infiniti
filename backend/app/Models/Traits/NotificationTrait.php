<?php


namespace App\Models\Traits;


use App\Models\Meeting;
use App\Models\Notification;
use Illuminate\Support\Arr;

trait NotificationTrait
{
//    public function notification()
//    {
//        return $this->morphMany(Meeting::class, 'meeting')->orderByDesc('id');
//    }

    public function notification()
    {
        return $this->morphMany(Notification::class, 'model')->orderByDesc('id');
    }

    public function getMessage(Notification $notification)
    {
        if(method_exists($this, 'notificationMessage')) {
            return $this->notificationMessage($notification);
        }
        return null;
    }

    public function notificationGetTitle()
    {
        $class = explode("\\", $this::class);
        return __("notification.title.". $class[count($class) - 1]);
    }

    public function getPushMessage(Notification $notification)
    {
        if(method_exists($this, 'notificationPushMessage')) {
            return $this->notificationPushMessage($notification);
        }
        return null;
    }


}
