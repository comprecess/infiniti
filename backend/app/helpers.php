<?php

function sysconf($name, $def = null)
{
    $value = config("appconf.{$name}", null);
    return \App\Models\Config::get($name, $value ?? $def);
}

function frontLink($url)
{
    return config('app.front_url') . $url;
}
