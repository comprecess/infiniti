<?php


namespace App\Http\Resources\Traits;


trait PropValuesTrait
{
    public function getPropValues($nameId, $type = 1)
    {
        if(!$this->props) {
            $this->props = $this->getPropsByNameId();
        }
        $propValues = $this->props->where('id_name', $nameId)->first()?->values ?? collect([]);

        return match($type) {
            1 => $propValues->first()?->value,
            2 => $propValues->last()?->value,
            default => $propValues,
        };
    }
}
