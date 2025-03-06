<?php


namespace App\Http\Resources\Traits;


use Illuminate\Support\Arr;

trait ToChatTrait
{
    public function toChat(mixed $data = null) :string
    {
        $data = $data ?? [];
        $names = [];
        if(method_exists($this, 'namesToChat')) {
            $names = $this->namesToChat();
        }
        $result = $this->jsonSerialize();
        $resultArray = [];
        foreach($result as $key => $value) {
            $resultArray[] = Arr::get($data, "{$key}.parse.0", Arr::get($names, $key, $key)) . ": " . $value;
        }

        return implode("\n", $resultArray);
    }
}
