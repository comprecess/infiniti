<?php
/**
 * Цветение сакуры - Theme Functions
 * Style: Hanami Breeze - нежные розовые тона, кремовый фон
 */

if (!defined('ABSPATH')) exit;

define('SAKURA_VERSION', '2.1.0');
define('SAKURA_DIR', get_template_directory());
define('SAKURA_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function sakura_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array(
        'height'      => 80,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('woocommerce');
    // add_theme_support('wc-product-gallery-zoom');
    // add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    register_nav_menus(array(
        'primary' => __('Главное меню', 'sakura-theme'),
        'footer'  => __('Меню в подвале', 'sakura-theme'),
    ));

    add_image_size('sakura-hero', 1920, 900, true);
    add_image_size('sakura-menu-item', 600, 600, true);
    add_image_size('sakura-gallery', 800, 600, true);
}
add_action('after_setup_theme', 'sakura_setup');

/**
 * Enqueue Styles and Scripts
 */
function sakura_scripts() {
    // Google Fonts - Playfair Display + Nunito
    wp_enqueue_style('sakura-fonts', 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@400;700&display=swap', array(), null);

    // Main stylesheet
    wp_enqueue_style('sakura-main', SAKURA_URI . '/assets/css/main.css', array(), SAKURA_VERSION);

    // WooCommerce styles
    if (class_exists('WooCommerce')) {
        wp_enqueue_style('sakura-woo', SAKURA_URI . '/assets/css/woocommerce.css', array(), SAKURA_VERSION);
    wp_enqueue_style('sakura-pages', get_template_directory_uri() . '/assets/css/pages.css', array(), SAKURA_VERSION);
    }

    // Theme stylesheet
    wp_enqueue_style('sakura-style', get_stylesheet_uri(), array('sakura-main'), SAKURA_VERSION);

    // Main JS
    wp_enqueue_script('sakura-main', SAKURA_URI . '/assets/js/main.js', array('jquery'), SAKURA_VERSION, true);

    // Localize script
    wp_localize_script('sakura-main', 'sakuraAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'recaptchaSiteKey' => defined('SAKURA_RECAPTCHA_SITE_KEY') ? SAKURA_RECAPTCHA_SITE_KEY : '',
        'nonce'   => wp_create_nonce('sakura_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'sakura_scripts');

/**
 * WooCommerce Support
 */
function sakura_woocommerce_setup() {
    add_theme_support('woocommerce', array(
        'thumbnail_image_width' => 600,
        'single_image_width'    => 800,
        'product_grid'          => array(
            'default_rows'    => 3,
            'min_rows'        => 1,
            'default_columns' => 3,
            'min_columns'     => 1,
            'max_columns'     => 4,
        ),
    ));
}
add_action('after_setup_theme', 'sakura_woocommerce_setup');

// Remove default WooCommerce wrappers
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);

function sakura_woo_wrapper_start() {
    echo '<main class="sakura-shop-main"><div class="container">';
}
function sakura_woo_wrapper_end() {
    echo '</div></main>';
}
add_action('woocommerce_before_main_content', 'sakura_woo_wrapper_start', 10);
add_action('woocommerce_after_main_content', 'sakura_woo_wrapper_end', 10);

/**
 * Widgets
 */
function sakura_widgets_init() {
    register_sidebar(array(
        'name'          => __('Сайдбар магазина', 'sakura-theme'),
        'id'            => 'shop-sidebar',
        'before_widget' => '<div class="sakura-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
    register_sidebar(array(
        'name'          => __('Подвал', 'sakura-theme'),
        'id'            => 'footer-widgets',
        'before_widget' => '<div class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="footer-widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'sakura_widgets_init');

/**
 * AJAX Cart Update
 */
function sakura_update_cart_count() {
    if (class_exists('WooCommerce')) {
        echo WC()->cart->get_cart_contents_count();
    }
    wp_die();
}
add_action('wp_ajax_sakura_cart_count', 'sakura_update_cart_count');
add_action('wp_ajax_nopriv_sakura_cart_count', 'sakura_update_cart_count');

/**
 * Cart Fragments
 */
function sakura_cart_fragments($fragments) {
    $fragments['.sakura-cart-count'] = '<span class="sakura-cart-count">' . WC()->cart->get_cart_contents_count() . '</span>';
    return $fragments;
}
add_filter('woocommerce_add_to_cart_fragments', 'sakura_cart_fragments');

/**
 * Customizer
 */
require_once SAKURA_DIR . '/inc/customizer.php';

/**
 * Template Tags
 */
require_once SAKURA_DIR . '/inc/template-tags.php';

// Ensure WooCommerce cart fragments are loaded
function sakura_enqueue_cart_fragments() {
    if (function_exists('is_woocommerce')) {
        wp_enqueue_script('wc-cart-fragments');
    }
}
add_action('wp_enqueue_scripts', 'sakura_enqueue_cart_fragments', 20);

// AJAX add to cart handler for simple products
function sakura_ajax_add_to_cart() {
    $product_id = absint($_POST['product_id']);
    $quantity = empty($_POST['quantity']) ? 1 : wc_stock_amount(absint($_POST['quantity']));
    
    $passed_validation = apply_filters('woocommerce_add_to_cart_validation', true, $product_id, $quantity);
    
    if ($passed_validation && WC()->cart->add_to_cart($product_id, $quantity)) {
        do_action('woocommerce_ajax_added_to_cart', $product_id);
        WC_AJAX::get_refreshed_fragments();
    } else {
        $data = array(
            'error' => true,
            'product_url' => apply_filters('woocommerce_cart_redirect_after_error', get_permalink($product_id), $product_id)
        );
        wp_send_json($data);
    }
    wp_die();
}
add_action('wp_ajax_woocommerce_ajax_add_to_cart', 'sakura_ajax_add_to_cart');
add_action('wp_ajax_nopriv_woocommerce_ajax_add_to_cart', 'sakura_ajax_add_to_cart');

// Cart count AJAX
function sakura_cart_count() {
    echo WC()->cart->get_cart_contents_count();
    wp_die();
}
add_action('wp_ajax_sakura_cart_count', 'sakura_cart_count');
add_action('wp_ajax_nopriv_sakura_cart_count', 'sakura_cart_count');
require_once get_template_directory() . '/inc/custom-styles.php';
require_once get_template_directory() . '/inc/translations.php';

// Related products: show 4 in a row, small cards
add_filter('woocommerce_output_related_products_args', function($args) {
    $args['posts_per_page'] = 5;
    $args['columns'] = 5;
    return $args;
});

// Dequeue WooCommerce default add-to-cart JS to avoid conflict with our custom handler
function sakura_dequeue_wc_scripts() {
    wp_dequeue_script('wc-add-to-cart');
}
add_action('wp_enqueue_scripts', 'sakura_dequeue_wc_scripts', 20);

// Inline payment alignment fix (bypasses browser CSS cache)

function sakura_payment_inline_css() {
    if (is_checkout()) {
        echo '<style id="sakura-payment-fix">
        @media (max-width: 768px) {
            .woocommerce-checkout #payment { padding: 20px !important; }
            .woocommerce-checkout #payment ul.payment_methods { 
                padding: 0 !important; 
                margin: 0 0 16px 0 !important; 
                border: none !important; 
            }
            .woocommerce-checkout #payment ul.payment_methods li { 
                padding: 0 !important; 
                margin: 0 !important; 
                background: none !important; 
                list-style: none !important; 
            }
            .woocommerce-checkout #payment ul.payment_methods li input[type="radio"],
            .woocommerce-checkout #payment ul.payment_methods li .input-radio { 
                display: none !important; 
            }
            .woocommerce-checkout #payment ul.payment_methods li label { 
                display: block !important; 
                padding: 0 0 8px 0 !important; 
                margin: 0 !important; 
            }
            .woocommerce-checkout #payment div.payment_box { 
                margin: 0 0 16px 0 !important; 
                padding: 12px 16px !important; 
                border-radius: 8px !important; 
            }
            .woocommerce-checkout #payment div.form-row,
            .woocommerce-checkout #payment div.form-row.place-order,
            .woocommerce-checkout #payment .form-row,
            .woocommerce-checkout #payment .place-order,
            #payment div.form-row,
            #payment div.form-row.place-order,
            #payment .place-order { 
                padding: 0 !important; 
                margin: 0 !important; 
            }
            .woocommerce-checkout #payment .place-order .woocommerce-terms-and-conditions-wrapper { 
                padding: 0 !important; 
                margin: 0 !important; 
            }
            .woocommerce-checkout #payment .place-order .woocommerce-privacy-policy-text { 
                padding: 0 !important; 
                margin: 0 0 16px 0 !important; 
            }
            .woocommerce-checkout #payment .place-order .woocommerce-privacy-policy-text p { 
                padding: 0 !important; 
                margin: 0 !important; 
            }
        }
        </style>';
    }
}
add_action('wp_head', 'sakura_payment_inline_css', 999);


