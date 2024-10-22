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


function snakeCaseToPascalCase($str)
{
    return lcfirst(preg_replace_callback("/(?:^|_)([a-z])/", function($matches) {
        return strtoupper($matches[1]);
    }, $str));
}

function pascalCaseToSnakeCase($str)
{
    return ltrim(strtolower(preg_replace('/[A-Z]([A-Z](?![a-z]))*/', '_$0', $str)), '_');
}
