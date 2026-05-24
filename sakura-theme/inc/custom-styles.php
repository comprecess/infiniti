<?php
/**
 * Custom inline styles for WooCommerce and global overrides
 * Version: 2.5
 */
function sakura_wc_block_styles() {
    ?>
    <style>
        /* ===== BUTTON STYLES ===== */
        .wc-block-cart__submit-button,
        .wc-block-components-button:not(.is-link),
        .wc-block-components-checkout-place-order-button,
        .wp-element-button,
        .wc-block-cart .wc-block-cart__submit-button,
        .wc-block-components-button.wc-block-cart__submit-button.contained,
        .woocommerce a.button,
        .woocommerce button.button,
        .woocommerce input.button,
        .woocommerce .button,
        a.button.add_to_cart_button,
        .add_to_cart_button,
        .single_add_to_cart_button,
        .checkout-button,
        .wc-block-components-checkout-place-order-button,
        button.wp-element-button {
            background-color: #D4567A !important;
            color: #ffffff !important;
            border: none !important;
            border-radius: 50px !important;
            padding: 0.8rem 2rem !important;
            font-family: "Nunito", sans-serif !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            box-shadow: 0 4px 15px rgba(212, 86, 122, 0.3) !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
            cursor: pointer !important;
        }
        .wc-block-cart__submit-button:hover,
        .wc-block-components-button:not(.is-link):hover,
        .wp-element-button:hover,
        .woocommerce a.button:hover,
        .woocommerce button.button:hover,
        .add_to_cart_button:hover,
        .single_add_to_cart_button:hover,
        button.wp-element-button:hover {
            background-color: #C14468 !important;
            box-shadow: 0 8px 25px rgba(212, 86, 122, 0.4) !important;
            transform: translateY(-1px) !important;
        }
        .wc-block-components-totals-coupon__button {
            background-color: #D4567A !important;
            color: #ffffff !important;
            border-radius: 50px !important;
            border: none !important;
        }
        /* ===== TYPOGRAPHY ===== */
        body, .woocommerce-page, .wc-block-cart, .wc-block-checkout {
            font-family: "Nunito", sans-serif !important;
            font-size: 16px !important;
            color: #5D3D2E !important;
        }
        .page-title, .entry-title, .woocommerce-products-header__title {
            font-family: "Playfair Display", serif !important;
            color: #5D3D2E !important;
            font-size: 2rem !important;
        }
        /* ===== SAKURA PETALS FIX ===== */
        .sakura-petals {
            z-index: 1 !important;
            opacity: 0.4 !important;
        }
        .woocommerce-page .sakura-petals,
        .woocommerce-cart .sakura-petals,
        .woocommerce-checkout .sakura-petals {
            display: none !important;
        }
        /* ===== CART PAGE ===== */
        .wc-block-cart .wc-block-components-product-name {
            color: #5D3D2E !important;
            font-family: "Playfair Display", serif !important;
            font-size: 1.1rem !important;
            text-decoration: none !important;
        }
        .wc-block-cart .wc-block-components-product-metadata {
            font-size: 0.9rem !important;
        }
        /* ===== CHECKOUT PAGE ===== */
        .wc-block-checkout .wc-block-components-text-input input,
        .wc-block-checkout .wc-block-components-text-input textarea {
            border-radius: 8px !important;
            border-color: #F4A7B9 !important;
            font-family: "Nunito", sans-serif !important;
        }
        .wc-block-checkout .wc-block-components-text-input input:focus,
        .wc-block-checkout .wc-block-components-text-input textarea:focus {
            border-color: #D4567A !important;
            box-shadow: 0 0 0 2px rgba(212, 86, 122, 0.2) !important;
        }
        /* HIDE unnecessary checkout fields: country, state, postcode */
        .wc-block-components-address-form__country,
        .wc-block-components-address-form__state,
        .wc-block-components-address-form__postcode,
        .wc-block-components-address-form [id*="country"],
        .wc-block-components-address-form [id*="state"],
        .wc-block-components-address-form [id*="postcode"] {
            display: none !important;
        }
        /* ===== SEARCH OVERLAY ===== */
        .sakura-search-toggle {
            background: none;
            border: none;
            cursor: pointer;
            color: #5D3D2E;
            padding: 6px;
            display: flex;
            align-items: center;
            transition: color 0.2s;
        }
        .sakura-search-toggle:hover {
            color: #D4567A;
        }
        .sakura-search-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(93, 61, 46, 0.85);
            backdrop-filter: blur(8px);
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .sakura-search-overlay.active {
            display: flex;
            opacity: 1;
        }
        .search-overlay-inner {
            width: 90%;
            max-width: 600px;
            position: relative;
        }
        .search-overlay-inner form {
            display: flex;
            gap: 10px;
        }
        .sakura-search-input {
            flex: 1;
            padding: 16px 24px;
            border: 2px solid #F4A7B9;
            border-radius: 50px;
            font-size: 1.1rem;
            font-family: "Nunito", sans-serif;
            background: #fff;
            color: #5D3D2E;
            outline: none;
            transition: border-color 0.2s;
        }
        .sakura-search-input:focus {
            border-color: #D4567A;
        }
        .sakura-search-input::placeholder {
            color: #c4a89e;
        }
        .sakura-search-submit {
            padding: 16px 28px;
            background: linear-gradient(135deg, #F4A7B9, #D4567A);
            color: #fff;
            border: none;
            border-radius: 50px;
            font-family: "Nunito", sans-serif;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.2s;
        }
        .sakura-search-submit:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 15px rgba(212, 86, 122, 0.4);
        }
        .search-close {
            position: absolute;
            top: -50px;
            right: 0;
            background: none;
            border: none;
            color: #fff;
            font-size: 2.5rem;
            cursor: pointer;
            line-height: 1;
            transition: transform 0.2s;
        }
        .search-close:hover {
            transform: scale(1.2);
        }
        /* ===== CATEGORIES GRID ===== */
        .sakura-categories-section {
            padding: 60px 0;
            background: #fff;
        }
        .sakura-categories-section .section-title {
            text-align: center;
            font-family: "Playfair Display", serif;
            color: #5D3D2E;
            font-size: 2rem;
            margin-bottom: 8px;
        }
        .sakura-categories-section .section-subtitle {
            text-align: center;
            color: #8b6f5e;
            margin-bottom: 40px;
            font-size: 1.05rem;
        }
        .categories-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            max-width: 900px;
            margin: 0 auto;
        }
        .category-card {
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #fff5f7 0%, #fdf0f3 100%);
            border-radius: 16px;
            padding: 16px;
            text-decoration: none;
            color: #5D3D2E;
            border: 1.5px solid #fce4ec;
            transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .category-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(212, 86, 122, 0.15);
            border-color: #F4A7B9;
        }
        .category-image {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background-size: cover;
            background-position: center;
            flex-shrink: 0;
            margin-right: 14px;
        }
        .category-image-placeholder {
            background: linear-gradient(135deg, #F4A7B9, #D4567A);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .category-icon {
            font-size: 1.5rem;
        }
        .category-info {
            flex: 1;
        }
        .category-name {
            font-family: "Nunito", sans-serif;
            font-weight: 700;
            font-size: 1rem;
            margin: 0 0 4px;
            color: #5D3D2E;
        }
        .category-count {
            font-size: 0.85rem;
            color: #8b6f5e;
        }
        .categories-cta {
            text-align: center;
            margin-top: 30px;
        }
        /* ===== DELIVERY SECTION ===== */
        .sakura-delivery-section {
            padding: 60px 0;
            background: linear-gradient(135deg, #fff5f7 0%, #fef9fa 100%);
        }
        .sakura-delivery-section .section-title {
            text-align: center;
            font-family: "Playfair Display", serif;
            color: #5D3D2E;
            font-size: 2rem;
            margin-bottom: 40px;
        }
        .delivery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            max-width: 900px;
            margin: 0 auto;
        }
        .delivery-card {
            background: #fff;
            border-radius: 20px;
            padding: 30px 20px;
            text-align: center;
            border: 1.5px solid #fce4ec;
            position: relative;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .delivery-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(212, 86, 122, 0.12);
        }
        .delivery-icon {
            color: #D4567A;
            margin-bottom: 16px;
        }
        .delivery-card h3 {
            font-family: "Nunito", sans-serif;
            font-weight: 700;
            font-size: 1.1rem;
            color: #5D3D2E;
            margin-bottom: 8px;
        }
        .delivery-card p {
            color: #8b6f5e;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .delivery-card p a {
            color: #D4567A;
            text-decoration: none;
            font-weight: 600;
        }
        .delivery-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: linear-gradient(135deg, #F4A7B9, #D4567A);
            color: #fff;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 20px;
        }
        .pickup-badge {
            background: linear-gradient(135deg, #a8e6cf, #56c596);
        }
        .parking-badge {
            background: linear-gradient(135deg, #87ceeb, #4a90d9);
            font-size: 0.9rem;
            padding: 4px 8px;
        }
        .delivery-hours {
            text-align: center;
            margin-top: 30px;
            color: #5D3D2E;
            font-size: 0.95rem;
        }
        .delivery-hours strong {
            color: #D4567A;
        }
        /* ===== RESTAURANT INFO ===== */
        .sakura-restaurant-info {
            padding: 70px 0;
            background: #fff;
        }
        .restaurant-info-inner {
            display: flex;
            align-items: center;
            gap: 60px;
            max-width: 900px;
            margin: 0 auto;
        }
        .restaurant-info-text {
            flex: 1;
        }
        .restaurant-info-text .section-title {
            font-family: "Playfair Display", serif;
            color: #5D3D2E;
            font-size: 2rem;
            margin-bottom: 8px;
        }
        .restaurant-since {
            color: #D4567A;
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 16px;
        }
        .restaurant-info-text p {
            color: #5D3D2E;
            line-height: 1.7;
            margin-bottom: 14px;
            font-size: 1rem;
        }
        .restaurant-stats {
            display: flex;
            gap: 30px;
            margin-top: 24px;
        }
        .stat-item {
            text-align: center;
        }
        .stat-number {
            display: block;
            font-family: "Playfair Display", serif;
            font-size: 2rem;
            color: #D4567A;
            font-weight: 700;
        }
        .stat-label {
            font-size: 0.85rem;
            color: #8b6f5e;
        }
        .restaurant-info-decoration {
            text-align: center;
            flex-shrink: 0;
        }
        .info-jp-char {
            font-size: 6rem;
            color: #F4A7B9;
            opacity: 0.6;
            font-family: serif;
            line-height: 1;
        }
        .info-jp-sub {
            font-size: 0.9rem;
            color: #c4a89e;
            margin-top: 8px;
        }
        /* ===== CATERING SECTION ===== */
        .sakura-catering-section {
            padding: 60px 0;
            background: linear-gradient(135deg, #fff5f7 0%, #fef9fa 100%);
        }
        .catering-inner {
            display: flex;
            align-items: center;
            gap: 60px;
            max-width: 900px;
            margin: 0 auto;
        }
        .catering-content {
            flex: 1;
        }
        .catering-content .section-title {
            font-family: "Playfair Display", serif;
            color: #5D3D2E;
            font-size: 2rem;
            margin-bottom: 16px;
        }
        .catering-text {
            color: #5D3D2E;
            line-height: 1.7;
            margin-bottom: 16px;
        }
        .catering-features {
            list-style: none;
            padding: 0;
            margin: 0 0 20px;
        }
        .catering-features li {
            padding: 6px 0 6px 24px;
            position: relative;
            color: #5D3D2E;
            font-size: 0.95rem;
        }
        .catering-features li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #D4567A;
            font-weight: 700;
        }
        .catering-contact {
            margin-top: 20px;
        }
        .catering-contact p {
            color: #8b6f5e;
            margin-bottom: 10px;
            font-size: 0.9rem;
        }
        .catering-phone {
            display: inline-block;
            background: linear-gradient(135deg, #F4A7B9, #D4567A);
            color: #fff;
            padding: 10px 24px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.1rem;
            margin-right: 12px;
            transition: transform 0.15s, box-shadow 0.2s;
        }
        .catering-phone:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 15px rgba(212, 86, 122, 0.3);
            color: #fff;
        }
        .catering-whatsapp {
            display: inline-block;
            background: #25d366;
            color: #fff;
            padding: 10px 20px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: transform 0.15s;
        }
        .catering-whatsapp:hover {
            transform: scale(1.03);
            color: #fff;
        }
        .catering-decoration {
            text-align: center;
            flex-shrink: 0;
        }
        .catering-jp {
            font-size: 6rem;
            color: #F4A7B9;
            opacity: 0.6;
            font-family: serif;
            line-height: 1;
        }
        .catering-jp-sub {
            font-size: 0.9rem;
            color: #c4a89e;
            margin-top: 8px;
        }
        /* ===== MENU SECTION (HOMEPAGE CARDS) ===== */
        .sakura-menu-section {
            padding: 60px 0;
            background: linear-gradient(135deg, #fff5f7 0%, #fef9fa 100%);
        }
        .sakura-menu-section .section-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .sakura-menu-section .section-badge {
            display: inline-block;
            background: linear-gradient(135deg, #F4A7B9, #D4567A);
            color: #fff;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            margin-bottom: 12px;
        }
        .sakura-menu-section .section-title {
            font-family: "Playfair Display", serif;
            color: #5D3D2E;
            font-size: 2rem;
            margin-bottom: 8px;
        }
        .sakura-menu-section .section-subtitle {
            color: #8b6f5e;
            font-size: 1.05rem;
        }
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            max-width: 1100px;
            margin: 0 auto;
        }
        .menu-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1.5px solid #fce4ec;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
        }
        .menu-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(212, 86, 122, 0.12);
        }
        .menu-card-image {
            display: block;
            position: relative;
            aspect-ratio: 1;
            overflow: hidden;
        }
        .menu-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;
        }
        .menu-card:hover .menu-card-image img {
            transform: scale(1.05);
        }
        .menu-card-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, #F4A7B9, #D4567A);
            color: #fff;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 20px;
        }
        .menu-card-content {
            padding: 14px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .menu-card-title-link {
            text-decoration: none;
            color: inherit;
        }
        .menu-card-title {
            font-family: "Nunito", sans-serif;
            font-weight: 700;
            font-size: 0.95rem;
            color: #5D3D2E;
            margin: 0 0 6px;
            line-height: 1.3;
        }
        .menu-card-desc {
            font-size: 0.8rem;
            color: #8b6f5e;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        .menu-card-footer {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .menu-card-price {
            font-family: "Nunito", sans-serif;
            font-weight: 700;
            font-size: 1.1rem;
            color: #D4567A;
        }
        .menu-card-price del {
            color: #c4a89e;
            font-size: 0.85rem;
            font-weight: 400;
        }
        .menu-card-footer .product-quantity-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .menu-card-footer .quantity-selector {
            display: flex;
            align-items: center;
            border: 1.5px solid #fce4ec;
            border-radius: 8px;
            overflow: hidden;
        }
        .menu-card-footer .qty-btn {
            width: 28px;
            height: 28px;
            border: none;
            background: #fff5f7;
            color: #D4567A;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
        }
        .menu-card-footer .qty-btn:hover {
            background: #fce4ec;
        }
        .menu-card-footer .qty-input {
            width: 30px;
            text-align: center;
            border: none;
            font-size: 0.85rem;
            font-family: "Nunito", sans-serif;
            font-weight: 600;
            color: #5D3D2E;
            background: transparent;
        }
        .menu-card-footer .btn-add-cart {
            background: linear-gradient(135deg, #F4A7B9, #D4567A);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 6px 14px;
            font-size: 0.8rem;
            font-weight: 600;
            font-family: "Nunito", sans-serif;
            text-decoration: none;
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.2s;
            white-space: nowrap;
            display: inline-block;
            box-shadow: none !important;
        }
        .menu-card-footer .btn-add-cart:hover {
            transform: scale(1.03) !important;
            box-shadow: 0 4px 12px rgba(212, 86, 122, 0.3) !important;
        }
        .section-cta {
            text-align: center;
            margin-top: 30px;
        }
        /* ===== BTN SAKURA (shared) ===== */
        .btn-sakura {
            display: inline-block;
            background: linear-gradient(135deg, #F4A7B9, #D4567A);
            color: #fff;
            padding: 12px 32px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-family: "Nunito", sans-serif;
            font-size: 1rem;
            transition: transform 0.15s, box-shadow 0.2s;
        }
        .btn-sakura:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 20px rgba(212, 86, 122, 0.3);
            color: #fff;
        }
        /* ===== RESPONSIVE ===== */
        @media (max-width: 992px) {
            .menu-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            .delivery-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        @media (max-width: 768px) {
            .menu-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 14px;
            }
            .categories-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            .delivery-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            .restaurant-info-inner,
            .catering-inner {
                flex-direction: column;
                gap: 30px;
                text-align: center;
            }
            .restaurant-stats {
                justify-content: center;
            }
            .catering-features {
                text-align: left;
            }
            .search-overlay-inner form {
                flex-direction: column;
            }
            .sakura-search-submit {
                width: 100%;
            }
        }
        @media (max-width: 480px) {
            .menu-grid {
                grid-template-columns: 1fr;
            }
            .restaurant-stats {
                flex-direction: column;
                gap: 16px;
            }
        }
    </style>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Search overlay toggle
        var searchToggle = document.getElementById('search-toggle');
        var searchOverlay = document.getElementById('search-overlay');
        var searchClose = document.getElementById('search-close');
        var searchInput = document.getElementById('search-input');
        if (searchToggle && searchOverlay) {
            searchToggle.addEventListener('click', function(e) {
                e.preventDefault();
                searchOverlay.classList.add('active');
                setTimeout(function() { searchInput && searchInput.focus(); }, 100);
            });
            if (searchClose) {
                searchClose.addEventListener('click', function() {
                    searchOverlay.classList.remove('active');
                });
            }
            searchOverlay.addEventListener('click', function(e) {
                if (e.target === searchOverlay) {
                    searchOverlay.classList.remove('active');
                }
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                    searchOverlay.classList.remove('active');
                }
            });
        }
        // Quantity buttons (+/-)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('qty-minus') || e.target.classList.contains('qty-plus')) {
                var btn = e.target;
                var wrap = btn.closest('.quantity-selector');
                if (!wrap) return;
                var input = wrap.querySelector('.qty-input');
                if (!input) return;
                var val = parseInt(input.value) || 1;
                if (btn.classList.contains('qty-minus')) {
                    val = Math.max(1, val - 1);
                } else {
                    val = Math.min(99, val + 1);
                }
                input.value = val;
                // Update add-to-cart link quantity
                var addBtn = wrap.closest('.product-quantity-wrap').querySelector('.btn-add-cart, .add_to_cart_button');
                if (addBtn) {
                    addBtn.setAttribute('data-quantity', val);
                    var href = addBtn.getAttribute('href');
                    if (href) {
                        addBtn.setAttribute('href', href.replace(/quantity=\d+/, 'quantity=' + val));
                    }
                }
            }
        });
    });
    </script>
    <?php
}
add_action('wp_head', 'sakura_wc_block_styles', 9999);

