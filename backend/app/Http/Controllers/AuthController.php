<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Users\Client;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        $login = (new Client())->login($request->login, $request->password);

        if($login) {
            return redirect()->back();
        } else {
            return redirect()->route('login.form')->withErrors(__('login.or_password'));
        }
    }

    public function loginForm()
    {
        $user = User::getAuth();
        if($user) {
            return redirect('/');
        }
        return view('pages.auth.login');
    }
}
