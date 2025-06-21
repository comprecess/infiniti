<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Requests\NotificationRequest;
use App\Http\Requests\PushRequest;
use App\Http\Resources\NotificationResource;
use App\Models\Push;
use App\Models\User;
use App\Services\Push\Contracts\PushContract;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;


class NotificationController extends Controller
{
    use CRUD;

    public function list(Request $request)
    {
        $type = $request->type == 'all';
        $not = User::getAuth()
            ->notifications()
            ->myActive()
            ->with(['model']);

        if(!$type) {
            $not->having('typeSort', 0);
        }

        return $this->index($not, NotificationResource::class, $type);
    }

    public function viewed(NotificationRequest $request)
    {
        User::getAuth()
            ->notifications()
            ->whereIn('id', $request->ids)
            ->update(['viewed' => 1]);

        return response()->json(['success' => true]);
    }

    public function getKeyPush()
    {
//        return response()->json(['key' => env('VAPID_PUBLIC_KEY')]);
        return response()->json(['key' => env('ONESIGNAL_APP_ID')]);
    }

    public function subscribePush(PushRequest $request)
    {
        $user = User::getAuth();

        Push::updateOrCreate(
            ['endpoint' => $request->subscription],
            [
                'user_type' => $user::class,
                'user_id' => $user->id,
                'keys' => []
            ]
        );

        return response()->json(['success' => true]);
    }

    public function unsubscribedPush()
    {
        $user = User::getAuth();
        $pushSubscriptions = $user->pushSubscriptions;
        foreach($pushSubscriptions as $push){
            $push->delete();
        }


        return response()->json(['success' => true]);
    }

    public function test(Request $request)
    {
        $id = (int) $request->id;
        $title = $request->title ?? 'Test';
        $message = $request->message ?? 'test';
        $url = $request->url;
        $push = Push::findOrFail($id);
        $test = app(PushContract::class);
        $test->send($push, $title, $message, $url);
        return response()->json(['success' => true]);
    }

}
