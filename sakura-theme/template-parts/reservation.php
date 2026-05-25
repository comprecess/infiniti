<section class="sakura-reservation" id="reservation">
    <div class="container">
        <div class="reservation-inner">
            <div class="reservation-info">
                <span class="section-badge">ご予約</span>
                <h2 class="section-title">Забронировать стол</h2>
                <p>Забронируйте столик и насладитесь вечером в атмосфере цветущей сакуры</p>
                <div class="reservation-contacts">
                    <div class="contact-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        <span><?php echo esc_html(get_theme_mod('sakura_phone', '+7 (915) 387-36-51')); ?></span>
                    </div>
                    <div class="contact-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span><?php echo esc_html(get_theme_mod('sakura_hours', 'Пн — Вс: 12:00 — 23:00')); ?></span>
                    </div>
                </div>
            </div>
            <div class="reservation-form">
                <form id="sakura-reservation-form" method="post">
                    <?php wp_nonce_field('sakura_reservation', 'sakura_nonce_field'); ?>
                    <div class="form-group">
                        <label for="res-name">Ваше имя</label>
                        <input type="text" id="res-name" name="name" required placeholder="Введите имя">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="res-phone">Телефон</label>
                            <input type="tel" id="res-phone" name="phone" required placeholder="+7 (___) ___-__-__">
                        </div>
                        <div class="form-group">
                            <label for="res-guests">Гостей</label>
                            <select id="res-guests" name="guests">
                                <option value="1">1</option>
                                <option value="2" selected>2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6+">6+</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="res-date">Дата</label>
                            <input type="date" id="res-date" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="res-time">Время</label>
                            <input type="time" id="res-time" name="time" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="res-comment">Пожелания</label>
                        <textarea id="res-comment" name="comment" rows="3" placeholder="Особые пожелания..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Забронировать</button>
                </form>
            </div>
        </div>
    </div>
</section>
