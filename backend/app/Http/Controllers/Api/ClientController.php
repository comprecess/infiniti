<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Client\AvatarRequest;
use App\Http\Requests\User\Client\UpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\Users\Client;
use App\Services\Tools\Countries;
use Illuminate\Http\Request;


class ClientController extends UserController
{
    public function index()
    {
        $this->isAuth(false);

        return new UserResource($this->user);
    }

    public function update(UpdateRequest $request)
    {
        $user = auth()->user();
        $request->setModel($user);

        if($request->password) {
            $user->setNewPassword($request->password);
        }

        $countries = Countries::list();
        if($request->country && isset($countries[$request->country])) {
            $user->country = $countries[$request->country];
        }

        $user->save();

        return response()->json(['success' => true]);

    }

    public function updateAvatar(AvatarRequest $request)
    {
        $user = auth()->user();
        $file = $user->uploads($request->file);
//        $user->files()->where('id', '!=', $file->id)->whereNull('data')->delete();
        $user->files()->where('id', '!=', $file->id)->whereNull('data')->get()->each(function($item){
            $item->delete();
        });

        return response()->json(['success' => true]);
    }
}
