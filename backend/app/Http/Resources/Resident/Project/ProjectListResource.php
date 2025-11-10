<?php

namespace App\Http\Resources\Resident\Project;

use App\Http\Resources\UserResource;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectListResource extends JsonResource
{

    public static $isCollection = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $format = Config::get('df');
        $resource = [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'summary' => $this->summary,
//            'budget' => $this->budget,
//            'budgetCurrency' => $this->printPrice('budget'),
            'budget' => $this->getCurrencyValueAndFormat('budget'),
            'expense' => $this->getCurrencyValueAndFormat($this->transactionExpense->amount()),
            'completed' => $this->getTaskCompleted(),
            'startDate' => $this->start_date?->format($format),
            'dueDate' => $this->due_date?->format($format),
            'users' => [
                'admin' => new UserResource($this->admin),
                'manager' => new UserResource($this->manager ?? $this->admin),
                'client' => new UserResource($this->client),
                'suppliers' => UserResource::collection($this->personalClients->pluck('user')),
                'staff' => UserResource::collection($this->personalAdmins->pluck('user')),
            ]

        ];
//        $members = $this->getMembers();
//        if($members->count()) {
//            $resource['members'] = UserResource::collection($members);
//        }

        if(!self::$isCollection) {
            $resource['details'] = $this->description;
        }


        return $resource;
    }

    public static function collection($resource)
    {
        self::$isCollection = true;
        return parent::collection($resource);
    }
}
