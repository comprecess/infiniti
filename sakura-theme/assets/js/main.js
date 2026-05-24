/**
 * Sakura Theme — Main JavaScript
 * Hanami Breeze Style
 */

(function($) {
    'use strict';

    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('sakura-nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu on link click
        nav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.sakura-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.sakura-header');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(93, 61, 46, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // AJAX Add to Cart
    $(document).on('click', '.btn-add-cart', function(e) {
        e.preventDefault();
        const $btn = $(this);
        const productId = $btn.data('product-id');

        if (!productId) return;

        $btn.addClass('loading');

        $.ajax({
            url: wc_add_to_cart_params ? wc_add_to_cart_params.ajax_url : sakuraAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'woocommerce_ajax_add_to_cart',
                product_id: productId,
                quantity: 1,
            },
            success: function(response) {
                if (response.error && response.product_url) {
                    window.location = response.product_url;
                    return;
                }

                // Update cart count
                $.ajax({
                    url: sakuraAjax.ajaxurl,
                    type: 'POST',
                    data: { action: 'sakura_cart_count' },
                    success: function(count) {
                        $('.sakura-cart-count').text(count);
                    }
                });

                // Visual feedback
                $btn.addClass('added');
                setTimeout(function() {
                    $btn.removeClass('added loading');
                }, 1500);

                // Trigger WC fragments refresh
                $(document.body).trigger('wc_fragment_refresh');
            },
            error: function() {
                $btn.removeClass('loading');
            }
        });
    });

    // Reservation form
    $('#sakura-reservation-form').on('submit', function(e) {
        e.preventDefault();
        const $form = $(this);
        const $btn = $form.find('button[type="submit"]');

        $btn.text('Отправка...').prop('disabled', true);

        $.ajax({
            url: sakuraAjax.ajaxurl,
            type: 'POST',
            data: $form.serialize() + '&action=sakura_reservation&nonce=' + sakuraAjax.nonce,
            success: function(response) {
                $btn.text('Забронировано ✓');
                $form[0].reset();
                setTimeout(function() {
                    $btn.text('Забронировать').prop('disabled', false);
                }, 3000);
            },
            error: function() {
                $btn.text('Ошибка, попробуйте снова').prop('disabled', false);
            }
        });
    });

    // Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.menu-card, .about-feature, .gallery-item').forEach(function(el) {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

})(jQuery);

/* ===== QUANTITY SELECTOR FUNCTIONALITY ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Quantity buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-minus') || e.target.classList.contains('qty-plus')) {
            var productId = e.target.getAttribute('data-product-id');
            var input = document.getElementById('qty-' + productId);
            if (!input) return;
            
            var currentVal = parseInt(input.value) || 1;
            
            if (e.target.classList.contains('qty-plus')) {
                input.value = currentVal + 1;
            } else if (e.target.classList.contains('qty-minus') && currentVal > 1) {
                input.value = currentVal - 1;
            }
            
            // Update the add-to-cart link's data-quantity
            var card = e.target.closest('.sakura-product-card');
            if (card) {
                var addBtn = card.querySelector('.add_to_cart_button');
                if (addBtn) {
                    addBtn.setAttribute('data-quantity', input.value);
                    // Also update the URL
                    var url = new URL(addBtn.href, window.location.origin);
                    url.searchParams.set('quantity', input.value);
                    addBtn.href = url.toString();
                }
            }
        }
    });
});
