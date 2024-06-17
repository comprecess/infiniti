<?php

namespace App\Models\Catalog;

use App\Models\Users\Client;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class User extends Model
{
    use HasFactory;

    protected $table = 'catalog_user';
    public $timestamps = false;

    protected $casts = [
        'start' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(Client::class, 'id_client');
    }

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

    public function getPropsByNameId(array $nameId = null)
    {
        $values = $this->values->load(['prop']);
        $props = $values->pluck('prop')->unique('id')->map(function($item) use ($values){
            $item->values = collect($values->where('id_prop', $item->id)->all());
            return $item;
        });

        if($nameId) {
            $props = $props->whereIn('id_name', $nameId);
        }

        return $props;
    }

//    public function getPropsByNameId(array $nameId = null)
//    {
//        $propQuery = Prop::select('*');
//        if($nameId) {
//            $propQuery->whereIn('id_name', $nameId);
//        }
//        $props = $propQuery->get();
//
//        $props->map(function($item){
//            $item->
//        });
//
//    }

    public function getAvailable() :array
    {
        $now = now();
        $message = null;
        $return = ['status' => true, 'message' => 'in stock', 'date' => $this->start?->format('m/d/Y')];

        if(!$this->start || $now > $this->start) {
            return $return;
        }

        $return['status'] = false;

        $nextWeek = $now->next(Carbon::MONDAY);

        if($this->start < $nextWeek) {
            $return['message'] = 'this week';
            return $return;
        }

        if($this->start < $nextWeek->next(Carbon::MONDAY)) {
            $return['message'] = 'next week';
            return $return;
        }

        $diff = $this->start->diff($now);
        $mounth = $diff->format('%m');

        if($mounth) {
            $return['message'] = 'more than a month';
            return $return;
        } else {
            $return['message'] = 'less than a month';
            return $return;
        }
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

    public function getExpirence() :array
    {
        $result = ['year' => 0, 'month' => 0, 'day' => 0];
        $exp = [];
        $blocks = $this->blockExperience;

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

        return $result;
    }

}
