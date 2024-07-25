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
}
