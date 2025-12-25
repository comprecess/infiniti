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
            color: #fff !important;
            box-sizing: border-box;
            font-family: Inter,sans-serif;
        }
        .body{
            background-color: #0f1119 !important;
            color: #fff !important;
        }
        .main{
            padding: 20px 20px 40px;
        }
        svg{
            width: 200px;
            height: 50px;
        }
        svg path{
            fill: #fff !important;
        }
        .content{
            margin: 20px 0;
            position: relative;
            padding: 16px 32px;
            border-radius: 8px;
            background-color: #151720 !important;
            overflow: hidden;
        }
        a{
            color: #666984 !important;
        }
        .footer{
            color: #666984 !important;
            font-size: 12px !important;
        }

        @media (prefers-color-scheme: dark) {
            * {
                color: #fff !important;
            }

            .body{
                background-color: #0f1119 !important;
                color: #fff !important;
            }

            svg path{
                fill: #fff !important;
            }

            .content{
                background-color: #151720 !important;
            }

            a{
                color: #666984 !important;
            }
            .footer{
                color: #666984 !important;
                font-size: 12px !important;
            }
        }

        @media (prefers-color-scheme: light) {
            * {
                color: #fff !important;
            }

            .body{
                background-color: #0f1119 !important;
                color: #fff !important;
            }

            svg path{
                fill: #fff !important;
            }

            .content{
                background-color: #151720 !important;
            }

            a{
                color: #666984 !important;
            }
            .footer{
                color: #666984 !important;
                font-size: 12px !important;
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
