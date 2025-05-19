<?php


namespace App\Services\Zoom\WebHook;


use App\Services\Zoom\WebHook;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class Endpoint extends WebHook
{
    public function urlValidation(Request $request)
    {
        $key = Arr::get($request->payload, 'plainToken');
        return response()->json(['plainToken' => $key, 'encryptedToken' => $this->createSecret($key)]);
    }
}
