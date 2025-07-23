@php
    $url = frontLink('/auth/sign/in');
@endphp
@extends('emails.template.template')

@section('content')
    <p>Dear {{$client->account}},</p>
    @if($client->companyClient)
    <p>Welcome to {{$client->companyClient?->company_name}}.</p>
    @endif
    <p>You can track your billing, profile, transactions from this portal.</p>
    <p>Your login information is as follows:</p>
    <p>---------------------------------------------------------------------------------------</p>
    <p>Login URL: <a href="{{$url}}">{{$url}}</a> <br />Email Address: {{$client->email}}<br /> Password: @if($password) {{$password}} @else Your chosen password. @endif</p>
    <p>----------------------------------------------------------------------------------------</p>
    <p>We very much appreciate you for choosing us.</p>
    @if($client->companyClient)
    <p>{{$client->companyClient?->company_name}} Team</p>
    @endif
@endsection
