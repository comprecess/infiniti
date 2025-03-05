<?php

namespace App\Models\BusinessModel;

use App\Http\Resources\BusinessModel\BusinessModelChatGPTResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanResource;
use App\Models\Contracts\ChatGPTContract;
use App\Models\Resident\BusinessPlan;
use App\Models\Traits\ChatGPTTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\FileStorageTrait;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessModel extends Model implements ChatGPTContract
{
    use HasFactory, CurrencyTrait, SoftDeletes, FileStorageTrait, ChatGPTTrait;

    const TYPE_IMG = ['preview', 'content'];

    protected $table = 'business_model';

    public $timestamps = false;

    protected $casts = [
        'start' => 'date',
    ];

    public function values()
    {
        return $this->morphedByMany(related: Value::class, name: 'cataloggable', table:'business_model_value', foreignPivotKey: 'id_business_model');
    }

    public function props()
    {
        return $this->morphedByMany(related: Prop::class, name: 'cataloggable', table:'business_model_value', foreignPivotKey: 'id_business_model');
    }

    public function getPropsByNameId(array $nameId = null)
    {
        $values = $this->values->load(['prop']);

        $props = $values->pluck('prop')->unique('id')->map(function($item) use ($values){
            $item->values = collect($values->where('id_prop', $item->id)->sortBy('id')->all());
            return $item;
        });

        if($nameId) {
            $props = $props->whereIn('id_name', $nameId);
        }

        return $props;
    }

    public function setPropData($value, $idNameProp)
    {
        $ids = collect([]);
        $prop = Prop::where(intval($idNameProp) == $idNameProp ? 'id' : 'id_name', $idNameProp)->first();
        if(!$prop) {
            return false;
        }

        $prop->childrenList($ids);

        $isInt = intval($value) == $value;

        $valueQuery = Value::whereIn('id_prop', $ids->pluck('id'));

        if($isInt && !in_array($prop->type, ['integer'])) {
            $valueQuery->where('id', $value);
        }else{
            $valueQuery->where('value', $value);
        }

        $val = $valueQuery->first();

        if($val) {
            $this->values()->attach([$val->id]);
        } else {
            if(!$prop->has_add) {
                throw new \Exception("Properties [{$prop->id_name}] are not allowed to be added");
            }
            $prop->values()->create(['value' => $value])->users()->attach([$this->id]);
        }

    }

    public function discussionTopic() :string
    {
        /*
         $topic = 'бизнес-модель';
        if($this->id) {
            $topic .= ' орентируясь на свойства и харктеристики [Свойства и характеристики]';
        }
        */

        $topic = "бизнес-модель. \n";
        if($this->id) {
            $topic .= 'Орентируйся на свойства и харктеристики [свойства и характеристики] этой бизнес-модели.';
        }

        return $topic;
    }

    public function discussion() :string
    {
//        $chat->write("Тема разговора бизнес-модель");
//        $chat->write("У меня есть информация о бизнес-модели формате JSON: " . $this->modelDescription() );
        return '';
    }

    public function modelDescription(mixed $data = null)
    {
        return (new BusinessModelChatGPTResource($this))->toChat($data);
    }

    public function discussionColumn()
    {
        return "";
    }

    public function toPlan() :BusinessPlan
    {
        $user = User::getAuth();

        $plan = new BusinessPlan();
        $plan->business_model_id = $this->id;

        $plan->email = $user->username;
        $plan->phone = $user->phonenumber;
        $plan->name = $user->fullname;

        $plan->company_name = $this->title;
        $plan->date = $this->start;
        $plan->description = $this->full_description;
        $plan->ex_summary = $this->description;
        $plan->m_analysis = $this->market_analysis;
        $plan->investment = $this->current_investors;
        $plan->finance = $this->financial_model;

        $plan->save();

        return $plan;
    }
}
