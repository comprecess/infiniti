<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        /** { font-family: dejavusanscondensed, DejaVu Sans, sans-serif; }*/

        @font-face {
            font-family: 'DejaVu Sans';
            src: url({{public_path('/style/font/dejavusans/DejaVuSansCondensed.woff2')}}) format('woff2'), url({{public_path('/style/font/dejavusans/DejaVuSansCondensed.woff')}}) format('woff');
            font-weight: 400;
            font-style: normal;
        }

        @font-face {
            font-family: 'dejavusanscondensed';
            src: url({{public_path('/style/font/dejavu/DejaVuSerifCondensed.woff')}}) format('woff');
        }

        @font-face {
            font-family: 'dejavusanscondensed';
            src: url({{public_path('/style/font/dejavu/DejaVuSerifCondensed-Bold.woff')}}) format('woff');
            font-weight: bold;
        }

        @font-face {
            font-family: 'dejavusanscondensed';
            src: url({{public_path('/style/font/dejavu/DejaVuSerifCondensed-Italic.woff')}}) format('woff');
            font-style: italic;
        }

        @font-face {
            font-family: 'dejavusanscondensed';
            src: url({{public_path('/style/font/dejavu/DejaVuSerifCondensed-BoldItalic.woff')}}) format('woff');
            font-style: bold, italic;
        }
        * {
            font-size: 13px;
            font-family: dejavusanscondensed, DejaVu Sans, sans-serif;
            letter-spacing: 0px;
            line-height: 14px;
        }

        /*#page-wrap { width: 800px; margin: 0 auto; }*/

        table { border-collapse: collapse; }
        table td, table th { border: 1px solid black; padding: 5px; }


        #customer { overflow: hidden; }

        #logo { text-align: right; float: right; position: relative; margin-top: 25px; border: 1px solid #fff; max-width: 540px; overflow: hidden; }

        /*#meta { margin-top: 1px; width: 100%; float: right; }*/
        /*#meta td { text-align: right;  }*/
        /*#meta td.meta-head { text-align: left; background: #eee; }*/
        /*#meta td textarea { width: 100%; height: 20px; text-align: right; }*/

        #items { clear: both; width: 100%; margin: 30px 0 0 0; border: 1px solid black; }
        #items th { background: #eee; }
        #items textarea { width: 80px; height: 50px; }
        #items tr.item-row td {  vertical-align: top; }
        #items td.description { width: 300px; }
        #items td.item-name { width: 175px; }
        #items td.description textarea, #items td.item-name textarea { width: 100%; }
        #items td.total-line { border-right: 0; text-align: right; }
        #items td.total-value { border-left: 0; padding: 10px; }
        #items td.total-value textarea { height: 20px; background: none; }
        #items td.balance { background: #eee; }
        #items td.blank { border: 0; }
        .meta-head{background: #EEEEEE}

        #terms { text-align: left; margin: 20px 0 0 0; }
        #terms h5 { text-transform: uppercase; font-size: 13px; letter-spacing: 10px; border-bottom: 1px solid black; padding: 0 0 8px 0; margin: 0 0 8px 0; }
        #terms textarea { width: 100%; text-align: center;}

        @if(@$rtl == 1)

        html body {
            direction: rtl;
        }
        table td, table th {
            text-align: right;
        }

        @else

            #items td.blank { border: 0; }

        @endif

    </style>
</head>
<body>

@yield('content')

</body>
</html>
