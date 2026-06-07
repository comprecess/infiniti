<?php

namespace App\Http\Resources\Resident\Project;

use App\Http\Resources\UserResource;
use App\Models\Config;
use App\Services\ProjectFinancialService;
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
            'template_code' => $this->template_code,
            'status' => $this->status,
            'summary' => $this->summary,
            'budget' => $this->getCurrencyValueAndFormat('budget'),
            'expense' => $this->getCurrencyValueAndFormat($this->transactionExpense->amount()),
            'completed' => $this->getTaskCompleted(),
            'startDate' => $this->start_date?->format($format),
            'dueDate' => $this->due_date?->format($format),
            'isMy' => $this->isMy(),
            'users' => [
                'admin' => new UserResource($this->admin),
                'manager' => new UserResource($this->manager ?? $this->admin),
                'client' => new UserResource($this->client),
                'suppliers' => UserResource::collection($this->personalClients->where('user', '!=', null)->pluck('user')),
                'staff' => UserResource::collection($this->personalAdmins->where('user', '!=', null)->pluck('user')),
                'aiTeam' => method_exists($this->resource, 'teams') ? UserResource::collection($this->teams) : [],
            ]

        ];
        // AI Workforce Financial Metrics
        if (method_exists($this->resource, 'teams') && $this->teams->count() > 0) {
            $financialService = new ProjectFinancialService();
            $resource['aiFinancials'] = $financialService->calculate($this->resource);
        }
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
