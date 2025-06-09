<?php

namespace App\Http\Requests\Resident;


use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Models\FileStorage;
use App\Models\Resident\Document;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;

class DocumentFileCreateRequest extends FormRequest implements ConvertingPropertiesInterface
{

    use ConvertingPropertiesTrait;

    public function rules(): array
    {
        $rules = [
            'title' => "required|string",
            'file' => "required|file|extensions:". implode(',', array_keys(FileStorage::FILE_TYPE)),
            'global' => "nullable|boolean",
        ];

        if($this->with && is_array($this->with)) {
            $object = Arr::get($this->with, 'object');
            if(isset(Document::WITH_MODEL[$object])) {
                $object = Document::WITH_MODEL[$object];
                $model = (new $object())->getTable();
                $rules = array_merge($rules, [
                   'with' => 'nullable|array',
                   'with.object' => 'required|in:' . implode(',', array_keys(Document::WITH_MODEL)),
                   'with.id' => 'required|integer|exists:'.$model.',id'
                ]);
            }
        }

        return $rules;
    }

    public function getListProperties(): array
    {
        return [
            'title',
        ];
    }
    public function messages()
    {
        return [
          'file.extensions' => 'Invalid file format'
        ];
    }

    public function getModel() :?Model
    {
        $data = $this->all();
        if($object = Arr::get($data, 'with.object')){
            $object = Document::WITH_MODEL[$object];
            return $object::find(Arr::get($data, 'with.id'));
        }
        return null;
    }

    public function setModel(Model $model)
    {
        foreach(Document::WITH_MODEL as $key => $modelWith) {
            if($model instanceof $modelWith) {
                $this->merge(['with' => ['object' => $key, 'id' => $model->id]]);
            }
        }
    }
}
