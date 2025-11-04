<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


class SocialController extends Controller
{

    private function getState($url)
    {
        $queryParse = parse_url($url);
        dd($queryParse);
        parse_str($queryParse['query'], $params);

        return  $params['state'];
    }

    private function getKey($state)
    {
        return 'google_oauth:' . $state;
    }

    public function auth(Request $request)
    {


        try{
            $user = Socialite::driver('google')->user();
        }catch (InvalidStateException $e) {
            return redirect('/google/auth/');
        }

        $type = Cache::get($this->getKey($request->state)) ?? 'client';

        return redirect('/google/auth/');
    }

    public function redirect(Request $request)
    {
        $redirect = Socialite::driver('google')->redirect();
        $redirectUrl = $redirect->getTargetUrl();

        Cache::put($this->getKey($this->getState($redirectUrl)), $request->admin == 'admin' ? 'admin' : 'client', 30*60);

        return $redirect;
        return response()->json([
            'redirect' => $redirectUrl,
        ]);
    }
}
