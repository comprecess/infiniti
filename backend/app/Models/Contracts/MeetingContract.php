<?php


namespace App\Models\Contracts;


interface MeetingContract
{
    public function getUsersCatalog();
    public function getUsersToMeeting() :array;
    public function getTitleToMeeting() :?string;
    public function getDescriptionToMeeting() :?string;
    public function getNameRoomToMeeting() :?string;
}
