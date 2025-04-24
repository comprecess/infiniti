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

    public static function setTag(array|string $data, $data_string_separator = ',', $type = null)
    {
        $tags = collect([]);
        if(!is_array($data)) {
            $data = explode($data_string_separator, $data);
        }

        foreach($data as $value) {
            $value = trim($value);
            $tagQuery = self::where('text', $value);
            if($type){
                $tagQuery->where('type', $type);
            }

            $tag = $tagQuery->first();
            if(!$tag) {
                $tag = new self();
                $tag->text = $value;
                $tag->type = $type;
                $tag->save();
            }
            $tags->push($tag);
        }

        return $tags;
    }

}
