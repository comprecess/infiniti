<?php

namespace App\Http\Requests\Resident;

use Illuminate\Foundation\Http\FormRequest;


class DocumentRequest extends FormRequest
{

    const DOCUMENT = ['json', 'pdf', 'excel', 'csv', 'copy'];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function sort() :array
    {
        return [

        ];
    }

    public function rules(): array
    {
        return [
            'filter.search' => "nullable|string",
            'sort.name' => "nullable|in:" . implode(",", array_keys($this->sort())),
            'document' => "nullable|in:" . implode(",", self::DOCUMENT),
        ];
    }

    public function sortModel($model)
    {
        $sort = $this->sort();
        $desc = isset($this->sort['type']) ? (bool) $this->sort['type'] : true;
        if(method_exists($this, $sort[$this->sort['name'] ?? 'id'])) {
            $method = $sort[$this->sort['name'] ?? 'id'];
            $model->orderBy($this->{$method}(), $desc ? "desc" : 'asc');
        } else {
            $model->orderBy($sort[$this->sort['name'] ?? 'id'], $desc ? "desc" : 'asc');
        }
    }


}
