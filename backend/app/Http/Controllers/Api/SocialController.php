<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
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
        }catch (RequestException $e) {
            $error = true;
        }

        if($error || !$user) {

            return redirect('/public/google/auth' . __('auth.google.error'));
        }

//        dd($user, $user->getEmail(), $user->getName());

        $type = Cache::get($this->getKey($request->state)) ?? 'client';
        $token = '';
        $urlAvatar = null;
        $messge = '';

        if($type == 'admin') {
            $userPlatform = Admin::where('username', $user->getEmail())->first();
        }else{
            $userPlatform = Client::where('email', $user->getEmail())->first();
            if(!$userPlatform) {
                $userPlatform = new Client();
                $userPlatform->insertDefaultValue();
                $userPlatform->email = $user->getEmail();
                $userPlatform->account = $user->getName();
                $userPlatform->state = '';
                $urlAvatar = $user->getAvatar();
            }
        }

        if($userPlatform) {
            $userPlatform->google = $user->getId();
            $userPlatform->setApiToken(true);
            $userPlatform->save();
            $token = '/' . $userPlatform->api_token;
        }else{
            $messge = __('auth.google.error');
        }

        if($urlAvatar) {
            $userPlatform->urlFile($urlAvatar);
        }

        return redirect('/public/google/auth' . $token . $messge);

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
