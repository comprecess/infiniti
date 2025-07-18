<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class ClientTimeZone
{
    private $step = 15;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        try {
            $timeUser = Carbon::parse($request->header('Client-Date'));
        }catch (\Exception $e) {
            $timeUser = null;
        }

        if($timeUser) {
            $interval = now()->diff($timeUser);

            $h = $interval->h;
            $i = (int) $this->myRand($interval->i, $this->step);

            $ii = (int) ($i / 60);
            if($ii) {
                $h += $ii;
                $i = "00";
            }

//            $tz = ($interval->invert && $h != 0 ? "-" : "+") . str_pad($h, 2, '0', STR_PAD_LEFT) .":" . $i;
            $seccond = ($h*60 + $i) * 60;


            if($interval->invert) {
                $seccond *= -1;
            }

            if($idTimezone = $this->guessTimezoneFromOffset($seccond, $request)){
                date_default_timezone_set($idTimezone);
            }

        }

        return $next($request);
    }

    private function myRand($count, $step){
        return $step*round($count/$step);
    }

    private function guessTimezoneFromOffset(int $offsetInSeconds, Request $request)
    {
        $key = 'timezone_' . $request->ip();

        return Cache::remember($key, config('cache.time.1hour'), function() use($offsetInSeconds){
            $timezones = \DateTimeZone::listIdentifiers();
            $now = new \DateTime();

            foreach($timezones as $timezone) {
                $tz = new \DateTimeZone($timezone);
                $now->setTimezone($tz);

                if($tz->getOffset($now) == $offsetInSeconds) {
                    return $timezone;
                }
            }

            return null;
        });


    }
}
