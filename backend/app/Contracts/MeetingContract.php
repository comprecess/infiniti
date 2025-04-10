<?php


namespace App\Contracts;


use App\Models\Meeting;

interface MeetingContract
{
    public function create(Meeting $model);
}
