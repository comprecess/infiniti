<?php get_header(); ?>

<main class="sakura-main">
    <div class="container">
        <div class="error-404">
            <span class="error-jp">迷子</span>
            <h1>404</h1>
            <p>Страница не найдена. Возможно, она была перемещена или удалена.</p>
            <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary">Вернуться на главную</a>
        </div>
    </div>
</main>

<?php get_footer(); ?>
