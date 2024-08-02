<?php

namespace App\Models\Resident\Settings;

use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomFieldsValues extends Model
{
    use HasFactory;

    protected $table = 'crm_customfieldsvalues';

    public $timestamps = false;

    public function customFields()
    {
        return $this->belongsTo(CustomFields::class, 'fieldid');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'relid');
    }
}
