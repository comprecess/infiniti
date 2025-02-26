@php
    $url = env('FRONT_URL');
@endphp
<html>
<head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap">
    <meta name="color-scheme" content="only light">
    <style>
{{--        @charset "UTF-8";
        @import"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap";
        @import"https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"; --}}
        :root {
            color-scheme: only light;
        }
        * {
            margin: 0;
            padding: 0;
            color: #fff;
            box-sizing: border-box;
            font-family: Inter,sans-serif;
        }
        .body{
            background-color: #0f1119;
            color: #fff;
        }
        .main{
            padding: 20px 20px 40px;
        }
        svg{
            width: 200px;
            height: 50px;
        }
        svg path{
            fill: #fff;
        }
        .content{
            margin: 20px 0;
            position: relative;
            padding: 16px 32px;
            border-radius: 8px;
            background-color: #151720;
            overflow: hidden;
        }
        a{
            color: #666984 !important;
        }
        .footer{
            color: #666984;
            font-size: 12px;
        }

        @media (prefers-color-scheme: dark) {
            * {
                color: #fff;
            }

            .body{
                background-color: #0f1119;
                color: #fff;
            }

            svg path{
                fill: #fff;
            }

            .content{
                background-color: #151720;
            }

            a{
                color: #666984 !important;
            }
            .footer{
                color: #666984;
                font-size: 12px;
            }
        }

        @media (prefers-color-scheme: light) {
            * {
                color: #fff;
            }

            .body{
                background-color: #0f1119;
                color: #fff;
            }

            svg path{
                fill: #fff;
            }

            .content{
                background-color: #151720;
            }

            a{
                color: #666984 !important;
            }
            .footer{
                color: #666984;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
<div class="body">
    <div class="main">
        <div class="header">
            <img src="https://console.infiniti.stream/image/logo.png" />
        </div>
        <div class="content">
            @yield('content')

        </div>
        <div class="footer">
        <p>This letter is automatically generated. Please do not reply to it. <br><a href="{{$url}}">Infiniti</a></p>
        </div>
    </div>
</div>
</body>
</html>
