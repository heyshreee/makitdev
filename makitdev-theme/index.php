<?php
/**
 * Fallback template (the default page loop).
 *
 * The organization landing page lives in front-page.php; this file
 * covers every other view in a simple, on-brand way.
 *
 * @package makitdev
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<main id="main">
	<section class="section">
		<div class="container">
			<?php
			if ( have_posts() ) :
				while ( have_posts() ) :
					the_post();
					?>
					<article <?php post_class( 'reveal-in-view' ); ?>>
						<header>
							<h1 class="section-title"><?php the_title(); ?></h1>
							<?php if ( has_post_thumbnail() ) : ?>
								<figure><?php the_post_thumbnail(); ?></figure>
							<?php endif; ?>
						</header>
						<div class="section-copy">
							<?php the_content(); ?>
						</div>
					</article>
				<?php endwhile; ?>
			<?php else : ?>
				<p class="statement-copy"><?php esc_html_e( 'Nothing here yet.', 'makitdev' ); ?></p>
			<?php endif; ?>
		</div>
	</section>
</main>

<?php
get_footer();