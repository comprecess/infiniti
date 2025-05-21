<?php


namespace App\Services\Zoom\WebHook;


use App\Services\Zoom\WebHook;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Models\Meeting as MeetingModel;

class Meeting extends WebHook
{
    public function created(Request $request)
    {
        return response()->json(['success' => true]);
    }

    public function deleted(Request $request)
    {
        $data = $request->all();

        if($id = Arr::get($data,'payload.id')) {
            $meeting = MeetingModel::whereJsonContains('service_response->data->id', $id)->first();
            $meeting->delete();
        }
    }


}
