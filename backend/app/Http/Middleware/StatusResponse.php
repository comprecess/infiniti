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
//        if(!$request->document) {
            if($request->expectsJson() && $response->headers->get('content-type') == 'application/json') {
                $json = json_decode($response->getContent(), true);

                if(!isset($json['status'])) {
                    $json['status'] = in_array($response->getStatusCode(), [200, 201]);
                }

                $response->setContent(json_encode($json));
            }
//        }

        return $response;
    }
}
