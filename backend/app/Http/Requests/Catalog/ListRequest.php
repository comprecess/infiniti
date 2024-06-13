<?php

namespace App\Http\Requests\Catalog;

use App\Http\Requests\Traits\AmountTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;

class ListRequest extends FormRequest
{
    use AmountTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    const SORT = [
        'rateHourly' => 'hourly',
        'rate8h' => 'daily'
    ];
    const SORT_TYPE = [
        'asc' => 'asc',
        'desc' => 'desc'
    ];

    public function rules(): array
    {
        $name = array_keys(self::SORT);
        $type = array_keys(self::SORT_TYPE);

        return [
            'property' => 'array',
//            'property.*' => 'required|integer',
//            'propertyValue' => 'array',
//            'propertyValue.*' => 'required|integer',
            'sort' => 'array',
            'sort.name' => 'in:' . (implode(',', $name)),
            'sort.type' => 'in:' . (implode(',', $type))
        ];
    }

    public function getSort($type = false)
    {
        $s = !$type ? self::SORT : self::SORT_TYPE ;
        $sort = $this->sort ?? [];
        return Arr::get($sort, 'name', $s[array_key_first($s)]);
    }
}
