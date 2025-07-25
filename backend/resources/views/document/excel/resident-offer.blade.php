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
            <td width="40">{{$d->getCode()}}</td>
            <td width="40">{{$d->user?->account ?? '-'}}<br> {{$d->user?->companyClient?->company_name}}</td>
            <td width="25">{{$d->printPrice('total')}}</td>
            <td width="40">{{$d->date?->format('d/m/Y')}}</td>
            <td width="25">{{$d->duedate?->format('d/m/Y')}}</td>
            <td width="25">{{$d->stage}}</td>
            <td width="25">{{$d->r}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
