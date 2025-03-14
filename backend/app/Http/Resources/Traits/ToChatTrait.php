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
            $keyValue = Arr::get($data, "{$key}.parse.0", Arr::get($names, $key, $key));
            try {
                if(is_object($value)) {
//                    dd(method_exists($value, 'toChatCollection'));
//                    dd(self::toChatCollection($value->resource));
//                    $resultArray[] = $keyValue . ": \n" . $value::toChatCollection($value);
                    $resultArray[] = $keyValue . ": \n";
                }else{
                    $resultArray[] = $keyValue . ": " . $value;
                }
            }catch (\Exception $e) {
                dd($e->getMessage(), $value);
            }
        }

        return implode("\n", $resultArray);
    }

    public static function toChatCollection($query, mixed $data = null)
    {
        $resorces = self::collection($query);
        $resultArray = [];
        foreach($resorces as $resorce) {
            $value = $resorce->toChat();
            $resultArray[] = $value ."\n";
        }

        return implode("\n", $resultArray);
    }
}
