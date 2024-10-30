<table>
    <thead>
    <tr>
        @foreach($varibles->columns as $column)
            <th>{{$column}}</th>
        @endforeach
    </tr>
    </thead>
    <tbody>
    @foreach($data as $d)
        @php
        $user = $d->user;
        $prop = $d->getPropsByNameId();
        $priceHour = (float) $prop->where('id_name', 'priceHour')?->first()?->values->first()?->value;
        $priceDay = (float) $prop->where('id_name', 'priceDay')?->first()?->values->first()?->value;
        @endphp
        <tr>
            @if($url = $d->getLastFile(true))
                <td height="50" width="25"></td>
            @else
                <td width="25"></td>
            @endif
            <td width="40">{{$d->name}}</td>
            <td width="40">{{$prop->where('id_name', 'specialization')?->first()?->values->first()?->value}}</td>
            <td width="25">{{$prop->where('id_name', 'lvl')?->first()?->values->first()?->value}}</td>
            <td width="40">{{$user ? $user->printPrice($priceHour) : $priceHour }}</td>
            <td width="25">{{$user ? $user->printPrice($priceDay) : $priceDay}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
