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
}
