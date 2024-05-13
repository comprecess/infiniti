@extends('all')

@section('content')
<form method="post" action="{{route('login.post')}}">
    @csrf
    <input type="text" name="login">
    <input type="password" name="password">
    <input type="submit">
</form>
@endsection
