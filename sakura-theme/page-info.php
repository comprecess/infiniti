<?php
/**
 * Template Name: Информационная страница
 */
get_header(); ?>

<main class="sakura-page-content">
    <div class="page-hero-mini">
        <h1><?php the_title(); ?></h1>
    </div>
    <div class="container">
        <article class="page-article">
            <?php while (have_posts()) : the_post(); ?>
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
            <?php endwhile; ?>
        </article>
    </div>
</main>

<?php get_footer(); ?>
