<?php


namespace App\Models\Traits;


use App\Models\Resident\Document;

trait DocumentTrait
{
    public function documents()
    {
        return $this->belongsToMany(Document::class, 'ib_doc_rel', 'rid', 'did')
            ->withPivot(['rtype', 'can_download']);
    }
}
