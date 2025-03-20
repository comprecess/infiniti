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

function array_percentage($arr, $round = 1)
{
    $total = array_sum($arr);

    $ret = [];

    foreach ($arr as $key => $value) {
        if ($value == 0) {
            $ret[$key] = 0;
        } else {
            $ret[$key] = round(
                ($value / $total) * 100,
                $round
            );
        }
    }

    return $ret;
}
