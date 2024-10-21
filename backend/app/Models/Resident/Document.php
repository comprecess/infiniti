<?php

namespace App\Models\Resident;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\FileStorageTrait;

class Document extends Model implements InsertDefaultValueInterface
{
    use HasFactory, FileStorageTrait, InsertDefaultValueTrait, UserTrait;

    const TYPE_CONTACT = 'contact';
    const TYPE_PROJECT = 'project';

    public $table = 'sys_documents';

    public $adminColumn = 'aid';


    public function getDefault() :array
    {
        return [
            'relation_id' => [0],
            'file_owner' => [0],
            'file_dl_token' => [bin2hex(random_bytes(10))],
            'cid' => [0],
            'gid' => [0],
            'company_id' => [0],
            'aid' => [0],
            'customer_can_download' => [0],
            'trash' => [0],
            'archived' => [0],
            'is_global' => [0],
        ];
    }

    public function getLink()
    {
        return route('document_load', ['token' => $this->file_dl_token]);
    }
}
