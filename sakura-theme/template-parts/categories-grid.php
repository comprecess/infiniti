<?php
/**
 * Template Part: Categories Grid
 * Сетка категорий меню в 2 колонки
 */
$categories = get_terms(array(
    'taxonomy'   => 'product_cat',
    'hide_empty' => true,
    'orderby'    => 'count',
    'order'      => 'DESC',
    'exclude'    => array(get_option('default_product_cat')),
));

if (empty($categories) || is_wp_error($categories)) return;
?>
<section class="sakura-categories-section" id="categories">
    <div class="container">
        <h2 class="section-title">Наше меню</h2>
        <p class="section-subtitle">Выберите категорию</p>
        <div class="categories-grid">
            <?php foreach ($categories as $cat) :
                $thumbnail_id = get_term_meta($cat->term_id, 'thumbnail_id', true);
                $image_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : '';
            ?>
            <a href="<?php echo esc_url(get_term_link($cat)); ?>" class="category-card">
                <?php if ($image_url) : ?>
                    <div class="category-image" style="background-image: url('<?php echo esc_url($image_url); ?>')"></div>
                <?php else : ?>
                    <div class="category-image category-image-placeholder">
                        <span class="category-icon">🍣</span>
                    </div>
                <?php endif; ?>
                <div class="category-info">
                    <h3 class="category-name"><?php echo esc_html($cat->name); ?></h3>
                    <span class="category-count"><?php echo $cat->count; ?> <?php echo _n('блюдо', 'блюд', $cat->count); ?></span>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
        <div class="categories-cta">
            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" class="btn-sakura">Смотреть всё меню</a>
        </div>
    </div>
</section>
