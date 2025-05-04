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
        <tr>
            <td width="40">{{$d->name}}</td>
            <td width="40">{{$d->date_purchased?->format(\App\Models\Config::get('df'))}}</td>
            <td width="25">{{$d->supported_until?->format(\App\Models\Config::get('df'))}}</td>
            <td width="40">{{$d->printPrice('price')}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
