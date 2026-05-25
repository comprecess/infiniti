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
                <div class="footer-requisites">
                    <p>ООО «Фуд Технолоджи»</p>
                    <p>ИНН 7714895127 / ОГРН 1137746027210</p>
                </div>
            </div>
            <div class="footer-col">
                <h4>Контакты</h4>
                <ul class="footer-contacts">
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        <a href="tel:+79153873651">+7 (915) 387-36-51</a>
                    </li>
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        <a href="tel:+79037918585">+7 (903) 791-85-85</a>
                    </li>
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ул. Красина 7/1, ст.м. «Маяковская»
                    </li>
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Пн — Вс: 12:00 — 23:00
                    </li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Ссылки</h4>
                <ul class="footer-menu">
                    <li><a href="/terms-conditions/">Пользовательское соглашение</a></li>
                    <li><a href="/privacy-policy/">Политика конфиденциальности</a></li>
                    <li><a href="/refund-returns/">Оформление и возврат заказа</a></li>
                    <li><a href="/contacts/">Контакты и как нас найти</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Связь</h4>
                <ul class="footer-menu">
                    <li><a href="https://vk.com/sakurarestaurant" target="_blank" rel="noopener">ВКонтакте</a></li>
                    <li><a href="https://t.me/+IENKtlrabEsyZWYy" target="_blank" rel="noopener">Telegram</a></li>
                    <li><a href="http://wa.me/79037918585" target="_blank" rel="noopener">WhatsApp</a></li>
                </ul>
                <h4 style="margin-top: 1.5rem;">Часы работы</h4>
                <ul class="footer-contacts">
                    <li>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Пн — Вс: 12:00 — 23:00
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
