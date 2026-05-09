<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\PushUpdateRequest;
use App\Http\Requests\NotificationRequest;
use App\Http\Requests\PushRequest;
use App\Http\Resources\Notification\PushListResource;
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

        $keys = [];
        if ($request->p256dh && $request->auth) {
            $keys = ['p256dh' => $request->p256dh, 'auth' => $request->auth];
        }

        Push::updateOrCreate(
            ['endpoint' => $request->subscription],
            [
                'user_type' => $user::class,
                'user_id'   => $user->id,
                'name'      => $request->name,
                'keys'      => $keys,
            ]
        );

        return response()->json(['success' => true]);
    }

    public function unsubscribedPush(Request $request)
    {
        $user = User::getAuth();
        $pushSubscriptionsQuery = $user->pushSubscriptions();
        if($request->userId) {
            $pushSubscriptionsQuery->where('endpoint', $request->userId);
        }

        foreach($pushSubscriptionsQuery->get() as $push){
            $push->delete();
        }

        return response()->json(['success' => true]);
    }

    public function listPush()
    {
        $user = User::getAuth();
        return PushListResource::collection($user->pushSubscriptions);
    }

    public function getItemPush($userId)
    {
        $user = User::getAuth();
        $push = $user->pushSubscriptions()->where('endpoint', $userId)->firstOrFail();
        return new PushListResource($push);
    }

    public function enabledPush(PushUpdateRequest $request, $userId)
    {
        $user = User::getAuth();
        $push = $user->pushSubscriptions()->where('endpoint', $userId)->firstOrFail();
        $push->enabled = $request->enabled;
        $push->save();

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

    public function test2(Request $request)
    {
        $user = User::getAuth();
        $title = $request->title ?? 'Test';
        $message = $request->message ?? 'test';
        $url = $request->url;
        $test = app(PushContract::class);
        $test->sendUser($user, $title, $message, $url);
        return response()->json(['success' => true]);
    }

}
