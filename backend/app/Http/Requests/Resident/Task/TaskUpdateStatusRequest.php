<?php

namespace App\Http\Requests\Resident\Task;

use App\Models\Resident\Project;
use Illuminate\Foundation\Http\FormRequest;

class TaskUpdateStatusRequest extends FormRequest
{


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        $status = Project\Task::getStatusColumn()->pluck('title')->implode(',');

        return [
            'status' => 'required|in:' . $status,
            'position' => 'required|numeric'
        ];
    }

    public function getStatus()
    {
        return Project\Task::getStatusColumn()->where('id', $this->status)->first();
    }

}
