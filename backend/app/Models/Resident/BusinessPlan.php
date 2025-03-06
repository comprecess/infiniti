<?php

namespace App\Models\Resident;

use App\Http\Resources\Resident\BusinessPlan\BusinessPlanChatGPTResource;
use App\Models\Contracts\ChatGPTContract;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\ChatGPTTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\FileStorageTrait;

class BusinessPlan extends Model implements ChatGPTContract
{
    use HasFactory, ChatGPTTrait;

    public $table = 'app_business_plan';

    protected $casts = [
        'updated_at' => 'datetime',
        'date' => 'date',
    ];

    public function discussionTopic() :string
    {
        $name = $this->discussionName();

        $topic = "бизнес-план. \n";
        if($this->id) {
            $topic .= 'Орентируйся на данные ['.$name.'] этого бизнес-плана.';
        }

        return $topic;
    }

    public function modelDescription(mixed $data = null)
    {
        return (new BusinessPlanChatGPTResource($this))->toChat($data);
    }

    public function discussionName(): string
    {
        return 'данные';
    }
}
