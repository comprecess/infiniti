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

    public function deleteDocument($id)
    {
        $document = $this->documents()->where('ib_doc_rel.did', $id)->first();
        if(!$document) {
            return false;
        }
        $subscriptions = $document->subscriptions()->where(function($query){
            $query->where('rtype', '!=', $this->documentName)
                ->where('rid', '!=', $this->id);
        });

        if(!$subscriptions->count()) {
            $document->delete();
        }

        $this->documents()->detach([$id]);
        return true;
    }
}
