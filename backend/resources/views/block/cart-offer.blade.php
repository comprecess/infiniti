@php
    $values = $userCatalog->values;
    $spec = $values->where('prop.id_name', 'specialization')->first()?->value;
@endphp
<p>
    <b>Name:</b> {{$userCatalog->name}} [ID:{{$userCatalog->id}}]<br>
    <b>Specialization:</b> {{$spec}}<br>
    <b>Pay:</b> {{__('resident.typePrice.' . $item->name_id_type)}}<br>
</p>
