<?php

namespace App\Models\Resident\Settings;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    const TYPE = [
        'Contacts', 'Expense', 'Income', 'Transfer', 'Client'
    ];

    public $timestamps = false;

    protected $table = "sys_tags";

    public static function getForSelect($name)
    {
        return self::distinct()->select(['sys_tags.*'])
            ->leftJoin('gable_tag', 'gable_tag.tag_id', '=', 'sys_tags.id')
            ->where('gable_tag.taggable_type', $name)
            ->orderBy('sys_tags.text', 'asc')
            ->get();
    }

    public static function getForSelectByName($name)
    {
        return self::distinct()->select(['sys_tags.*'])
            ->where('sys_tags.type', $name)
            ->orderBy('sys_tags.text', 'asc')
            ->get();
    }

    public function setTag(array $data)
    {
        $tags = collect([]);
        foreach($data as $value) {
            $tag = self::where('text', $value)->first();
            if(!$tag) {
                $tag = new self();
                $tag->text = $value;
                $tag->type = $this->aliasName ?? self::class;
                $tag->save();
            }
            $tags->push($tag);
        }

        return $tags;
    }

}
