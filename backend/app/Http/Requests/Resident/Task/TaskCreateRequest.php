<?php

namespace App\Http\Requests\Resident\Task;

use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Http\Requests\Interfaces\ModelInterface;
use App\Http\Requests\Traits\ConvertingPropertiesTrait;
use App\Http\Requests\Traits\ModelTrait;
use App\Models\Resident\Project;
use App\Models\User;
//use App\Models\Users\Client;
//use App\Models\Users\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class TaskCreateRequest extends FormRequest implements ConvertingPropertiesInterface, ModelInterface
{
    use ConvertingPropertiesTrait, ModelTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        $patch = $this->method() == 'PATCH';
        $rules = [
            'title' => $patch ? 'nullable' : 'required',
            'startDate' => 'nullable|date_format:Y-m-d',
            'dueDate' => 'nullable|date_format:Y-m-d',
            'description' => 'nullable',
            'users' => 'required|array',
            'users.*.userType' => "required|in:Client,Admin",
            'users.*.id' => "required|integer",
        ];

        $this->setRule($rules)
//            ->applyModel('client')
            ->applyModel('project');
//            ->applyModel('owner');

        return $rules;
    }


    public function getListProperties(): array
    {
        return [
            'title',
//            'client' => 'cid',
            'startDate' => 'started',
            'dueDate' => 'due_date',
            'description',
            'project' => 'pid',
//            'owner' => 'aid'
        ];
    }


    public function getListPropertiesModel(): array
    {
        return [
//            'client' => Client::class,
            'project' => Project::class,
//            'owner' => Admin::class
        ];
    }

    public function setData(array $data)
    {
        $this->merge($data);
    }

    public function getUsers()
    {
        $collect = collect([]);
        foreach($this->users as $user){
            $userClass = User::getUserType($user['id'], $user['userType']);
            if(!$userClass) {
                throw ValidationException::withMessages(['users' => "Users not found"]);
            }
            $collect->push($userClass);
        }

        return $collect;
    }
}
