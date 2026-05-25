<footer class="sakura-footer" id="contacts">
    <div class="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,40 1440,50 L1440,100 L0,100 Z" fill="currentColor"/>
        </svg>
    </div>
    <div class="container">
        <div class="footer-grid">
            <div class="footer-col footer-brand">
                <div class="footer-logo">
                    <span class="logo-jp">桜</span>
                    <span class="logo-text"><?php bloginfo('name'); ?></span>
                </div>
                <p class="footer-desc">Изысканная японская кухня в атмосфере цветущей сакуры</p>
            </div>

            <div class="footer-col">
                <h4>Контакты</h4>
                <ul class="footer-contacts">
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        <?php echo esc_html(get_theme_mod('sakura_phone', '+7 (999) 123-45-67')); ?>
                    </li>
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <?php echo esc_html(get_theme_mod('sakura_address', 'ул. Сакуры, 1, Москва')); ?>
                    </li>
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Пн-Чт: 12:00 — 23:00
                    </li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Навигация</h4>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer',
                    'container'      => false,
                    'menu_class'     => 'footer-menu',
                    'fallback_cb'    => false,
                ));
                ?>
            </div>

            <div class="footer-col">
                <h4>Часы работы</h4>
                <ul class="footer-contacts">
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Пн-Чт: 12:00 — 23:00
                    </li>
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Пт-Сб: 12:00 — 01:00
                    </li>
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Вс: 13:00 — 22:00
                    </li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. Все права защищены.</p>
        </div>
    </div>
</footer>

<!-- Scroll to top button -->
<button class="scroll-to-top" id="scrollToTop" aria-label="Наверх">
    <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
</button>
<script>
(function() {
    var btn = document.getElementById("scrollToTop");
    if (!btn) return;
    window.addEventListener("scroll", function() {
        if (window.scrollY > 300) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    });
    btn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();
</script>
<?php wp_footer(); ?>
</body>
</html>
