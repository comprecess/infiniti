<?php

namespace App\Models\Catalog;

use App\Contracts\FilterContract;
use App\Models\Contracts\MeetingContract;
use App\Models\Resident\BusinessPlan;
use App\Models\Resident\Settings\Currency;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\FileStorageTrait;
use App\Models\Users\Client;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class User extends Model implements MeetingContract
{
    use HasFactory, CurrencyTrait, SoftDeletes, FileStorageTrait;

    const AVAILABLE_STATUS = [
        'now',
        'this week',
        'next week',
        'this month',
        'Not available'
    ];

    protected $table = 'catalog_user';

    protected $casts = [
        'availabilityEnd' => 'datetime',
        'birth_day' => 'date',
        'experience' => 'json',
    ];

    #отказ привязки к клиенту
//    public function user()
//    {
//        return $this->belongsTo(Client::class, 'id_client');
//    }

    public function values()
    {
        return $this->morphedByMany(related: Value::class, name: 'cataloggable', table:'catalog_user_value', foreignPivotKey: 'id_catalog_user');
    }

    public function props()
    {
        return $this->morphedByMany(related: Prop::class, name: 'cataloggable', table:'catalog_user_value', foreignPivotKey: 'id_catalog_user');
    }

    public function blockExperience()
    {
        return $this->hasMany(UserBlock::class, 'id_catalog_user');
    }

    public function businessPlanTeams()
    {
        return $this->morphedByMany(BusinessPlan::class, 'model', 'catalog_team');
    }

    public function employment()
    {
        return $this->hasMany(UserEmployment::class, 'id_catalog_user');
    }

    public function employmentNow()
    {
        return $this->hasMany(UserEmployment::class, 'id_catalog_user')->where('from', ">", now());
    }

    public function scopeActive($query) :void
    {
        $query->where('active', 1);
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

    public static function getDateAvailable() :array
    {
        $now = now();
        $nextWeek = (clone $now)->next(Carbon::MONDAY);
        $nextWeek2 = (clone $nextWeek)->next(Carbon::MONDAY);
        $nextMounth = (clone $now)->setDay(1)->addMonth();

        return [$now, $nextWeek, $nextWeek2, $nextMounth];
    }


    public function getAvailableStatus() :int
    {
        $avalible = self::getDateAvailable();

        if($this->availabilityEnd === null) {
            return 0;
        }

        foreach($avalible as $key => $value) {
            if($this->availabilityEnd < $value) {
                return $key;
            }
        }

        return 4;
    }

    public function getTreePropValuesCollection()
    {
        $props = $treePropValue = collect([]);
        $values = $this->values;
        $propsValue = $this->props->merge(Prop::whereIn('id', $values->unique('id_prop')->pluck('id_prop'))->get());
        foreach($propsValue as $prop) {
            $props->put($prop->id, $prop);
            $propParent = $prop;
            while($propParent->id_parent) {
                $propParent = $propParent->parent;
                $props->put($propParent->id, $propParent);
            }
        }


        $this->setTreePropValue($props, $values);
        return $props->where('id_parent', null);

    }

    private function setTreePropValue(Collection $elements, Collection $values, $element = null)
    {
        $firstTree = $elements->where('id_parent', $element?->id ?? null);
        foreach($firstTree as $firstTreeProp) {
            $this->setTreePropValue($elements, $values, $firstTreeProp);
            if($element) {
                $element->setChildTree($firstTreeProp);
            }

            $valuesInProp = $values->where('id_prop', $firstTreeProp->id);
            foreach($valuesInProp as $val) {
                $firstTreeProp->setValueTree($val);
            }
        }
    }

    public function setExpirence()
    {
        $result = ['year' => 0, 'month' => 0, 'day' => 0];
        $exp = [];
        $blocks = $this->load(['blockExperience'])->blockExperience;

        foreach($blocks as $key => $block) {
            $block->to = $block->to ?? now();
            if(!$exp) {
                $exp[] = ['from' => $block->from, 'to' => $block->to];
            } else {
                $count = count($exp);
                $extens = false;
                for($i = 0; $i < $count; $i++) {
                    $val =& $exp[$i];
                    if($block->from <= $val['from']) {
                        $extens = $block->to > $val['from'];
                    } else {
                        $extens = $block->from < $val['to'];
                    }

                    if($extens) {
                        $val['from'] = $val['from'] <= $block->from ? $val['from'] : $block->from;
                        $val['to'] = $val['to'] >= $block->to ? $val['to'] : $block->to;
                        break;
                    }
                }
                if(!$extens) {
                    $exp[] = ['from' => $block->from, 'to' => $block->to];
                }
            }
        }

        foreach($exp as $period) {
            $diff = $period['to']->diff($period['from']);
            $result['month'] += (int) $diff->format('%m');
            $result['year'] += (int) $diff->format('%y');
            $result['day'] += (int) $diff->format('%d');
        }

        $result['month'] += intval($result['day'] / 30);
        $result['day'] = $result['day'] % 30;
        $result['year'] += intval($result['month'] / 12);
        $result['month'] = $result['month'] % 12;

        $this->experience = $result;
        $this->save();
    }

    public function getSimilar()
    {
        return app(FilterContract::class)->similar($this);
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

    public function getUsersCatalog()
    {
        return collect([$this]);
    }

    public function getUsersToMeeting(): array
    {
        return [$this->email => $this->name];
    }

    public function getTitleToMeeting() :?string
    {
        return __('meeting.individual', ['id' => $this->id]);
    }

    public function getDescriptionToMeeting() :?string
    {
        return __('meeting.individual', ['id' => $this->id]);
    }

    public function getNameRoomToMeeting(): ?string
    {
        return "individual-" . $this->id;
    }

    public function createSupplierClient() :?Client
    {
        if(!$this->email) {
            return null;
        }

        $client = Client::where('email', $this->email)->first();

        if(!$client) {
            $currency = Currency::getDefault();
            $client = new Client();
            $client->account = $this->name;
            $client->email = $this->email;
            $client->currency_iso_code = $currency->iso_code;
            $client->setAutologin();
            $client->setTypeAttribute(Client::TYPE[1]);

        }else{
            $type = $client->getTypeAttribute();
            if(!in_array(Client::TYPE[1], $type)) {
                $client->setTypeAttribute(array_merge($type, [Client::TYPE[1]]));
            }
        }

        $client->catalog_user_id = $this->id;
        $client->save();
        return $client;
    }

    /**
     * Get the class name identifier for polymorphic resolution.
     */
    public function getNameClass(): string
    {
        return 'CatalogUser';
    }

    /**
     * Get avatar URL (alias for getLastFile for compatibility with UserResource).
     */
    public function getAvatar($isLink = false)
    {
        return $this->getLastFile($isLink);
    }
}
