<?php

namespace App\Models\Resident;

use App\Http\Resources\Resident\BusinessPlan\BusinessPlanChatGPTResource;
use App\Models\BusinessModel\BusinessModel;
use App\Models\Contracts\ChatGPTContract;
use App\Models\Contracts\MeetingContract;
use App\Models\Traits\BootTrait;
use App\Models\Traits\CatalogUserTeamTrait;
use App\Models\Traits\ChatGPTTrait;
use App\Models\Traits\FileStorageTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Traits\UserTrait;
use App\Models\User;
use App\Models\Users\Admin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPlan extends Model implements ChatGPTContract, MeetingContract
{
    use HasFactory, ChatGPTTrait, CatalogUserTeamTrait, FileStorageTrait, HelperTrait, UserTrait, BootTrait;

    public $table = 'app_business_plan';

    const STATUS_GENERATE = ['New', 'Processing', 'Ready', 'Error', 'Stopped'];

    protected $casts = [
        'updated_at' => 'datetime',
        'date' => 'date',
        'answer' => 'array'
    ];

    public static function creatingEvent($item)
    {
        $item->setRandomNum('public', 32, true);
    }

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

    public function getUsersCatalog()
    {
        return $this->teams()->with(['employmentNow'])->get();
    }

    public function getUsersToMeeting(): array
    {
        return $this->getUsersCatalog()->pluck('name', 'email')->toArray();
    }

    public function getTitleToMeeting(): ?string
    {
        return __('meeting.business_plan', ['id' => $this->id]);
    }

    public function getDescriptionToMeeting(): ?string
    {
        return strip_tags($this->description);
    }

    public function getNameRoomToMeeting(): ?string
    {
        return "business_plan-" . $this->id;
    }

    public function setUser(User $user)
    {
        if($user instanceof Admin) {
            $this->name = $user->fullname;
            $this->email = $user->username;
            $this->phone = $user->phonenumber;
        }else{
            $this->name = $user->account;
            $this->email = $user->email;
            $this->phone = $user->phone;
            $this->cid = $user->id;
        }
    }
}
