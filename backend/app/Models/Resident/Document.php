<?php

namespace App\Models\Resident;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\FileStorageTrait;

class Document extends Model
{
    use HasFactory, FileStorageTrait;

    const TYPE_CONTACT = 'contact';
    const TYPE_PROJECT = 'project';

    public $table = 'sys_documents';
}
