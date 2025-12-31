<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Log;


class LogsController extends Controller
{

    public function in()
    {
        Log::send();
    }

    public function out()
    {

    }

}
