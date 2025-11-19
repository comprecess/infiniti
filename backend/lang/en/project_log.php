<?php

return [
    'project' => [
        'create' => '(:userUsertype) :userAccount [ID::userId], created a project [ID::projectId];',
        'edit' => '(:userUsertype) :userAccount [ID::userId], сhanged the project [ID::projectId];',
        'delete' => '(:userUsertype) :userAccount [ID::userId], deleted the project [ID::projectId];',
        'addFile' => '(:userUsertype) :userAccount [ID::userId], added a file to the project [ID::projectId];',
        'fileName' => ' File name: :fileName, ID: :fileId;'
    ],
    'task' => [
        'create' => '(:userUsertype) :userAccount [ID::userId], created a new task [ID::taskId];',
        'edit' => '(:userUsertype) :userAccount [ID::userId], changed the task [ID::taskId];',
        'delete' => '(:userUsertype) :userAccount [ID::userId], deleted the task [ID::taskId];',
        'updateStatus' => '(:userUsertype) :userAccount [ID::userId], сhanged the task status [ID::taskId];',
        'updateStatusName' => ' Name status: :statusName, position: :statusPosition;',
    ],
    'personal' => [
        'new' => 'Added staff: :staff;',
        'del' => 'Remote staff: :staff;',
    ]
];
