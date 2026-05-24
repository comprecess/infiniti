<?php
/**
 * Sakura Theme Customizer
 */

function sakura_customize_register($wp_customize) {
    // Hero Section
    $wp_customize->add_section('sakura_hero', array(
        'title'    => __('Главный баннер', 'sakura-theme'),
        'priority' => 30,
    ));

    $wp_customize->add_setting('sakura_hero_title', array(
        'default'           => 'Цветение сакуры',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('sakura_hero_title', array(
        'label'   => __('Заголовок', 'sakura-theme'),
        'section' => 'sakura_hero',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('sakura_hero_subtitle', array(
        'default'           => '桜の花',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('sakura_hero_subtitle', array(
        'label'   => __('Подзаголовок (японский)', 'sakura-theme'),
        'section' => 'sakura_hero',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('sakura_hero_text', array(
        'default'           => 'Изысканная японская кухня в атмосфере цветущей сакуры. Свежайшие ингредиенты, традиционные рецепты и современная подача.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('sakura_hero_text', array(
        'label'   => __('Описание', 'sakura-theme'),
        'section' => 'sakura_hero',
        'type'    => 'textarea',
    ));

    $wp_customize->add_setting('sakura_hero_image', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'sakura_hero_image', array(
        'label'   => __('Фоновое изображение', 'sakura-theme'),
        'section' => 'sakura_hero',
    )));

    // About Section
    $wp_customize->add_section('sakura_about', array(
        'title'    => __('О ресторане', 'sakura-theme'),
        'priority' => 35,
    ));

    $wp_customize->add_setting('sakura_about_title', array(
        'default'           => 'Наша философия',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('sakura_about_title', array(
        'label'   => __('Заголовок', 'sakura-theme'),
        'section' => 'sakura_about',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('sakura_about_text', array(
        'default'           => 'Мы верим, что еда — это искусство. Каждое блюдо в нашем ресторане создаётся с любовью и уважением к японским традициям, которые передаются из поколения в поколение.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('sakura_about_text', array(
        'label'   => __('Текст', 'sakura-theme'),
        'section' => 'sakura_about',
        'type'    => 'textarea',
    ));

    $wp_customize->add_setting('sakura_about_image', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'sakura_about_image', array(
        'label'   => __('Изображение', 'sakura-theme'),
        'section' => 'sakura_about',
    )));

    // Contact Section
    $wp_customize->add_section('sakura_contact', array(
        'title'    => __('Контакты', 'sakura-theme'),
        'priority' => 40,
    ));

    $wp_customize->add_setting('sakura_phone', array(
        'default'           => '+7 (999) 123-45-67',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('sakura_phone', array(
        'label'   => __('Телефон', 'sakura-theme'),
        'section' => 'sakura_contact',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('sakura_address', array(
        'default'           => 'ул. Сакуры, 1, Москва',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('sakura_address', array(
        'label'   => __('Адрес', 'sakura-theme'),
        'section' => 'sakura_contact',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('sakura_hours', array(
        'default'           => 'Пн-Вс: 11:00 — 23:00',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('sakura_hours', array(
        'label'   => __('Часы работы', 'sakura-theme'),
        'section' => 'sakura_contact',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('sakura_email', array(
        'default'           => 'info@sakura-restaurant.ru',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('sakura_email', array(
        'label'   => __('Email', 'sakura-theme'),
        'section' => 'sakura_contact',
        'type'    => 'email',
    ));
}
add_action('customize_register', 'sakura_customize_register');
