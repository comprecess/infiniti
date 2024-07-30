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
            @foreach($varibles->columns as $key => $column)
                <td width="{{$varibles->columnWidths[$key] ?? 50}}" height="{{$varibles->columnHeight[$key] ?? 50}}">{!! $d->{$key} !!}</td>
            @endforeach
        </tr>
    @endforeach
    </tbody>
</table>
