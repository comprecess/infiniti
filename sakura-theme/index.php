<?php get_header(); ?>

<main class="sakura-main">
    <div class="container">
        <div class="page-header">
            <h1><?php
                if (is_home()) echo 'Блог';
                elseif (is_archive()) the_archive_title();
                elseif (is_search()) echo 'Результаты поиска: ' . get_search_query();
            ?></h1>
        </div>

        <div class="posts-grid">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                <article class="post-card">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-card-image">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium_large'); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                    <div class="post-card-content">
                        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <p><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
                        <a href="<?php the_permalink(); ?>" class="read-more">Читать далее →</a>
                    </div>
                </article>
            <?php endwhile; endif; ?>
        </div>

        <?php the_posts_pagination(array('mid_size' => 2)); ?>
    </div>
</main>

<?php get_footer(); ?>
