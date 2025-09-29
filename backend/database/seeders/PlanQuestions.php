<?php

namespace Database\Seeders;

use App\Models\Resident\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class PlanQuestions extends Seeder
{
    /**
     * Run the database seeds.
     */
    public $list = null;
    public $keys = null;

    public function run(): void
    {
        $this->keys = 'questions';
        $this->list = __($this->keys);
        foreach($this->list['block'] as $k1 => $block) {
            $questBlock = $this->create("{$this->keys}.block.{$k1}", title: $block, position: $k1);
            $this->question($k1, $questBlock->id);
        }
    }

    public function question($key, $parent = null, $name = Question::TYPE[1])
    {
        $k = "{$name}.{$key}";
        if($q = Arr::get($this->list, $k)){
            foreach($q as $k1 => $data) {
                $quest = $this->create("{$this->keys}.{$k}.{$k1}", type:  $name, field: $data['type'], description: $data['text'], position: $k1, parent: $parent);
                if($name == Question::TYPE[1] && !in_array($data['type'], ['string'])) {
                    $this->question("{$key}.{$k1}",$quest->id, Question::TYPE[2]);
                }
                if(isset($data['children'])) {
                    $this->question($data['children'], $quest->id);
                }

                if(isset($data['question']) && $name == Question::TYPE[2]) {
                    $this->question($data['question'], $quest->id);
                }
            }
        }
    }

    public function create($key, $type = Question::TYPE[0], $field = null, $title = null, $description = null, $position = 0, $parent = null)
    {
        return Question::create([
            'type' => $type,
            'key_lang' => $key,
            'lang' => 'ru',
            'title' => $title,
            'description' => $description,
            'field' => $field,
            'position' => $position,
            'parent_id' => $parent
        ]);
    }
}
