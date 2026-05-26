<?php
/**
 * Template Name: Контакты
 */
get_header(); ?>

<section class="sakura-page-hero contacts-hero">
    <div class="container">
        <span class="section-badge">お問い合わせ</span>
        <h1 class="page-hero-title">Контакты</h1>
        <p class="page-hero-subtitle">Мы всегда рады вас видеть</p>
    </div>
</section>

<section class="contacts-section">
    <div class="container">
        <div class="contacts-grid">
            <div class="contacts-info">
                <div class="contact-card">
                    <div class="contact-icon">📍</div>
                    <div>
                        <h3>Адрес</h3>
                        <p>123056, г. Москва<br>ул. Красина д.7 стр.1</p>
                        <p class="contact-detail">Станция метро «Маяковская»</p>
                    </div>
                </div>
                <div class="contact-card">
                    <div class="contact-icon">📞</div>
                    <div>
                        <h3>Телефоны</h3>
                        <p><a href="tel:+79153873651">+7 (915) 387-36-51</a></p>
                        <p><a href="tel:+79037918585">+7 (903) 791-85-85</a></p>
                    </div>
                </div>
                <div class="contact-card">
                    <div class="contact-icon">✉️</div>
                    <div>
                        <h3>Электронная почта</h3>
                        <p><a href="mailto:office@sakura-restaurant.ru">office@sakura-restaurant.ru</a></p>
                    </div>
                </div>
                <div class="contact-card">
                    <div class="contact-icon">🕐</div>
                    <div>
                        <h3>Часы работы</h3>
                        <p>Пн — Вс: 12:00 — 23:00</p>
                    </div>
                </div>
                <div class="contact-card">
                    <div class="contact-icon">💬</div>
                    <div>
                        <h3>Социальные сети</h3>
                        <p>
                            <a href="https://vk.com/sakurarestaurant" target="_blank">ВКонтакте</a> · 
                            <a href="https://t.me/+IENKtlrabEsyZWYy" target="_blank">Telegram</a> · 
                            <a href="http://wa.me/79037918585" target="_blank">WhatsApp</a>
                        </p>
                    </div>
                </div>
                <div class="contact-card contact-card-legal">
                    <div class="contact-icon">🏢</div>
                    <div>
                        <h3>Реквизиты</h3>
                        <p>ООО «Фуд Технолоджи»<br>
                        ИНН 7714895127 / ОГРН 1137746027210</p>
                    </div>
                </div>
            </div>
            <div class="contacts-map">
                <h3 class="map-title">Как нас найти</h3>
                <p class="map-directions">Выход из метро «Маяковская» в сторону улицы Красина, далее 3 минуты пешком.</p>
                <div class="map-container">
                    <iframe 
                        src="https://yandex.ru/map-widget/v1/?ll=37.594407%2C55.768735&z=16&l=map&pt=37.594407%2C55.768735%2Cpm2rdm"
                        width="100%" 
                        height="400" 
                        frameborder="0"
                        allowfullscreen="true"
                        style="border-radius: 16px;">
                    </iframe>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
