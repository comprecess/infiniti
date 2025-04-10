<?php


namespace App\Services\Zoom\Requests;


class MeetingData extends Data
{
    protected function getListTag(): array
    {
        return [
            "agenda",       //описание
            "schedule_for", //Для кого заплонировать*
            "duration",     //продолжительность
            "settings",     //настройки
            "start_time",   //дата начала
            "timezone",     //тайм зона
            "topic",        //заголовок
            "type",         //тип
        ];
    }

    protected function default(): array
    {
        return [
            "duration" => 120,
            "settings" => [
                //alternative_hosts => "email1;email2",         //список альтернативных организаторов*
                "alternative_hosts_email_notification" => true, //отправка уведомление альтернативным организаторам
                "approval_type" => 2,                           //Регистрация на встречу, 2 - не требуется
                "authentication_exception" => [                 //Список учасников которые могут обойти аунтификацию*
                    ["email" => "jchill@example.com", "name" => "Jill Chill"]
                ],
                "breakout_room" => [                            //комната*
                    "enable" => true,                           //включение
                    "rooms" => [
                        [
                            "name" => "room-meeting",           //название
                            "participants" => [],               //список email адресов
                        ]
                    ]
                ],
                "calendar_type" => 2,                           //тип календаря, 2 - zoom + google
                "contact_email" => "",                          //Email для организации на встречу*
                "contact_name" => "",                           //Имя*
                "focus_mode" => false,                          //Фокусировка в начале встречи
                "host_video" => false,                          //Включать ли видео ведущего
                "jbh_time" => 10,                               //за сколько можно присоединится
                "join_before_host" => true,                     //за ранее присоединение
                "question_and_answer" => [                      //вопросы ответы
                    "enable" => true,
                    "allow_submit_questions" => true,           //участники могут отправлять вопросы
                    "allow_anonymous_questions" => true,
                    "question_visibility" => "all",
                    "attendees_can_comment" => true,
                    "attendees_can_upvote" => true
                ],
                "meeting_invitees" => [                         //Список приглашенных на встречу*
                    ["email" => ""]
                ],
                "mute_upon_entry" => true,                      //отключить звук при начале
                "participant_video" => false,                   //начать ли видео с включеным
                "private_meeting" => false,                     //Приватный ли встреча
                "registrants_confirmation_email" => true,       //Отправка регистратором по эл. почте
                "registrants_email_notification" => true,       //
                "show_share_button" => false,                   //кнопка соц. на регистрацию
                "watermark" => false,
                "alternative_host_update_polls" => false,
                "internal_meeting" => false,
                "continuous_meeting_chat" => [                  //Чат встречи
                    "enable" => true,
                    "auto_add_invited_external_users" => true,
                    "auto_add_meeting_participants" => true,
                    "who_is_added" => "all_users"
                ],
                "push_change_to_calendar" => true,              //отправка в календарь если произошли изменения
                "auto_start_ai_companion_questions" => false,   // АИ вопросы
                "device_testing" => true,                       //Тест оборудования
            ],
            "type" => 2,
        ];
    }
}
