<table width="100%">
    <tr>
        <td style="border: 0;  text-align: left" >
            <span style="font-size: 18px; color: #2f4f4f"><strong>{{$nameModel}} # {{$codeModel}}</strong></span>
        </td>
        <td style="border: 0;  text-align: right">
            <img id="image" style="width: 160px;" src="{{public_path('style/img/logo.svg')}}" alt="logo" />
            <br>
            {!! $config::get('caddress') !!}
        </td>
    </tr>
</table>
