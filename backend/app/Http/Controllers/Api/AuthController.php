<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Registration;
use App\Mail\ResetPassword;
use App\Models\Log;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function clientLogin(Request $request)
    {

        $client = (new Client())->login($request->login, $request->password);

        if($client) {
            return response()->json(['token' => $client->api_token]);
        } else {
            return response()->json(['message' => __('login.or_password')], 403);
        }

    }

    public function residentLogin(Request $request)
    {
        $client = (new Admin())->login($request->login, $request->password);

        if($client) {
            return response()->json(['token' => $client->api_token]);
        } else {
            return response()->json(['message' => __('login.or_password')], 403);
        }

    }

    public function registration(Registration $request)
    {
        $client = new Client();
        $client->insertDefaultValue();
        $client->setNewPassword($request->password);
        $client->setApiToken();
        $client->save();

        return response()->json(['token' => $client->api_token]);

    }

    public function resetpassword(Request $request)
    {
        $client = Client::where('email', $request->email)->first();
        if($client) {
            $password = Str::random(8);
            $client->setNewPassword($password);
//            $client->setApiToken();
            $client->save();

            Mail::to($request->email)->send(new ResetPassword($client, $password));
            \Illuminate\Support\Facades\Log::alert('new password ' . $password);

            return response()->json(['message' => __('auth.new_password')]);

        } else {
            return response()->json(['message' => __('auth.no_found_email')], 403);
        }
    }

}
