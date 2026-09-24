<?php
/**
 * Theme footer.
 *
 * @package makitdev
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$github_url = 'https://github.com/makitdev';
?>

<footer class="site-footer">
	<div class="container">
		<div class="footer-top">
			<div>
				<p class="footer-brand"><?php esc_html_e( 'makitdev', 'makitdev' ); ?></p>
				<p class="footer-tagline"><?php esc_html_e( 'Build. Share. Improve.', 'makitdev' ); ?></p>
			</div>
			<a href="<?php echo esc_url( $github_url ); ?>" target="_blank" rel="noopener noreferrer">
				<?php esc_html_e( 'GitHub', 'makitdev' ); ?> <span class="arrow" aria-hidden="true">↗</span>
			</a>
		</div>
		<div class="footer-bottom">
			<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php esc_html_e( 'makitdev · Open-source software.', 'makitdev' ); ?></p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>