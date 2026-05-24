<section class="sakura-gallery" id="gallery">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">ギャラリー</span>
            <h2 class="section-title">Галерея</h2>
            <p class="section-subtitle">Атмосфера нашего ресторана</p>
        </div>

        <div class="gallery-grid">
            <?php
            $gallery_images = get_posts(array(
                'post_type'      => 'attachment',
                'post_mime_type' => 'image',
                'posts_per_page' => 6,
                'post_status'    => 'inherit',
                'meta_key'       => '_sakura_gallery',
                'meta_value'     => '1',
            ));

            if (!empty($gallery_images)) :
                foreach ($gallery_images as $image) :
                    $img_url = wp_get_attachment_image_url($image->ID, 'sakura-gallery');
            ?>
                <div class="gallery-item">
                    <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($image->post_title); ?>" loading="lazy">
                </div>
            <?php
                endforeach;
            else :
            ?>
                <div class="gallery-placeholder">
                    <p>Добавьте изображения в галерею через медиабиблиотеку WordPress</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>
