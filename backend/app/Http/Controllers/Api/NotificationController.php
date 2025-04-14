<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Requests\NotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Models\User;
use Illuminate\Http\Request;


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

        return $this->index($not, NotificationResource::class, true);
    }

    public function viewed(NotificationRequest $request)
    {
        User::getAuth()
            ->notifications()
            ->whereIn('id', $request->ids)
            ->update(['viewed' => 1]);

        return response()->json(['success' => true]);
    }

}
