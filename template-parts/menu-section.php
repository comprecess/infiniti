<?php if (!class_exists('WooCommerce')) return; ?>
<section class="sakura-menu-section" id="menu">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">お品書き</span>
            <h2 class="section-title">Популярные блюда</h2>
            <p class="section-subtitle">Откройте для себя вкусы настоящей Японии</p>
        </div>
        <div class="menu-grid">
            <?php
            $products = wc_get_products(array(
                'limit'    => 8,
                'status'   => 'publish',
                'featured' => true,
                'orderby'  => 'date',
                'order'    => 'DESC',
            ));
            if (empty($products)) {
                $products = wc_get_products(array(
                    'limit'  => 8,
                    'status' => 'publish',
                    'orderby' => 'rand',
                ));
            }
            if (!empty($products)) :
                foreach ($products as $product) :
                    $image = wp_get_attachment_image_url($product->get_image_id(), 'woocommerce_thumbnail');
                    if (!$image) $image = wc_placeholder_img_src('woocommerce_thumbnail');
                    $product_id = $product->get_id();
            ?>
                <div class="menu-card">
                    <a href="<?php echo esc_url(get_permalink($product_id)); ?>" class="menu-card-image">
                        <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($product->get_name()); ?>" loading="lazy">
                        <?php if ($product->is_on_sale()) : ?>
                            <span class="menu-card-badge">Акция</span>
                        <?php endif; ?>
                    </a>
                    <div class="menu-card-content">
                        <a href="<?php echo esc_url(get_permalink($product_id)); ?>" class="menu-card-title-link">
                            <h3 class="menu-card-title"><?php echo esc_html($product->get_name()); ?></h3>
                        </a>
                        <?php if ($product->get_short_description()) : ?>
                            <p class="menu-card-desc"><?php echo esc_html(wp_trim_words($product->get_short_description(), 10)); ?></p>
                        <?php endif; ?>
                        <div class="menu-card-footer">
                            <span class="menu-card-price"><?php echo $product->get_price_html(); ?></span>
                            <?php if ($product->is_purchasable() && $product->is_in_stock()) : ?>
                                <div class="product-quantity-wrap product-quantity-inline">
                                    <div class="quantity-selector">
                                        <button type="button" class="qty-btn qty-minus" data-product-id="<?php echo esc_attr($product_id); ?>">&#8722;</button>
                                        <input type="number" class="qty-input" id="qty-home-<?php echo esc_attr($product_id); ?>" value="1" min="1" max="99" readonly>
                                        <button type="button" class="qty-btn qty-plus" data-product-id="<?php echo esc_attr($product_id); ?>">+</button>
                                    </div>
                                    <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" 
                                       class="btn-add-cart add_to_cart_button ajax_add_to_cart"
                                       data-product_id="<?php echo esc_attr($product_id); ?>"
                                       data-product_sku="<?php echo esc_attr($product->get_sku()); ?>"
                                       data-quantity="1"
                                       aria-label="В корзину">
                                        В корзину
                                    </a>
                                </div>
                                <a href="<?php echo esc_url(wc_get_checkout_url()); ?>" class="menu-card-checkout-link">Оформить заказ</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php
                endforeach;
            else :
            ?>
                <p class="no-products">Скоро здесь появятся наши лучшие блюда</p>
            <?php endif; ?>
        </div>
        <div class="section-cta">
            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" class="btn-sakura">Смотреть всё меню</a>
        </div>
    </div>
</section>
