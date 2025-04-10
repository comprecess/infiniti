<?php


namespace App\Services\Zoom;


use App\Services\Zoom\Requests\MeetingData;

class Meeting extends Zoom
{

    public function create(MeetingData $data, $token = 'me')
    {
        return $this->request("users/{$token}/meetings", "POST", $data);
    }
}
