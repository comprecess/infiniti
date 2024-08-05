<?php

namespace App\Models\Resident\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomFields extends Model
{
    use HasFactory;

    protected $table = 'crm_customfields';

    public $timestamps = false;

    public function setShowinvoiceAttribute($value) {
        $this->attributes['showinvoice'] = $value ? "Yes" : "No";
    }

    public function getShowinvoiceAttribute($value) {
        return $value == "Yes" ? 1 : 0;
    }

    public function setFieldoptionsAttribute($value) {
        $this->attributes['fieldoptions'] = $value ? implode(',', $value) : null;
    }

    public function getFieldoptionsAttribute($value) {
        if(!$value) {
            return null;
        }
        $options = explode(',', $value);
        $options = array_map(function($v){return trim($v);}, $options);
        return $options;
    }

    public function values()
    {
        return $this->hasMany(CustomFieldsValues::class, 'fieldid');
    }

    public static function getForSelect()
    {
        return self::orderBy('id')->get();
    }

}
