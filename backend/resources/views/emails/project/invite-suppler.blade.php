@php
    $url = $client->getAutologinUrlFrontend();
@endphp
@extends('emails.template.template')

@section('content')
    <p>Dear {{$client->account}},</p>
    @if($client->companyClient)
        <p>Welcome to {{$client->companyClient?->company_name}}.</p>
    @endif
    <p>You have been invited to the project.</p>
    @if($url)
    <p>---------------------------------------------------------------------------------------</p>
    <p>You can view it in person in your personal account via automatic access:<br> <a href="{{$url}}">{{$url}}</a></p>
    <p>----------------------------------------------------------------------------------------</p>
    @endif
    <p>We very much appreciate you for choosing us.</p>
    @if($client->companyClient)
        <p>{{$client->companyClient?->company_name}} Team</p>
    @endif
@endsection
