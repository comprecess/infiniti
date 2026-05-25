<?php
/**
 * Email Styles - Sakura Theme Custom
 *
 * This template overrides the default WooCommerce email styles.
 *
 * @package SakuraTheme\WooCommerce\Emails
 * @version 10.7.0
 */

use Automattic\WooCommerce\Internal\Email\EmailFont;
use Automattic\WooCommerce\Utilities\FeaturesUtil;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$email_improvements_enabled = FeaturesUtil::feature_is_enabled( 'email_improvements' );
$block_email_editor_enabled = FeaturesUtil::feature_is_enabled( 'block_email_editor' );

// Load colors.
$bg               = get_option( 'woocommerce_email_background_color' );
$body             = get_option( 'woocommerce_email_body_background_color' );
$base             = get_option( 'woocommerce_email_base_color' );
$text             = get_option( 'woocommerce_email_text_color' );
$footer_text      = get_option( 'woocommerce_email_footer_text_color' );
$header_alignment = get_option( 'woocommerce_email_header_alignment', $email_improvements_enabled ? 'left' : false );
$logo_image_width = get_option( 'woocommerce_email_header_image_width', '120' );
$default_font     = 'Helvetica';
$font_family      = $email_improvements_enabled ? get_option( 'woocommerce_email_font_family', $default_font ) : $default_font;

$is_email_preview = apply_filters( 'woocommerce_is_email_preview', false );

if ( $is_email_preview ) {
	$bg_transient               = get_transient( 'woocommerce_email_background_color' );
	$body_transient             = get_transient( 'woocommerce_email_body_background_color' );
	$base_transient             = get_transient( 'woocommerce_email_base_color' );
	$text_transient             = get_transient( 'woocommerce_email_text_color' );
	$footer_text_transient      = get_transient( 'woocommerce_email_footer_text_color' );
	$header_alignment_transient = get_transient( 'woocommerce_email_header_alignment' );
	$logo_image_width_transient = get_transient( 'woocommerce_email_header_image_width' );
	$font_family_transient      = get_transient( 'woocommerce_email_font_family' );
	$bg               = $bg_transient ? $bg_transient : $bg;
	$body             = $body_transient ? $body_transient : $body;
	$base             = $base_transient ? $base_transient : $base;
	$text             = $text_transient ? $text_transient : $text;
	$footer_text      = $footer_text_transient ? $footer_text_transient : $footer_text;
	$header_alignment = $header_alignment_transient ? $header_alignment_transient : $header_alignment;
	$logo_image_width = $logo_image_width_transient ? $logo_image_width_transient : $logo_image_width;
	$font_family      = $font_family_transient ? $font_family_transient : $font_family;
}

$safe_font_family = EmailFont::$font[ $font_family ] ?? EmailFont::$font[ $default_font ];

$base_text = wc_light_or_dark( $base, '#202020', '#ffffff' );
$link_color = wc_hex_is_light( $base ) ? $base : $base_text;
if ( wc_hex_is_light( $body ) ) {
	$link_color = wc_hex_is_light( $base ) ? $base_text : $base;
}
if ( $email_improvements_enabled ) {
	$link_color = $base;
}

$border_color    = wc_light_or_dark( $body, 'rgba(0, 0, 0, .1)', 'rgba(255, 255, 255, .2)' );
$bg_darker_10    = wc_hex_darker( $bg, 10 );
$body_darker_10  = wc_hex_darker( $body, 10 );
$base_lighter_20 = wc_hex_lighter( $base, 20 );
$base_lighter_40 = wc_hex_lighter( $base, 40 );
$text_lighter_20 = wc_hex_lighter( $text, 20 );
$text_lighter_40 = wc_hex_lighter( $text, 40 );
?>

body {
	background-color: <?php echo esc_attr( $bg ); ?>;
	padding: 0;
	text-align: center;
}

#outer_wrapper {
	background-color: <?php echo esc_attr( $bg ); ?>;
}

#wrapper {
	margin: 0 auto;
	padding: 40px 0 30px;
	-webkit-text-size-adjust: none !important;
	width: 100%;
	max-width: 600px;
}

#inner_wrapper {
	width: 100%;
}

#template_container {
	box-shadow: 0 2px 12px rgba(199, 97, 118, 0.08);
	background-color: <?php echo esc_attr( $body ); ?>;
	border: 1px solid <?php echo esc_attr( $border_color ); ?>;
	border-radius: 12px;
	overflow: hidden;
}

#template_header {
	background-color: <?php echo esc_attr( $base ); ?>;
	border-radius: 0;
	color: <?php echo esc_attr( $base_text ); ?>;
	border-bottom: 0;
	font-weight: bold;
	line-height: 100%;
	vertical-align: middle;
	font-family: <?php echo $safe_font_family; ?>;
}

#template_header h1,
#header_wrapper h1 {
	font-family: <?php echo $safe_font_family; ?>;
	font-size: 24px;
	font-weight: 600;
	letter-spacing: 0.5px;
	line-height: 150%;
	margin: 0;
	padding: 28px 48px;
	text-align: center;
	color: <?php echo esc_attr( $base_text ); ?>;
	-webkit-font-smoothing: antialiased;
}

