@php
    $tems = isset($hour);
    $data = $meeting->service_response;
    $url = \Illuminate\Support\Arr::get($data, 'data.join_url', '#');
    $date = $meeting->date;
    $date->setTimezone($meeting->timezone)
@endphp
@extends('emails.template.template')

@section('content')
    @if($tems)
    <h1>
        Meeting reminder
    </h1>
    <p>
        {{__('meeting.mail.reminder'.$hour)}}
    </p>

    @else
        <h1>
            A meeting is scheduled
        </h1>
        <p>
            {{__('meeting.mail.reminder')}}
        </p>
    @endif
    <p><b>Venue:</b> <a href="{{$url}}">{{$url}}</a></p>
    <p><b>Date:</b> {{$date->toRfc2822String()}}</p>
@endsection
