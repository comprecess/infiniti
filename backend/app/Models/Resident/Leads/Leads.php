<?php

namespace App\Models\Resident\Leads;

use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leads extends Model
{
    use HasFactory, UserTrait;

    protected $table = "crm_leads";

    protected $adminColumn = 'aid';

}