#template_header_image {
	text-align: center;
	padding: 0;
}

#template_header_image p {
	margin: 0;
	padding: 0;
}

#template_header_image img {
	width: 100%;
	max-width: 600px;
	height: auto;
	display: block;
	border: 0;
}

#template_body {
	background-color: <?php echo esc_attr( $body ); ?>;
}

#body_content {
	background-color: <?php echo esc_attr( $body ); ?>;
}

#body_content table td {
	padding: 48px 48px 32px;
}

#body_content table td td {
	padding: 12px;
}

#body_content table td th {
	padding: 12px;
}

#body_content td ul.wc-item-meta {
	font-size: small;
	margin: 1em 0 0;
	padding: 0;
	list-style: none;
}

#body_content td ul.wc-item-meta li {
	margin: 0.5em 0 0;
	padding: 0;
}

#body_content td ul.wc-item-meta li p {
	margin: 0;
}

#body_content p {
	margin: 0 0 16px;
}

#body_content_inner {
	color: <?php echo esc_attr( $text_lighter_20 ); ?>;
	font-family: <?php echo $safe_font_family; ?>;
	font-size: 14px;
	line-height: 170%;
	text-align: <?php echo is_rtl() ? 'right' : 'left'; ?>;
}

#credit {
	border: 0;
	color: <?php echo esc_attr( $text_lighter_40 ); ?>;
	font-family: <?php echo $safe_font_family; ?>;
	font-size: 12px;
	line-height: 170%;
	text-align: center;
	padding: 24px 0 0;
	margin: 0;
}

#credit p {
	margin: 0 0 8px;
	color: <?php echo esc_attr( $text_lighter_40 ); ?>;
}

/* Sakura-themed footer */
#template_footer {
	border-top: 1px solid <?php echo esc_attr( $border_color ); ?>;
	padding: 24px 48px;
}

#template_footer #credit {
	padding: 0;
}

#template_footer .sakura-footer-info {
	font-family: <?php echo $safe_font_family; ?>;
	font-size: 12px;
	line-height: 180%;
	color: <?php echo esc_attr( $text_lighter_40 ); ?>;
	text-align: center;
}

#template_footer .sakura-footer-info a {
	color: <?php echo esc_attr( $base ); ?>;
	text-decoration: none;
}

/* Links */
a {
	color: <?php echo esc_attr( $link_color ); ?>;
	font-weight: normal;
	text-decoration: underline;
}

/* Headings */
h1 {
	color: <?php echo esc_attr( $base ); ?>;
	font-family: <?php echo $safe_font_family; ?>;
	font-size: 24px;
	font-weight: 600;
	line-height: 130%;
	margin: 0 0 18px;
	text-align: <?php echo is_rtl() ? 'right' : 'left'; ?>;
}

h2 {
	color: <?php echo esc_attr( $base ); ?>;
	display: block;
	font-family: <?php echo $safe_font_family; ?>;
	font-size: 18px;
	font-weight: bold;
	line-height: 130%;
	margin: 0 0 18px;
	text-align: <?php echo is_rtl() ? 'right' : 'left'; ?>;
}

h3 {
	color: <?php echo esc_attr( $base ); ?>;
	display: block;
	font-family: <?php echo $safe_font_family; ?>;
	font-size: 16px;
	font-weight: bold;
	line-height: 130%;
	margin: 16px 0 8px;
	text-align: <?php echo is_rtl() ? 'right' : 'left'; ?>;
}

/* Order table */
.td {
	color: <?php echo esc_attr( $text_lighter_20 ); ?>;
	border: 1px solid <?php echo esc_attr( $border_color ); ?>;
	vertical-align: middle;
	padding: 12px;
	font-family: <?php echo $safe_font_family; ?>;
}

.address {
	color: <?php echo esc_attr( $text_lighter_20 ); ?>;
	border: 1px solid <?php echo esc_attr( $border_color ); ?>;
	border-radius: 8px;
	padding: 12px;
}

.text {
	color: <?php echo esc_attr( $text ); ?>;
	font-family: <?php echo $safe_font_family; ?>;
}

.link {
	color: <?php echo esc_attr( $link_color ); ?>;
}

img {
	border: none;
	display: inline-block;
	font-size: 14px;
	font-weight: bold;
	height: auto;
	outline: none;
	text-decoration: none;
	text-transform: capitalize;
	vertical-align: middle;
	margin-<?php echo is_rtl() ? 'left' : 'right'; ?>: 10px;
	max-width: 100%;
}

/* Responsive */
@media screen and (max-width: 600px) {
	#wrapper {
		padding: 20px 0 !important;
	}
	#body_content table td {
		padding: 24px 20px 16px !important;
	}
	#template_header h1,
	#header_wrapper h1 {
		padding: 20px 24px !important;
		font-size: 20px !important;
	}
	#template_footer {
		padding: 16px 20px !important;
	}
}
