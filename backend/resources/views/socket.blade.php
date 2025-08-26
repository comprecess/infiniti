@php
$token = $token ?? "d027c153d79a041f91776696bcc94576996dc48c492f5a461f4d64dbd764d1f0";
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>

</head>
<body class="antialiased">

<script>
    var connect = new WebSocket('ws://p1.loc:8080');
    // var connect = new WebSocket('ws://127.0.0.1:8080');
    console.log(connect);
    connect.onopen = function(e){
        console.log('open');
        // connect.send('Welcome!');
    }

    connect.onmessage = function (e) {
        console.log(e.data);
    }

    var data = {
        'c': 'identification',
        'm': 'user',
        'data':{
            'token': 'test'
        }
    };

    // connect.send(JSON.stringify(data));

    setTimeout(function(){
        console.log('send');
        connect.send('{"c":"auth","data":{"token":"{{$token}}"}}');
    }, 3000)

    setTimeout(function(){
        console.log('send');
        connect.send('{"c":"notification","data":{"token":"{{$token}}"}}');
    }, 6000)
</script>
</body>
</html>
