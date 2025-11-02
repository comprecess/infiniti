<?php

namespace App\Models\Resident;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    const TYPE = ['block','question','answer'];
    const FIELD = ['string','checkbox', 'radiobox', 'boolean'];


    public function children()
    {
        return $this->hasMany($this::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo($this::class, 'parent_id');
    }

    public function childrenRecursive()
    {
        return $this->hasMany($this::class, 'parent_id')->with(['childrenRecursive']);
    }

    public function parentRecursive()
    {
        return $this->belongsTo($this::class, 'parent_id')->with(['parentRecursive']);
    }

    public function getValue($value)
    {
        $value = is_array($value) ? $value : [$value];
        if($this->type == self::TYPE[1]) {
            if($this->field == self::FIELD[0]) {
                return $value[0];
            }

            if($this->field == self::FIELD[1]) {
                return __($this->children->where('id', $value[0])->first()?->key_lang . ".text");
            }

            if($this->field == self::FIELD[2]) {
                $val = [];
                foreach($value as $v){
                    $val[] = __($this->children->where('id', $v)->first()?->key_lang. ".text");
                }
                return $val;
            }
        }

        return null;
    }
}