// Pre-fill checkout fields and hide unnecessary ones
function sakura_default_checkout_fields($fields) {
    $fields['billing']['billing_country']['default'] = 'RU';
    $fields['billing']['billing_state']['default'] = 'MOW';
    $fields['billing']['billing_city']['default'] = 'Москва';
    $fields['billing']['billing_postcode']['default'] = '101000';
    $fields['shipping']['shipping_country']['default'] = 'RU';
    $fields['shipping']['shipping_state']['default'] = 'MOW';
    $fields['shipping']['shipping_city']['default'] = 'Москва';
    unset($fields['billing']['billing_country']);
    unset($fields['billing']['billing_state']);
    unset($fields['billing']['billing_postcode']);
    unset($fields['shipping']['shipping_country']);
    unset($fields['shipping']['shipping_state']);
    unset($fields['shipping']['shipping_postcode']);
    if (isset($fields['billing']['billing_phone'])) {
        $fields['billing']['billing_phone']['required'] = true;
        $fields['billing']['billing_phone']['label'] = 'Телефон';
    }
    return $fields;
}
add_filter('woocommerce_checkout_fields', 'sakura_default_checkout_fields');

// Force country and state for orders
function sakura_force_checkout_country($value, $input) {
    if ($input === 'billing_country' || $input === 'shipping_country') return 'RU';
    if ($input === 'billing_state' || $input === 'shipping_state') return 'MOW';
    if ($input === 'billing_city' || $input === 'shipping_city') return 'Москва';
    return $value;
}
add_filter('woocommerce_checkout_get_value', 'sakura_force_checkout_country', 10, 2);

