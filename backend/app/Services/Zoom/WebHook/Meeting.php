<?php


namespace App\Services\Zoom\WebHook;


use App\Events\Catalog\MeetingUpdate;
use App\Services\Zoom\WebHook;
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
    }

    public function updated(Request $request)
    {
        if($meeting = $this->getMeeting()) {
            $meeting->service_update = $request->all();
            $meeting->save();
            event(new MeetingUpdate($meeting));
        }
    }


}
