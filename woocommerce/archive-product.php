<?php
/**
 * WooCommerce Shop Page - Sakura theme with category navigation
 */
defined('ABSPATH') || exit;
get_header();

// Get product categories (exclude Uncategorized)
$categories = get_terms(array(
    'taxonomy' => 'product_cat',
    'hide_empty' => true,
    'exclude' => array(get_option('default_product_cat', 0)),
    'orderby' => 'name',
));

// Check if we're viewing a specific category
$current_cat = get_queried_object();
$is_category = is_product_category();
?>
<main class="sakura-shop-page">
    <div class="shop-container">
        <header class="shop-header">
            <?php if (apply_filters('woocommerce_show_page_title', true)) : ?>
                <h1 class="shop-title"><?php woocommerce_page_title(); ?></h1>
            <?php endif; ?>
        </header>

        <?php if (!empty($categories) && !is_wp_error($categories)) : ?>
        <nav class="category-nav">
            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" 
               class="cat-btn <?php echo !$is_category ? 'active' : ''; ?>">
                Все
            </a>
            <?php foreach ($categories as $cat) : ?>
                <a href="<?php echo esc_url(get_term_link($cat)); ?>" 
                   class="cat-btn <?php echo ($is_category && $current_cat->term_id === $cat->term_id) ? 'active' : ''; ?>">
                    <?php echo esc_html($cat->name); ?>
                    <span class="cat-count"><?php echo $cat->count; ?></span>
                </a>
            <?php endforeach; ?>
        </nav>
        <?php endif; ?>

        <div class="shop-ordering-wrap">
            <?php if (woocommerce_product_loop()) : ?>
                <?php woocommerce_catalog_ordering(); ?>
            <?php endif; ?>
        </div>

        <?php if (woocommerce_product_loop()) : ?>
            <?php woocommerce_product_loop_start(); ?>
            <?php while (have_posts()) : the_post();
                wc_get_template_part('content', 'product');
            endwhile; ?>
            <?php woocommerce_product_loop_end(); ?>
            <?php woocommerce_pagination(); ?>
        <?php else : ?>
            <p class="no-products"><?php esc_html_e('Товары не найдены.', 'sakura-theme'); ?></p>
        <?php endif; ?>
    </div>
</main>
<?php get_footer(); ?>
