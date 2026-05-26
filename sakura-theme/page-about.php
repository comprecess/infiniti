<?php
/**
 * Template Name: О нас
 */
get_header(); ?>

<section class="sakura-page-hero about-hero">
    <div class="container">
        <span class="section-badge">私たちについて</span>
        <h1 class="page-hero-title">О нашем ресторане</h1>
        <p class="page-hero-subtitle">Искусство японской кухни в сердце Москвы</p>
    </div>
</section>

<section class="about-philosophy">
    <div class="container">
        <div class="about-philosophy-grid">
            <div class="about-philosophy-text">
                <h2>Наша философия</h2>
                <p class="about-lead">Мы верим, что еда — это искусство. Каждое блюдо в нашем ресторане создаётся с любовью и уважением к японским традициям, которые передаются из поколения в поколение.</p>
                <p>Ресторан «Цветение сакуры» — это место, где встречаются Восток и Запад. Мы сочетаем аутентичные японские рецепты с лучшими свежими ингредиентами, создавая блюда, которые радуют и глаз, и вкус.</p>
                <p>Наши шеф-повара прошли обучение в Японии и привезли с собой не только рецепты, но и философию — уважение к продукту, внимание к деталям и стремление к совершенству в каждом движении.</p>
            </div>
            <div class="about-philosophy-image">
                <?php 
                $about_img = get_theme_mod('sakura_about_image', '');
                if ($about_img) : ?>
                    <img src="<?php echo esc_url($about_img); ?>" alt="Наша философия" loading="lazy">
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<section class="about-features">
    <div class="container">
        <h2 class="section-title">Чем мы отличаемся</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🌸</div>
                <h3>Свежие ингредиенты</h3>
                <p>Ежедневная доставка рыбы и морепродуктов от проверенных поставщиков. Мы не используем замороженные продукты для суши и сашими.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">👨‍🍳</div>
                <h3>Мастера своего дела</h3>
                <p>Наши шеф-повара прошли стажировку в Токио и Осаке. Каждый ролл — результат многолетнего опыта и любви к японской кухне.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎋</div>
                <h3>Атмосфера Японии</h3>
                <p>Интерьер ресторана создан японскими дизайнерами. Натуральные материалы, мягкий свет и живые растения переносят вас в Киото.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🍶</div>
                <h3>Авторские напитки</h3>
                <p>Коллекция саке, японского виски и авторских коктейлей с восточными нотками — идеальное дополнение к вашему ужину.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🚀</div>
                <h3>Быстрая доставка</h3>
                <p>Доставляем по Москве за 45-60 минут. Специальная упаковка сохраняет температуру и свежесть каждого блюда.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">💝</div>
                <h3>Внимание к деталям</h3>
                <p>От подачи до обслуживания — мы заботимся о каждой мелочи, чтобы ваш визит стал незабываемым.</p>
            </div>
        </div>
    </div>
</section>

<section class="about-reviews">
    <div class="container">
        <h2 class="section-title">Отзывы наших гостей</h2>
        <p class="section-subtitle">Что говорят о нас</p>
        <div class="reviews-grid">
            <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">«Лучшие суши в Москве! Приходим сюда каждую пятницу всей семьёй. Свежайшая рыба, потрясающая подача и невероятно уютная атмосфера.»</p>
                <div class="review-author">
                    <strong>Анна К.</strong>
                    <span>Постоянный гость</span>
                </div>
            </div>
            <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">«Заказываю доставку уже год — качество всегда на высоте. Роллы приезжают свежими и красивыми, как в ресторане. Отдельное спасибо за скорость!»</p>
                <div class="review-author">
                    <strong>Дмитрий М.</strong>
                    <span>Клиент доставки</span>
                </div>
            </div>
            <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">«Отмечали здесь день рождения — всё было идеально. Персонал помог с выбором блюд, порекомендовал отличное саке. Обязательно вернёмся!»</p>
                <div class="review-author">
                    <strong>Елена В.</strong>
                    <span>Гость ресторана</span>
                </div>
            </div>
            <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">«Как японист, могу сказать — здесь готовят аутентично. Рамен как в Токио, гёдза как в Осаке. Чувствуется, что повара знают своё дело.»</p>
                <div class="review-author">
                    <strong>Михаил С.</strong>
                    <span>Знаток японской кухни</span>
                </div>
            </div>
            <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">«Сеты — это просто находка! Огромные порции, разнообразие и всё свежее. Сет Нара — наш фаворит. Рекомендую всем!»</p>
                <div class="review-author">
                    <strong>Ольга Т.</strong>
                    <span>Постоянный клиент</span>
                </div>
            </div>
            <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">«Прекрасное место для романтического ужина. Приглушённый свет, живые цветы сакуры, внимательный персонал. Атмосфера на 10 из 10.»</p>
                <div class="review-author">
                    <strong>Алексей Р.</strong>
                    <span>Гость ресторана</span>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
