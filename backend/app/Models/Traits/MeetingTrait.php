<?php


namespace App\Models\Traits;


use App\Models\Meeting;

trait MeetingTrait
{
    public function meeting()
    {
        return $this->morphMany(Meeting::class, 'meeting')->orderByDesc('id');
    }
}
