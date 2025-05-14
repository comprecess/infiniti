<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Traits\IsAuthTrait;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserSettings;
use Illuminate\Http\Request;


class UserController extends Controller
{
    use IsAuthTrait;

    public function getUserModel($hasExcept = true)
    {
        $this->isAuth($hasExcept);
        return $this->user;
    }

    public function getUser()
    {
        $this->isAuth();

        return new UserResource($this->user);
    }

    public function setting()
    {
//        $user = User::getAuth();
//        dd($user->settings->getSettings());
        return response()->json(['data' => User::getAuth()->settings->getSettings()]);
    }

    public function settingUpdate(Request $request)
    {
        $list = [];
        $data = $request->all();
        $settings = User::getAuth()->settings;
        $def = $settings->getListDefSettings();
        $user = User::getAuth();

        foreach($data as $key => $value) {
            if($defValue = $def[$key] ?? null) {
                UserSettings::updateOrCreate(
                    ['name' => $key],
                    [
                        'user_type' => $user::class,
                        'user_id' => $user->id,
                        'value' => $settings->typeData($def[$key][1], $value)
                    ]
                );
                $list[] = $key;
            }
        }

        $success = ['success' => count($list) ? true : false];
        if($success['success']) {
            $success['message'] = "List of properties: '". implode("', '", $list) ."';  updated";
        }
        return response()->json($success);

    }
}
