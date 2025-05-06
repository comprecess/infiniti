<?php

namespace App\Http\Requests\Resident;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;


class DocumentRequest extends FormRequest
{

    const DOCUMENT = ['json', 'pdf', 'excel', 'csv', 'copy'];

    public function isDocument()
    {
        return true;
    }

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

    public function search() :array
    {
        return [

        ];
    }

    public function rules(): array
    {
        if(!$this->isDocument() && request()->get('document')) {
            throw ValidationException::withMessages(["serviceId" => __('validation.declined', ['attribute' => "document"])]);
        }

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
            $sortResult = $this->{$method}($model);
            if($sortResult !== null) {
                $model->orderBy($sortResult, $desc ? "desc" : 'asc');
            }
        } else {
            $model->orderBy($sort[$this->sort['name'] ?? 'id'], $desc ? "desc" : 'asc');
        }

        return $this;
    }

    public function searchModel($model)
    {
        $aearchColumn = $this->search();
        if(($search = Arr::get($this->all(), 'filter.search')) && $aearchColumn){
            $search = "%{$search}%";
            $model->where(function($query) use($search, $aearchColumn){
                foreach($aearchColumn as $column) {
                    $query->orWhere($column,'like', $search);
                }
            });
        }

        return $this;
    }




}
