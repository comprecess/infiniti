<?php

    return [
        'Meeting' => "You have an appointment for the meeting, it will take place on <b>:date</b> at the link <a href=\":link\">:link</a>",
        'fail' => [
            'Meeting' => "You have a meeting, but something went wrong"
        ],
        'delete' => [
            'Meeting' => "The meeting was deleted",
        ],
        'title' => [
            'Meeting' => "New meeting!"
        ],
        'push' => [
            'create' => [
                'Meeting' => "New meeting",
            ],
            'delete' => [
                'Meeting' => "The meeting was deleted",
            ],
            'update' => [
                'Meeting' => "The meeting details have been updated.",
            ],
        ],
        'Offer' => [
            'action' => '<p>You need to perform an action on the offer :code, Details: <a href=\":link\">:link</a></p>',
            'actionPush' => 'You need to perform an action on the offer :code',
        ],
        'Invoice' => [
            'action' => '<p>You have been invoiced for :summa. <br>Please pay by :date.<br>Invoice: <a href=\":link\">:link</a></p>',
            'actionPush' => 'You have been invoiced for :summa. Please pay by :date.',
        ],
        'CatalogUser' => [
            'newCount' => 'In the last :day days were added: :count talent',
        ]
    ];
