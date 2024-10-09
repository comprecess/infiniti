<?php

namespace App\Http\Middleware\Access;

use App\Http\Resources\Resident\Settings\RoleAccessResource;
use App\Models\Resident\Settings\Role;
use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AccessResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    const RESPONSE = ['view', 'edit', 'create', 'delete', 'all'];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

            if($request->expectsJson() && $response->headers->get('content-type') == 'application/json') {
                $json = json_decode($response->getContent(), true);
                $access = $request->user()->hasAccess($request, true);
                $responseAccess = [];

                foreach(self::RESPONSE as $value) {
                    $responseAccess[$value] = 0;
                }
                if($access === true) {
                    foreach($responseAccess as $key => &$value) {
                        $value = 1;
                    }
                } elseif ($access instanceof Model) {
                    foreach($responseAccess as $key => &$value) {
                        $value = (int) $access->{$key};
                    }
                }

                $json['access'] = $responseAccess;

                $response->setContent(json_encode($json));
            }

        return $response;
    }
}
