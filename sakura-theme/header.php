<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="theme-color" content="#C76176">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    
    <?php sakura_seo_meta(); ?>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php if (is_front_page()) : ?>
<div class="sakura-petals" aria-hidden="true">
    <?php for ($i = 0; $i < 20; $i++) : ?>
        <div class="petal" style="--delay: <?php echo $i * 0.7; ?>s; --x: <?php echo rand(0, 100); ?>%; --size: <?php echo rand(8, 18); ?>px; --duration: <?php echo rand(6, 12); ?>s;"></div>
    <?php endfor; ?>
</div>
<?php endif; ?>
<header class="sakura-header">
    <div class="container">
        <div class="header-inner">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="sakura-logo">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <span class="logo-jp">桜</span>
                    <span class="logo-text"><?php bloginfo('name'); ?></span>
                <?php endif; ?>
            </a>
            <nav class="sakura-nav" id="sakura-nav">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'nav-menu',
                    'fallback_cb'    => 'sakura_fallback_menu',
                ));
                ?>
            </nav>
            <div class="header-actions">
                <button class="sakura-search-toggle" id="search-toggle" aria-label="Поиск">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                </button>
                <?php if (class_exists('WooCommerce')) : ?>
                    <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="sakura-cart-link">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        <span class="sakura-cart-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
                    </a>
                <?php endif; ?>
                <button class="mobile-toggle" id="mobile-toggle" aria-label="Меню">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </div>
</header>
<div class="sakura-search-overlay" id="search-overlay">
    <div class="search-overlay-inner">
        <form role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>">
            <input type="search" name="s" placeholder="Поиск блюд..." class="sakura-search-input" id="search-input" autocomplete="off">
            <input type="hidden" name="post_type" value="product">
            <button type="submit" class="sakura-search-submit">Найти</button>
        </form>
        <button class="search-close" id="search-close">&times;</button>
    </div>
</div>
<?php
function sakura_fallback_menu() {
    echo '<ul class="nav-menu">';
    echo '<li><a href="' . esc_url(home_url('/')) . '">Главная</a></li>';
    if (class_exists('WooCommerce')) {
        echo '<li><a href="' . esc_url(get_permalink(wc_get_page_id('shop'))) . '">Меню</a></li>';
    }
    echo '<li><a href="' . esc_url(get_permalink(get_page_by_path('about'))) . '">О нас</a></li>';
    echo '<li><a href="' . esc_url(get_permalink(get_page_by_path('contacts'))) . '">Контакты</a></li>';
    echo '</ul>';
}
?>
