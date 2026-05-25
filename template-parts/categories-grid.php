<?php
/**
 * Template Part: Categories Grid
 * 4x4 grid with real product photos (no background, just dish on plate)
 * Excludes "Паста" category (ID 91) for symmetry
 */
$categories = get_terms(array(
    'taxonomy'   => 'product_cat',
    'hide_empty' => true,
    'orderby'    => 'count',
    'order'      => 'DESC',
    'exclude'    => array(get_option('default_product_cat'), 91), // Exclude Паста
));
if (empty($categories) || is_wp_error($categories)) return;

// Limit to 16 categories for 4x4 grid
$categories = array_slice($categories, 0, 16);
?>
<section class="sakura-categories-section" id="categories">
    <div class="container">
        <h2 class="section-title">Наше меню</h2>
        <p class="section-subtitle">Выберите категорию</p>
        <div class="categories-grid">
            <?php foreach ($categories as $cat) :
                // Get the most popular product image from this category
                $args = array(
                    'post_type'      => 'product',
                    'posts_per_page' => 1,
                    'tax_query'      => array(array(
                        'taxonomy' => 'product_cat',
                        'field'    => 'term_id',
                        'terms'    => $cat->term_id,
                    )),
                    'meta_key'       => 'total_sales',
                    'orderby'        => 'meta_value_num',
                    'order'          => 'DESC',
                );
                $query = new WP_Query($args);
                $image_url = '';
                if ($query->have_posts()) {
                    $query->the_post();
                    $image_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
                }
                wp_reset_postdata();
                
                // Fallback to category thumbnail
                if (!$image_url) {
                    $thumbnail_id = get_term_meta($cat->term_id, 'thumbnail_id', true);
                    $image_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : '';
                }
            ?>
            <a href="<?php echo esc_url(get_term_link($cat)); ?>" class="category-card">
                <div class="category-image-wrap">
                    <?php if ($image_url) : ?>
                        <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($cat->name); ?>" loading="lazy">
                    <?php else : ?>
                        <span class="category-icon">🍣</span>
                    <?php endif; ?>
                </div>
                <h3 class="category-name"><?php echo esc_html($cat->name); ?></h3>
                <span class="category-count">(<?php echo $cat->count; ?>)</span>
            </a>
            <?php endforeach; ?>
        </div>
        <div class="categories-cta">
            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" class="btn-sakura">Смотреть всё меню</a>
        </div>
    </div>
</section>
