<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style>
            * { font-family: DejaVu Sans, sans-serif; }
            h1{
                text-align: center;
            }
            th{
                background: #2D4154;
                text-align: center;
                color: #FFFFFF;
            }

            table {
                font-size: 10px;
            }

            table img {
                max-height: 50px;
            }
            table tbody:nth-child(2n) {
                background: #F3F3F3;
            }
        </style>
    </head>
    <body>
        <h1>{{$varibles->header}}</h1>
        <table>
            <thead>
                @foreach($varibles->columns as $column)
                    <th>{{$column}}</th>
                @endforeach
            </thead>
            @foreach($data as $d)
                <tbody>
                    @foreach($varibles->columns as $key => $column)
                        <td>{!! $d->{$key} !!}</td>
                    @endforeach
                </tbody>
            @endforeach
        </table>
    </body>
</html>
