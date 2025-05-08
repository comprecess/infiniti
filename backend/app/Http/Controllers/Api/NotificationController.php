<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Requests\NotificationRequest;
use App\Http\Requests\PushRequest;
use App\Http\Resources\NotificationResource;
use App\Models\Push;
use App\Models\User;
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
            ->myQuery()
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
        return response()->json(['key' => env('VAPID_PUBLIC_KEY')]);
    }

    public function subscribePush(PushRequest $request)
    {
        $user = User::getAuth();
//        if(!$user->push){
//            $push = new Push();
//            $push->setUser($user);
//
//            $subscription = $request->subscription;
//            $push->endpoint = Arr::get($subscription, 'endpoint');
//            $push->keys = Arr::get($subscription, 'keys');
//            $push->save();
//        }

        $subscription = $request->subscription;
        Push::updateOrCreate(
            ['endpoint' => Arr::get($subscription, 'endpoint')],
            [
                'keys' => Arr::get($subscription, 'keys'),
                'user_type' => $user::class,
                'user_id' => $user->id
            ]
        );

        return response()->json(['success' => true]);
    }

    public function test(Request $request)
    {
        $id = (int) $request->id;
        $push = Push::findOrFail($id);

        \App\Services\Push::send($push, 'Test', 'test');
        return response()->json(['success' => true]);
    }

}
