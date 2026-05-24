<?php get_header(); ?>

<main class="sakura-main">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <article class="page-content">
                <h1 class="page-title"><?php the_title(); ?></h1>
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>