// ============================================
// reCAPTCHA v3 + Anti-Spam Protection
// ============================================
define('SAKURA_RECAPTCHA_SITE_KEY', '6LeT3vssAAAAAB3_NU3eZFLmpxxPhP2tEWutOBwH');
define('SAKURA_RECAPTCHA_SECRET_KEY', '6LeT3vssAAAAANZ-nFwizIu_wfGOkdw0NFtuZUeC');

// Enqueue reCAPTCHA v3 script
function sakura_enqueue_recaptcha() {
    if (is_front_page() || is_page('catering')) {
        wp_enqueue_script('google-recaptcha', 'https://www.google.com/recaptcha/api.js?render=' . SAKURA_RECAPTCHA_SITE_KEY, array(), null, true);
    }
}
add_action('wp_enqueue_scripts', 'sakura_enqueue_recaptcha');

// Add reCAPTCHA initialization to footer
function sakura_recaptcha_footer_script() {
    if (is_front_page() || is_page('catering')) {
        ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Set form load timestamp for timer check
            var loadedAt = document.getElementById('form-loaded-at');
            if (loadedAt) {
                loadedAt.value = Math.floor(Date.now() / 1000);
            }
        });
        </script>
        <?php
    }
}
add_action('wp_footer', 'sakura_recaptcha_footer_script', 99);

