<?php


namespace App\Models\Traits;


use App\Models\Meeting;
use Illuminate\Support\Arr;

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
        $tag = "";
        if(method_exists($this, 'notificationData')) {
            $data = $this->notificationData();
            $tag = Arr::get($data, 'tagLang', "");
        }

        if($tag) {
            $tag .=".";
        }
        return __("notification.{$tag}". $class[count($class) - 1], $data);
    }

    public function notificationGetTitle()
    {
        $class = explode("\\", $this::class);
        return __("notification.title.". $class[count($class) - 1]);
    }


}
