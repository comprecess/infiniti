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
            @if($url = $d->getLastFile(true))
                <td height="50" width="25"></td>
            @else
                <td width="25"></td>
            @endif
            <td width="40">{{$d->account}} <br> {{$d->code}}</td>
            <td width="40">{{$d->companyClient?->company_name}}</td>
            <td width="25">{{$d->group?->gname}}</td>
            <td width="40">{{$d->email}}</td>
            <td width="25">{{$d->phone}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
