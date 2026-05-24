<?php
/**
 * Template Tags for Sakura Theme
 */

function sakura_posted_on() {
    $time_string = '<time class="entry-date" datetime="%1$s">%2$s</time>';
    $time_string = sprintf($time_string,
        esc_attr(get_the_date(DATE_W3C)),
        esc_html(get_the_date())
    );
    echo '<span class="posted-on">' . $time_string . '</span>';
}

function sakura_posted_by() {
    echo '<span class="byline">' . esc_html(get_the_author()) . '</span>';
}

function sakura_get_cart_url() {
    if (class_exists('WooCommerce')) {
        return wc_get_cart_url();
    }
    return '#';
}

function sakura_get_shop_url() {
    if (class_exists('WooCommerce')) {
        return get_permalink(wc_get_page_id('shop'));
    }
    return '#';
}
