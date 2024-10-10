<?php

namespace App\Http\Middleware\Access;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HaveAccess
{

    public function handle(Request $request, Closure $next): Response
    {

        if(!$request->user()->hasAccessByRequest($request)) {
            abort(403);
        }

        return $next($request);
    }
}
