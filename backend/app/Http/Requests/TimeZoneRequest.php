<?php

namespace App\Http\Requests;

use App\Http\Requests\Traits\TimeZoneTrait;
use Illuminate\Foundation\Http\FormRequest;

class TimeZoneRequest extends FormRequest
{
    use TimeZoneTrait;

}
