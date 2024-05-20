<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StatusResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        /*
         *
         * @var Response $reqsponse
         */
        $json = json_decode($response->getContent(), true);

        if(!isset($json['status'])) {
            $json['status'] = $response->getStatusCode() == 200;
        }

        $response->setContent(json_encode($json));

        return $response;
    }
}
