@extends('emails.template.template')

@section('content')
    <p>Your Password has been reset to: {{$password}} Go to this link to login with new password  <a href="{{$link}}">{{$link}}</a></p>
@endsection
