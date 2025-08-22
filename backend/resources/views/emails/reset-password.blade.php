@extends('emails.template.template')

@section('content')
    <p>Your Password has been reset to: <b>{{$password}}</b></br>
        Go to this link to login with new password <a href="{{$link}}">{{$link}}</a></p>
@endsection
