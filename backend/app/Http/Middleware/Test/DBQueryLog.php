<?php

namespace App\Http\Middleware\Test;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class DBQueryLog
{

    public function handle(Request $request, Closure $next): Response
    {

        DB::enableQueryLog();

        $response = $next($request);

        dd(DB::getQueryLog());

        return $response;
    }
}
