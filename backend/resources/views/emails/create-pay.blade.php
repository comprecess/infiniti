@php
    $host = env('FRONT_URL');
    $url = "{$host}/public/invoice/view/{$invoice->vtoken}";
@endphp
@extends('emails.template.template')

@section('content')
    <h1>
        The order has been formed!
    </h1>
    <p>
        You can see all the information about the order at the link: <a href="{{$url}}">{{$url}}</a>
    </p>
@endsection
