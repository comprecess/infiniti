<?php

namespace App\Models\Resident;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Traits\BootTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\UserTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\FileStorageTrait;
use App\Models\Resident\Project\Project;

class Document extends Model implements InsertDefaultValueInterface
{
    use HasFactory, FileStorageTrait, InsertDefaultValueTrait, UserTrait, BootTrait;

    const TYPE_CONTACT = 'contact';
    const TYPE_PROJECT = 'project';

    const WITH_MODEL = [
        'invoice' => Invoice::class,
        'project' => Project::class
    ];

    public $table = 'sys_documents';

    public $adminColumn = 'aid';

    protected $casts = [
        'updated_at' => 'datetime',
    ];

    public function subscriptions()
    {
        return $this->hasMany(DocumentSubscribe::class, 'did');
    }

    public function clients()
    {
        return $this->belongsToMany(Client::class, 'ib_doc_rel',  'did', 'rid',)
            ->withPivot(['rtype', 'can_download']);
    }

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
        // Prefer FileStorage link (uses /file/{hash} route, works without auth)
        $file = $this->files()->first();
        if ($file) {
            return $file->getLink();
        }
        // Fall back to document token (uses /document/{token} route, requires auth)
        return $this->file_dl_token;
    }
}
