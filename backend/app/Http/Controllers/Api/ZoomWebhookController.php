<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;


class ZoomWebhookController extends Controller
{

    private function createSecret($key = null)
    {
        $key = $key ?? Arr::get(\request()->payload, 'plainToken');
        $token = env('ZOOM_WEBHOOK');
        return hash_hmac('sha256', $key, $token);
    }

    public function index(Request $request)
    {
        Log::alert('***Zoom webhook***', $request->all());
        $data = $request->all();

        if($event = Arr::get($data, 'event')) {
            $method = snakeCaseToPascalCase(str_replace(['.'], '_', $event));
            if(method_exists($this, $method)) {
                return $this->{$method}($request);
            }
        }

        return response()->json(['success' => false], 404);
    }

    public function endpointUrlValidation(Request $request)
    {
        $key = Arr::get($request->payload, 'plainToken');
        return response()->json(['plainToken' => $key, 'encryptedToken' => $this->createSecret($key)]);
    }
}
