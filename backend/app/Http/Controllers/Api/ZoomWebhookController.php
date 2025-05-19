<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class ZoomWebhookController extends Controller
{

    public function index(Request $request)
    {
        Log::alert('***Zoom webhook***', $request->all());
    }
}
