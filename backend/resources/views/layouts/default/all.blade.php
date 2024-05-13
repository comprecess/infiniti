<!DOCTYPE html>
<html lang="ru">
<head>
    <META http-equiv="content-type" content="text/html; charset=utf-8">
    <title>IFINITI</title>
    <meta name="viewport" content="width=device-width">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @stack('header')
</head>
<body>
<div class="container">
    @yield('content')
</div>
@stack('end-body')
</body>
</html>
