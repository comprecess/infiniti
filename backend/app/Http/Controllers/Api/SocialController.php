<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Users\Admin;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Arr;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


class SocialController extends Controller
{

    private function getState($url)
    {
        $queryParse = parse_url($url);
        parse_str($queryParse['query'], $params);

        return  $params['state'];
    }

    private function getKey($state)
    {
        return 'google_oauth:' . $state;
    }

    public function auth(Request $request)
    {
        $error = false;
        $user = null;
        try{
            $user = Socialite::driver('google')->user();
        }catch (InvalidStateException $e) {
            $error = true;
        }catch (ClientException $e){
            $error = true;
        }

        if($error || !$user) {
            return redirect('/google/auth/');
        }

        dd($user, $user->getEmail(), $user->getName(), $user->getNickname());

        $type = Cache::get($this->getKey($request->state)) ?? 'client';

        if($type == 'admin') {
//            Admin::where('username', $user)
        }



    }

    public function redirect(Request $request)
    {
        $redirect = Socialite::driver('google')->redirect();
        $redirectUrl = $redirect->getTargetUrl();

        Cache::put($this->getKey($this->getState($redirectUrl)), $request->admin == 'admin' ? 'admin' : 'client', 30*60);

//        return $redirect;
        return response()->json([
            'redirect' => $redirectUrl,
        ]);
    }
}
