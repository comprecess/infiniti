<?php

namespace App\Http\Middleware\Auth;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class Authenticate
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = User::getAuth();
        if($user === null) {
            return response(view('pages.auth.login'));
        }

        return $next($request);
    }
}
