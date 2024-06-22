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
        'priceHour' => 'priceHour',
        'priceDay' => 'priceDay'
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
            'filter' => 'array',
            'sort' => 'array',
            'sort.name' => 'in:' . (implode(',', $name)),
            'sort.type' => 'in:' . (implode(',', $type))
        ];
    }

    public function getSort($type = false)
    {
        $s = !$type ? self::SORT : self::SORT_TYPE ;
        $typeName = !$type ? 'name' : 'type';
        $sort = $this->sort ?? [];
        return $s[Arr::get($sort, $typeName, array_key_first($s))];
    }
}
