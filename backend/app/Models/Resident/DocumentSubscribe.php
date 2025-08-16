<?php

namespace App\Models\Resident;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\FileStorageTrait;
use App\Models\Resident\Project\Project;

class DocumentSubscribe extends Model
{
    use HasFactory;

    public $table = 'ib_doc_rel';

}
