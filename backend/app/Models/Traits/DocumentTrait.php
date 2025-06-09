<?php


namespace App\Models\Traits;


use App\Models\Resident\Document;

trait DocumentTrait
{
    public function documents()
    {
        $belongs = $this->belongsToMany(Document::class, 'ib_doc_rel', 'rid', 'did')
            ->withPivot(['rtype', 'can_download']);

        if($this->documentName) {
            $belongs->where('ib_doc_rel.rtype', $this->documentName);
        }

        return $belongs;
    }
}
