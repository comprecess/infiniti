<?php

namespace App\Http\Middleware\Access;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HaveAccess
{

    public function handle(Request $request, Closure $next): Response
    {

        if(!$request->user()->hasAccess($request)) {
            return \response()->json(["message" => "No access"], 403);
        }

        return $next($request);
    }
}
