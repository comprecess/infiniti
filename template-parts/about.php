<?php
$about_title = get_theme_mod('sakura_about_title', 'Наша философия');
$about_text = get_theme_mod('sakura_about_text', 'Мы верим, что еда — это искусство. Каждое блюдо в нашем ресторане создаётся с любовью и уважением к японским традициям, которые передаются из поколения в поколение.');
$about_image = get_theme_mod('sakura_about_image', '');
?>

<section class="sakura-about" id="about">
    <div class="container">
        <div class="about-grid">
            <div class="about-image-col">
                <?php if ($about_image) : ?>
                    <img src="<?php echo esc_url($about_image); ?>" alt="<?php echo esc_attr($about_title); ?>" class="about-image" loading="lazy">
                <?php else : ?>
                    <div class="about-image-placeholder">
                        <span class="placeholder-jp">和</span>
                    </div>
                <?php endif; ?>
                <div class="about-decoration"></div>
            </div>
            <div class="about-content-col">
                <span class="section-badge">私たちについて</span>
                <h2 class="section-title"><?php echo esc_html($about_title); ?></h2>
                <p class="about-text"><?php echo esc_html($about_text); ?></p>
                <div class="about-features">
                    <div class="about-feature">
                        <div class="feature-icon">🌸</div>
                        <div>
                            <h4>Свежие ингредиенты</h4>
                            <p>Ежедневная доставка из лучших поставщиков</p>
                        </div>
                    </div>
                    <div class="about-feature">
                        <div class="feature-icon">🍣</div>
                        <div>
                            <h4>Мастера своего дела</h4>
                            <p>Шеф-повара с опытом работы в Японии</p>
                        </div>
                    </div>
                    <div class="about-feature">
                        <div class="feature-icon">🎋</div>
                        <div>
                            <h4>Уютная атмосфера</h4>
                            <p>Интерьер в традиционном японском стиле</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
