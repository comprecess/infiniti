<?php
/**
 * Template Part: Delivery Info
 * Блок бесплатной доставки и скидки на самовывоз
 */
?>
<section class="sakura-delivery-section" id="delivery">
    <div class="container">
        <h2 class="section-title">Доставка и самовывоз</h2>
        <div class="delivery-grid">
            <div class="delivery-card delivery-card-free">
                <div class="delivery-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M1 3h15v13H1z"/>
                        <path d="M16 8h4l3 3v5h-7V8z"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                </div>
                <h3>Бесплатная доставка</h3>
                <p>Доставляем бесплатно по Москве</p>
                <span class="delivery-badge">Бесплатно</span>
            </div>
            <div class="delivery-card delivery-card-pickup">
                <div class="delivery-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                </div>
                <h3>Самовывоз &minus;15%</h3>
                <p>Скидка 15% при самовывозе из ресторана</p>
                <span class="delivery-badge pickup-badge">&minus;15%</span>
            </div>
            <div class="delivery-card delivery-card-parking">
                <div class="delivery-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="1" y="3" width="22" height="18" rx="2"/>
                        <path d="M9 17V7h4a3 3 0 010 6H9"/>
                    </svg>
                </div>
                <h3>Бесплатная парковка</h3>
                <p>По предварительному звонку<br><a href="tel:+79153873651">+7 (915) 387-36-51</a></p>
                <span class="delivery-badge parking-badge">P</span>
            </div>
        </div>
        <div class="delivery-hours">
            <p><strong>Ресторан:</strong> 12:00 &ndash; 23:00 &nbsp;|&nbsp; <strong>Доставка:</strong> 12:00 &ndash; 21:00</p>
        </div>
    </div>
</section>
