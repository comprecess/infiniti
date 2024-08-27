<?php


namespace App\Models\Traits;


use App\Models\Resident\Settings\Tag;

trait TagsTrait
{
    public function tagsModel()
    {
        return $this->morphToMany(Tag::class, 'taggable', 'gable_tag', relatedPivotKey: 'tag_id');
    }

    public function setTag(array $data)
    {
        $tags = collect([]);
        foreach($data as $value) {
            $tag = Tag::where('text', $value)->first();
            if(!$tag) {
                $tag = new Tag();
                $tag->text = $value;
                $tag->type = $this->nameClass ?? self::class;
                $tag->save();
            }
            $tags->push($tag);
        }

        $this->tagsModel()->sync($tags->pluck('id'));

    }
}
