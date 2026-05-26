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

    // AJAX Add to Cart (handles both .btn-add-cart and .ajax_add_to_cart)
    $(document).on('click', '.btn-add-cart, .ajax_add_to_cart', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        var $btn = $(this);
        var productId = $btn.data('product_id') || $btn.data('product-id');
        var quantity = parseInt($btn.attr('data-quantity')) || 1;
        // Read from adjacent qty input if available
        var $qtyInput = $btn.closest('.product-quantity-wrap, .product-quantity-inline, .sakura-product-card').find('.qty-input');
        if ($qtyInput.length) { quantity = parseInt($qtyInput.val()) || 1; }

        if (!productId) return;

        $btn.addClass('loading');

        $.ajax({
            url: (typeof wc_add_to_cart_params !== 'undefined') ? wc_add_to_cart_params.ajax_url : sakuraAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'woocommerce_ajax_add_to_cart',
                product_id: productId,
                quantity: quantity,
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
                $btn.addClass('added').text('✓');
                setTimeout(function() {
                    $btn.removeClass('added loading').text('В корзину');
                }, 1500);

                // Trigger WC fragments refresh
                // Save scroll position before fragment refresh
                var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
                $(document.body).trigger('wc_fragment_refresh');
                // Restore scroll position after fragment refresh
                setTimeout(function() { window.scrollTo(0, scrollPos); }, 100);
                setTimeout(function() { window.scrollTo(0, scrollPos); }, 300);
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
        $btn.text('Проверка...').prop('disabled', true);
        
        // Get reCAPTCHA v3 token before submitting
        if (typeof grecaptcha !== 'undefined' && sakuraAjax.recaptchaSiteKey) {
            grecaptcha.ready(function() {
                grecaptcha.execute(sakuraAjax.recaptchaSiteKey, {action: 'reservation'}).then(function(token) {
                    $('#recaptcha-token').val(token);
                    sakuraSubmitReservation($form, $btn);
                }).catch(function() {
                    // If reCAPTCHA fails, still submit (honeypot + timer will protect)
                    sakuraSubmitReservation($form, $btn);
                });
            });
        } else {
            sakuraSubmitReservation($form, $btn);
        }
    });
    
    function sakuraSubmitReservation($form, $btn) {
        $btn.text('Отправка...');
        $.ajax({
            url: sakuraAjax.ajaxurl,
            type: 'POST',
            data: $form.serialize() + '&action=sakura_reservation&nonce=' + sakuraAjax.nonce,
            success: function(response) {
                if (response.success) {
                    $btn.text('Забронировано ✓');
                    $form[0].reset();
                    // Reset timestamp for next submission
                    $('#form-loaded-at').val(Math.floor(Date.now() / 1000));
                } else {
                    $btn.text(response.data.message || 'Ошибка');
                }
                setTimeout(function() {
                    $btn.text('Забронировать').prop('disabled', false);
                }, 3000);
            },
            error: function() {
                $btn.text('Ошибка, попробуйте снова').prop('disabled', false);
            }
        });
    }
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
    // Quantity buttons - single handler (no duplicates)
    document.addEventListener('click', function(e) {
        var btn = e.target;
        if (!btn.classList.contains('qty-minus') && !btn.classList.contains('qty-plus')) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        var productId = btn.getAttribute('data-product-id');
        var input = document.getElementById('qty-' + productId) || document.getElementById('qty-home-' + productId);
        if (!input) {
            // Fallback: find input in same container
            var wrap = btn.closest('.quantity-selector');
            if (wrap) input = wrap.querySelector('.qty-input');
        }
        if (!input) return;
        
        var currentVal = parseInt(input.value) || 1;
        
        if (btn.classList.contains('qty-plus')) {
            currentVal = Math.min(99, currentVal + 1);
        } else if (btn.classList.contains('qty-minus') && currentVal > 1) {
            currentVal = currentVal - 1;
        }
        
        input.value = currentVal;
        
        // Update the add-to-cart link's data-quantity
        var card = btn.closest('.sakura-product-card') || btn.closest('.product-quantity-wrap');
        if (card) {
            var addBtn = card.querySelector('.add_to_cart_button, .btn-add-cart');
            if (addBtn) {
                addBtn.setAttribute('data-quantity', currentVal);
                // Also update the URL
                var href = addBtn.getAttribute('href');
                if (href) {
                    try {
                        var url = new URL(href, window.location.origin);
                        url.searchParams.set('quantity', currentVal);
                        addBtn.href = url.toString();
                    } catch(ex) {}
                }
            }
        }
    }, true); // Use capture phase to prevent duplicate handlers
});

/* === Fix: Handle qty buttons in WooCommerce single product quantity selector === */
document.addEventListener('click', function(e) {
    var btn = e.target;
    if (!btn.classList.contains('qty-btn')) return;
    
    var wrap = btn.closest('.quantity-selector') || btn.closest('.quantity');
    if (!wrap) return;
    
    var input = wrap.querySelector('input.qty') || wrap.querySelector('.qty-input') || wrap.querySelector('input[type="number"]');
    if (!input) return;
    
    var currentVal = parseInt(input.value) || 1;
    var min = parseInt(input.getAttribute('min')) || 1;
    var max = parseInt(input.getAttribute('max')) || 99;
    
    if (btn.classList.contains('qty-plus')) {
        if (currentVal < max) {
            input.value = currentVal + 1;
        }
    } else if (btn.classList.contains('qty-minus')) {
        if (currentVal > min) {
            input.value = currentVal - 1;
        }
    }
    
    // Trigger change event for WooCommerce
    var event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);
    
    // Also trigger input event
    var inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
});


// Fix coupon form - smooth CSS transition toggle (v1.9.4)
jQuery(document).ready(function($) {
    // Remove WooCommerce's default showcoupon handler
    $(document.body).off('click', 'a.showcoupon');
    $(document).off('click', '.woocommerce-form-coupon-toggle a');
    
    // Use capturing event listener to intercept before WooCommerce
    document.addEventListener('click', function(e) {
        var link = e.target.closest('.woocommerce-form-coupon-toggle a, a.showcoupon');
        if (link) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var couponForm = document.querySelector('.checkout_coupon');
            if (couponForm) {
                // Remove any inline display style that WooCommerce might set
                couponForm.style.display = '';
                if (couponForm.classList.contains('coupon-visible')) {
                    couponForm.classList.remove('coupon-visible');
                } else {
                    couponForm.classList.add('coupon-visible');
                }
            }
            return false;
        }
    }, true); // true = capturing phase, runs before bubbling handlers
});