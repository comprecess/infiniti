<?php
/**
 * WooCommerce product card template - Sakura theme
 */
defined('ABSPATH') || exit;
global $product;
if (empty($product) || !$product->is_visible()) {
    return;
}
$product_id = $product->get_id();
?>
<li <?php wc_product_class('sakura-product-card', $product); ?>>
    <div class="product-card-inner">
        <a href="<?php the_permalink(); ?>" class="product-card-image">
            <?php echo woocommerce_get_product_thumbnail('woocommerce_thumbnail'); ?>
        </a>
        <div class="product-card-content">
            <a href="<?php the_permalink(); ?>" class="product-card-title">
                <h2><?php the_title(); ?></h2>
            </a>
            <?php if ($product->get_short_description()) : ?>
                <p class="product-card-desc"><?php echo wp_trim_words($product->get_short_description(), 12); ?></p>
            <?php endif; ?>
            <div class="product-card-footer">
                <span class="product-card-price"><?php echo $product->get_price_html(); ?></span>
                <?php if ($product->is_purchasable() && $product->is_in_stock()) : ?>
                    <div class="product-quantity-wrap">
                        <div class="quantity-selector">
                            <button type="button" class="qty-btn qty-minus" data-product-id="<?php echo esc_attr($product_id); ?>">−</button>
                            <input type="number" class="qty-input" id="qty-<?php echo esc_attr($product_id); ?>" value="1" min="1" max="99" readonly>
                            <button type="button" class="qty-btn qty-plus" data-product-id="<?php echo esc_attr($product_id); ?>">+</button>
                        </div>
                        <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" 
                           class="btn-add-cart add_to_cart_button ajax_add_to_cart"
                           data-product_id="<?php echo esc_attr($product_id); ?>"
                           data-product_sku="<?php echo esc_attr($product->get_sku()); ?>"
                           data-quantity="1"
                           aria-label="<?php echo esc_attr(sprintf(__('Добавить «%s» в корзину', 'sakura-theme'), $product->get_name())); ?>">
                            В корзину
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</li>
