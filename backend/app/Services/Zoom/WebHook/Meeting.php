<?php


namespace App\Services\Zoom\WebHook;


use App\Events\Catalog\MeetingUpdate;
use App\Services\Zoom\Timezone;
use App\Services\Zoom\WebHook;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Models\Meeting as MeetingModel;

class Meeting extends WebHook
{
    private function getMeeting()
    {
        $data = \request()->all();
        if($id = Arr::get($data,'payload.object.id')) {
            return MeetingModel::whereJsonContains('service_response->data->id', $id)->first();
        }
    }

    public function created(Request $request)
    {
        return response()->json(['success' => true]);
    }

    public function deleted(Request $request)
    {
        if($meeting = $this->getMeeting()) {
            $meeting->delete();
            event(new MeetingUpdate($meeting));
        }
        return response()->json(['success' => true]);
    }

    public function updated(Request $request)
    {
        $data = $request->all();
        if($meeting = $this->getMeeting()) {

            $meeting->service_update = $data;


            if($newDate = Arr::get($data, 'payload.object.start_time')) {
                $date = Carbon::parse($newDate);
                $meeting->date = $date;
                $meeting->date_timezone = $date->copy()->setTimezone($meeting->timezone_time ?? $meeting->timezone);
            }

            if($newTimezone = Arr::get($data, 'payload.object.timezone')) {
                $tzZoom = (new Timezone())->timeByTimezone($newTimezone);
                if($tzZoom) {
                    $meeting->timezone_time = $tzZoom;
                    $meeting->timezone = $newTimezone;
                    $meeting->date_timezone = $meeting->date->clone()->setTimezone($tzZoom);
                }
            }

            $meeting->save();
            event(new MeetingUpdate($meeting));

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false], 404);
    }


}
