<?php

return [
    'project' => [
        'create' => '(:userUsertype) :userAccount [ID::userId], created a project [ID::projectId];',
        'edit' => '(:userUsertype) :userAccount [ID::userId], сhanged the project [ID::projectId];',
        'delete' => '(:userUsertype) :userAccount [ID::userId], deleted the project [ID::projectId];',
        'addFile' => '(:userUsertype) :userAccount [ID::userId], added a file to the project [ID::projectId];',
        'fileName' => ' File name: :fileName, ID: :fileId;',
        'addExpenses' => '(:userUsertype) :userAccount [ID::userId], added expense;',
        'transaction' => 'Transaction [ID::id]',
        'deleteFile' => '(:userUsertype) :userAccount [ID::userId], deleted a file from the project [ID::projectId];',
    ],
    'task' => [
        'create' => '(:userUsertype) :userAccount [ID::userId], created a new task [ID::taskId];',
        'edit' => '(:userUsertype) :userAccount [ID::userId], changed the task [ID::taskId];',
        'delete' => '(:userUsertype) :userAccount [ID::userId], deleted the task [ID::taskId];',
        'updateStatus' => '(:userUsertype) :userAccount [ID::userId], сhanged the task status [ID::taskId];',
        'updateStatusName' => ' Name status: :statusName, position: :statusPosition;',
        'ganttChart' => '(:userUsertype) :userAccount [ID::userId], changed the task [ID::taskId] timeframe via ganttChart;',
        'addTime' => '(:userUsertype) :userAccount [ID::userId], recorded time on task [ID::taskId];',
        'editTime' => '(:userUsertype) :userAccount [ID::userId], changed time entry on task [ID::taskId];',
        'deleteTime' => '(:userUsertype) :userAccount [ID::userId], deleted time from the task [ID::taskId];',
        'time' => ' Entry [ID::id]: :time logged. Task: :task_name. Description: :description',
    ],
    'personal' => [
        'new' => 'Added staff: :staff;',
        'del' => 'Remote staff: :staff;',
    ]
];
