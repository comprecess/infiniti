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
            @if($url = $d->client?->getLastFile(true))
                <td height="50" width="25"></td>
            @else
                <td width="25"></td>
            @endif
            <td width="40">{{$d->client?->account}} <br> {{$d->client?->code}}</td>
            <td width="40">{{$d->companyClient?->company_name}}</td>
            <td width="25">{{$this->businessModel?->title,}}</td>
            <td width="40">{{$d->company_name}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
