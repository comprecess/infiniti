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
            <td width="40">{{$d->code}}</td>
            <td width="40">{{$d->date}}</td>
            <td width="25">{{$d->account}}</td>
            <td width="40">{{$d->type}}</td>
            <td width="25">{{$d->amount}}</td>
            <td width="25">{{$d->description}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
