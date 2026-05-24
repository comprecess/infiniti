<?php get_header(); ?>

<main class="sakura-main">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <article class="single-post">
                <header class="post-header">
                    <h1><?php the_title(); ?></h1>
                    <div class="post-meta">
                        <?php sakura_posted_on(); ?> | <?php sakura_posted_by(); ?>
                    </div>
                </header>
                <?php if (has_post_thumbnail()) : ?>
                    <div class="post-featured-image">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>
