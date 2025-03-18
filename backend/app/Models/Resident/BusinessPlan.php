<?php

namespace App\Models\Resident;

use App\Http\Resources\Resident\BusinessPlan\BusinessPlanChatGPTResource;
use App\Models\BusinessModel\BusinessModel;
use App\Models\Contracts\ChatGPTContract;
use App\Models\Traits\CatalogUserTeamTrait;
use App\Models\Traits\ChatGPTTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPlan extends Model implements ChatGPTContract
{
    use HasFactory, ChatGPTTrait, CatalogUserTeamTrait;

    public $table = 'app_business_plan';

    protected $casts = [
        'updated_at' => 'datetime',
        'date' => 'date',
    ];

    public function businessModel()
    {
        return $this->belongsTo(BusinessModel::class, 'business_model_id');
    }

    public function discussionTopic() :string
    {
        $name = $this->discussionName();

        $topic = "бизнес-план. \n";
        if($this->id) {
            $topic .= 'Орентируйся на данные ['.$name.'] этого бизнес-плана.';
        }

        return $topic;
    }

    public function discussionName(): string
    {
        return 'данные';
    }

    public function getResourceChat()
    {
        return BusinessPlanChatGPTResource::class;
    }
}
