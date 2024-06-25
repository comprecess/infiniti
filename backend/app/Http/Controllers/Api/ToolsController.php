<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Services\Tools\Countries;


class ToolsController extends Controller
{
    public function countries()
    {
        return response()->json(Countries::list());
    }
}
