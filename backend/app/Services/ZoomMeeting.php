<?php


namespace App\Services;


use App\Contracts\MeetingContract;
use App\Models\Meeting;
use App\Services\Zoom\Requests\MeetingData;
use Illuminate\Support\Facades\Log;

class ZoomMeeting implements MeetingContract
{

    public function create(Meeting $model, string $title = null, string $description = null, $listUsers = [])
    {
        $meetingData = new MeetingData();
        $meeting = new \App\Services\Zoom\Meeting();
        $users = [];
        $roomUsers = [];
        $inviteesUsers = [];
        $email = $model->owner?->getEmail();
        $name = $model->owner?->getName();

        $modelMeet = $model->model;
        if(!$modelMeet || !($modelMeet instanceof \App\Models\Contracts\MeetingContract)) {
            return false;
        }

        $title = $title ?? $modelMeet->getTitleToMeeting();
        $description = $description ?? $modelMeet->getDescriptionToMeeting();

        $users[] = ['email' => $email, 'name' => $name];
        $roomUsers[] = $email;
        foreach($modelMeet->getUsersToMeeting() as $emailMeet => $nameMeet) {
            if($emailMeet) {
                $users[] = ['email' => $emailMeet, 'name' => $nameMeet];
                $roomUsers[] = $emailMeet;
                $inviteesUsers[] = ['email' => $emailMeet];
            }
        }

        if(count($users) < 2) {
            return false;
        }


        $meetingData->duration = Meeting::TIME;
        $meetingData->schedule_for = $email;
        $meetingData->agenda = $description;
        $meetingData->topic = $title;
        $meetingData->start_time = $model->date->format("Y-m-d\TH:i:s\Z");
        $meetingData->timezone = $model->timezone;
        $meetingData->pushArr('settings.authentication_exception', $users)
            ->pushArr('settings.contact_email', $email)
            ->pushArr('settings.contact_name', $name)
            ->pushArr('settings.breakout_room.rooms.0.name', $modelMeet->getNameRoomToMeeting())
            ->pushArr('settings.breakout_room.rooms.0.participants', $roomUsers)
            ->pushArr('settings.meeting_invitees', $inviteesUsers)
//        ->pushArr('settings.alternative_hosts', "jchill@example.com;jchill@example.com")
        ;

        $response = $meeting->create($meetingData);
        $model->service_response = $response;
        $model->create_data = $meetingData->toArray();
        $model->save();
        return true;
    }
}