// Style classic checkout - compact and styled
function sakura_classic_checkout_styles() {
    ?>
    <style>
        /* Ultra-compact checkout form */
        .woocommerce-checkout .woocommerce-billing-fields__field-wrapper .form-row {
            margin-bottom: 8px !important;
        }
        .woocommerce-checkout .woocommerce-billing-fields__field-wrapper input,
        .woocommerce-checkout .woocommerce-billing-fields__field-wrapper textarea,
        .woocommerce-checkout .woocommerce-billing-fields__field-wrapper select {
            border: 1.5px solid #F4A7B9 !important;
            border-radius: 10px !important;
            padding: 10px 14px !important;
            font-family: "Nunito", sans-serif !important;
            font-size: 0.9rem !important;
            background: #fdf8f5 !important;
            transition: border-color 0.2s, box-shadow 0.2s !important;
        }
        .woocommerce-checkout input:focus, .woocommerce-checkout textarea:focus {
            border-color: #D4567A !important;
            box-shadow: 0 0 0 2px rgba(212, 86, 122, 0.15) !important;
            outline: none !important;
        }
        .woocommerce-checkout label {
            font-family: "Nunito", sans-serif !important;
            font-size: 0.85rem !important;
            color: #5D3D2E !important;
            font-weight: 600 !important;
            margin-bottom: 3px !important;
            display: block !important;
        }
        #billing_country_field, #shipping_country_field,
        #billing_state_field, #shipping_state_field,
        #billing_postcode_field, #shipping_postcode_field {
            display: none !important;
        }
        #billing_city_field input { background-color: #fdf8f5; }
        .woocommerce-form-coupon-toggle .woocommerce-info {
            background: linear-gradient(135deg, #fff5f7 0%, #fdf0f3 100%) !important;
            border: 1.5px solid #F4A7B9 !important;
            border-radius: 10px !important;
            padding: 10px 14px !important;
            color: #5D3D2E !important;
            font-family: "Nunito", sans-serif !important;
            font-size: 0.85rem !important;
            margin-bottom: 12px !important;
        }
        .woocommerce-form-coupon-toggle .woocommerce-info::before { color: #D4567A !important; }
        .woocommerce-form-coupon-toggle .woocommerce-info a { color: #D4567A !important; font-weight: 600 !important; text-decoration: none !important; }
        .checkout_coupon {
            border: 1.5px solid #F4A7B9 !important;
            border-radius: 10px !important;
            padding: 12px !important;
            background: #fff5f7 !important;
            margin-bottom: 12px !important;
        }
        .checkout_coupon .button {
            background: linear-gradient(135deg, #F4A7B9 0%, #D4567A 100%) !important;
            color: white !important; border: none !important;
            border-radius: 8px !important; padding: 8px 16px !important;
            font-weight: 600 !important; cursor: pointer !important;
        }
        .woocommerce-checkout h3, .woocommerce-checkout h2 {
            font-family: "Playfair Display", serif !important;
            color: #5D3D2E !important;
            margin-bottom: 8px !important;
            font-size: 1.2rem !important;
        }
        .woocommerce-checkout .entry-title, .woocommerce-checkout .page-title {
            font-family: "Playfair Display", serif !important;
            color: #5D3D2E !important;
            font-size: 1.4rem !important;
            margin-bottom: 10px !important; margin-top: 5px !important;
        }
        .woocommerce-checkout .entry-content, .woocommerce-checkout .woocommerce { padding-top: 0 !important; }
        .woocommerce-checkout .woocommerce-shipping-fields { margin-top: 8px !important; }
        .woocommerce-checkout .woocommerce-additional-fields { margin-top: 8px !important; }
        .woocommerce-checkout #order_comments { min-height: 60px !important; }
        .woocommerce-checkout .woocommerce-checkout-review-order { margin-top: 12px !important; }
        .woocommerce-checkout .shop_table {
            border: 1.5px solid #F4A7B9 !important;
            border-radius: 10px !important; overflow: hidden !important;
        }
        .woocommerce-checkout .shop_table th, .woocommerce-checkout .shop_table td {
            padding: 8px 10px !important;
            font-family: "Nunito", sans-serif !important;
            font-size: 0.85rem !important; border-color: #fce4ec !important;
        }
        .woocommerce-checkout #place_order {
            background: linear-gradient(135deg, #F4A7B9 0%, #D4567A 100%) !important;
            color: white !important; border: none !important;
            border-radius: 25px !important; padding: 12px 24px !important;
            font-size: 1rem !important; font-weight: 700 !important;
            font-family: "Nunito", sans-serif !important;
            width: 100% !important; cursor: pointer !important;
            margin-top: 8px !important;
            transition: transform 0.15s, box-shadow 0.2s !important;
        }
        .woocommerce-checkout #place_order:hover {
            transform: scale(1.02) !important;
            box-shadow: 0 4px 15px rgba(212, 86, 122, 0.3) !important;
        }
        .woocommerce-checkout .wc_payment_methods {
            border: 1.5px solid #F4A7B9 !important;
            border-radius: 10px !important; padding: 10px !important;
            background: #fff5f7 !important; list-style: none !important;
        }
        .woocommerce-checkout .payment_method_cod label {
            font-family: "Nunito", sans-serif !important;
            color: #5D3D2E !important; font-size: 0.9rem !important;
        }
        @media (max-width: 768px) {
            .woocommerce-checkout .form-row-first,
            .woocommerce-checkout .form-row-last { width: 100% !important; }
            .woocommerce-checkout .woocommerce-billing-fields__field-wrapper { gap: 6px; }
        }
    </style>
    <?php
}
add_action('wp_head', 'sakura_classic_checkout_styles', 10000);

// Set city default value
function sakura_set_city_default($value, $input) {
    if ($input === 'billing_city' || $input === 'shipping_city') {
        return 'Москва';
    }
    return $value;
}
add_filter('woocommerce_checkout_get_value', 'sakura_set_city_default', 20, 2);

// Fix: Shop page title hidden behind fixed header
function sakura_shop_header_fix() {
    if (is_shop() || is_product_category() || is_product_tag()) {
        echo "<style>
            .sakura-shop-page {
                padding-top: 100px !important;
            }
            .shop-header {
                margin-top: 0 !important;
            }
            .shop-title {
                font-size: 2rem !important;
                word-break: break-word;
            }
        </style>";
    }
}
add_action('wp_head', 'sakura_shop_header_fix', 10001);

// Fix: Grid alignment issues in shop + card overflow + category btn background
function sakura_grid_fix_styles() {
    echo "<style>
        /* Fix grid alignment - override WooCommerce float-based layout */
        .woocommerce ul.products li.product,
        .woocommerce-page ul.products li.product {
            float: none !important;
            width: 100% !important;
            margin: 0 !important;
            clear: none !important;
            display: block !important;
        }
        .woocommerce ul.products li.first,
        .woocommerce-page ul.products li.first {
            clear: none !important;
        }
        .woocommerce ul.products li.last,
        .woocommerce-page ul.products li.last {
            margin-right: 0 !important;
        }

        /* Fix card footer overflow on homepage */
        /* Fixed card footer layout - button on separate line */
        .menu-card-footer .product-quantity-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            width: 100%;
        }
        .menu-card-footer .quantity-selector {
            flex-shrink: 0;
        }
        .menu-card-footer .btn-add-cart {
            width: 100%;
            flex: none;
            text-align: center;
            padding: 8px 14px !important;
            font-size: 0.82rem !important;
            white-space: nowrap;
            box-sizing: border-box;
            display: block;
        }
        /* Hide WooCommerce view cart link after adding */
        .menu-card-footer .added_to_cart,
        .product-quantity-wrap .added_to_cart {
            display: none !important;
        }
        /* Fix category buttons background - match site bg */
        .cat-btn {
            background: #FFFDF8 !important;
        }
        .cat-btn:hover {
            background: #FFF0F3 !important;
        }
        .cat-btn {
            background: #FFFDF8 !important;
        }
        .cat-btn:hover {
            background: #FFF0F3 !important;
        }
        .cat-btn.active {
            background: #D4567A !important;
        }

        /* Fix sticky category nav background */
        .category-nav {
            background: rgba(255, 253, 248, 0.95) !important;
        }

        /* Fix WooCommerce added-to-cart message */
        .woocommerce-message,
        .added_to_cart {
            font-family: \"Nunito\", sans-serif !important;
            border-radius: 8px !important;
        }
        a.added_to_cart {
            background: #5D3D2E !important;
            color: #fff !important;
            padding: 4px 12px !important;
            border-radius: 50px !important;
            font-size: 0.75rem !important;
            text-decoration: none !important;
            white-space: nowrap !important;
            margin-left: 6px !important;
        }
    </style>";
}
add_action('wp_head', 'sakura_grid_fix_styles', 10002);

// Fix: Remove clearfix pseudo-elements that break grid layout
function sakura_clearfix_fix() {
    echo '<style>
        .woocommerce ul.products::before,
        .woocommerce ul.products::after,
        .woocommerce-page ul.products::before,
        .woocommerce-page ul.products::after,
        ul.products::before,
        ul.products::after {
            display: none !important;
            content: none !important;
        }
    </style>';
}
add_action('wp_head', 'sakura_clearfix_fix', 10003);



function sakura_related_and_zoom_css() {
    echo '<style>
/* Related products - small cards in a row */
.related.products ul.products {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 15px !important;
}
.related.products ul.products li.product {
    width: 100% !important;
    margin: 0 !important;
    float: none !important;
}
.related.products ul.products li.product img {
    max-height: 150px;
    object-fit: cover;
    border-radius: 8px;
}
.related.products ul.products li.product .woocommerce-loop-product__title {
    font-size: 0.85rem !important;
}
.related.products ul.products li.product .price {
    font-size: 0.8rem !important;
}
.related.products h2 {
    font-size: 1.3rem !important;
    margin-bottom: 15px;
}
@media (max-width: 768px) {
    .related.products ul.products {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

/* Hide zoom icon on product image */
.woocommerce-product-gallery .woocommerce-product-gallery__trigger,
.woocommerce-product-gallery .zoomImg,
.woocommerce-product-gallery .woocommerce-product-gallery__image a::after {
    display: none !important;
}
.woocommerce-product-gallery .woocommerce-product-gallery__image a {
    cursor: default !important;
    pointer-events: none;
}
.woocommerce-product-gallery .woocommerce-product-gallery__image img {
    pointer-events: auto;
}
</style>';
}
add_action('wp_head', 'sakura_related_and_zoom_css', 10004);