// Handle reservation form with anti-spam checks
function sakura_handle_reservation() {
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sakura_ajax_nonce')) {
        wp_send_json_error(array('message' => 'Ошибка безопасности. Обновите страницу.'));
    }
    
    // 1. Honeypot check - if filled, it's a bot
    if (!empty($_POST['website_url'])) {
        // Silently reject - don't tell bots why
        wp_send_json_success(array('message' => 'Спасибо! Мы свяжемся с вами.'));
    }
    
    // 2. Timer check - form submitted too fast (< 3 seconds)
    if (isset($_POST['form_loaded_at'])) {
        $loaded_at = intval($_POST['form_loaded_at']);
        $now = time();
        if ($now - $loaded_at < 3) {
            wp_send_json_success(array('message' => 'Спасибо! Мы свяжемся с вами.'));
        }
    }
    
    // 3. reCAPTCHA v3 verification
    if (!empty($_POST['recaptcha_token'])) {
        $recaptcha_response = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', array(
            'body' => array(
                'secret' => SAKURA_RECAPTCHA_SECRET_KEY,
                'response' => sanitize_text_field($_POST['recaptcha_token']),
                'remoteip' => $_SERVER['REMOTE_ADDR']
            )
        ));
        
        if (!is_wp_error($recaptcha_response)) {
            $recaptcha_data = json_decode(wp_remote_retrieve_body($recaptcha_response), true);
            // Score threshold: 0.5 (0.0 = bot, 1.0 = human)
            if (!$recaptcha_data['success'] || (isset($recaptcha_data['score']) && $recaptcha_data['score'] < 0.5)) {
                wp_send_json_error(array('message' => 'Проверка безопасности не пройдена. Попробуйте снова.'));
            }
        }
    } else {
        // No token = suspicious, but allow if honeypot and timer passed
        // (for users with JS disabled or reCAPTCHA blocked)
    }
    
    // 4. Rate limiting by IP (max 5 per hour)
    $ip = $_SERVER['REMOTE_ADDR'];
    $transient_key = 'sakura_res_' . md5($ip);
    $count = get_transient($transient_key);
    if ($count === false) {
        set_transient($transient_key, 1, HOUR_IN_SECONDS);
    } elseif ($count >= 5) {
        wp_send_json_error(array('message' => 'Слишком много запросов. Попробуйте позже.'));
    } else {
        set_transient($transient_key, $count + 1, HOUR_IN_SECONDS);
    }
    
    // All checks passed - process the reservation
    $name = sanitize_text_field($_POST['name'] ?? '');
    $phone = sanitize_text_field($_POST['phone'] ?? '');
    $guests = sanitize_text_field($_POST['guests'] ?? '2');
    $date = sanitize_text_field($_POST['date'] ?? '');
    $time_val = sanitize_text_field($_POST['time'] ?? '');
    $comment = sanitize_textarea_field($_POST['comment'] ?? '');
    
    // Send email notification
    $to = get_option('admin_email');
    $subject = 'Новое бронирование: ' . $name . ' на ' . $date;
    $message = "Новое бронирование столика:\n\n";
    $message .= "Имя: $name\n";
    $message .= "Телефон: $phone\n";
    $message .= "Гостей: $guests\n";
    $message .= "Дата: $date\n";
    $message .= "Время: $time_val\n";
    $message .= "Пожелания: $comment\n";
    $message .= "\nIP: $ip";
    
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    wp_mail($to, $subject, $message, $headers);
    
    wp_send_json_success(array('message' => 'Столик забронирован! Мы свяжемся с вами для подтверждения.'));
}
add_action('wp_ajax_sakura_reservation', 'sakura_handle_reservation');
add_action('wp_ajax_nopriv_sakura_reservation', 'sakura_handle_reservation');
