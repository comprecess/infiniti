<?php
$hero_title = get_theme_mod('sakura_hero_title', 'Цветение сакуры');
$hero_subtitle = get_theme_mod('sakura_hero_subtitle', '桜の花');
$hero_text = get_theme_mod('sakura_hero_text', 'Изысканная японская кухня в атмосфере цветущей сакуры. Свежайшие ингредиенты, традиционные рецепты и современная подача.');
$hero_image = get_theme_mod('sakura_hero_image', '');
?>

<section class="sakura-hero" <?php if ($hero_image) : ?>style="background-image: url(<?php echo esc_url($hero_image); ?>)"<?php endif; ?>>
    <div class="hero-overlay"></div>
    <div class="container">
        <div class="hero-content">
            <span class="hero-badge">日本料理 — Japanese Fine Dining</span>
            <h1 class="hero-title"><?php echo esc_html($hero_title); ?></h1>
            <p class="hero-subtitle"><?php echo esc_html($hero_subtitle); ?></p>
            <p class="hero-text"><?php echo esc_html($hero_text); ?></p>
            <div class="hero-buttons">
                <a href="<?php echo class_exists('WooCommerce') ? esc_url(get_permalink(wc_get_page_id('shop'))) : '#menu'; ?>" class="btn btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    Заказать онлайн
                </a>
                <a href="#reservation" class="btn btn-outline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Забронировать стол
                </a>
            </div>
        </div>
    </div>
    <div class="hero-scroll">
        <span>Scroll</span>
        <div class="scroll-line"></div>
    </div>
</section>
