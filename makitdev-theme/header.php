<?php
/**
 * Theme header: doctype, head, and minimal navigation.
 *
 * @package makitdev
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="makitdev is an open-source organization building useful software, developer tools, security utilities, applications, and experiments.">
	<meta name="theme-color" content="#0a0a0b">

	<meta property="og:type" content="website">
	<meta property="og:title" content="makitdev — Build. Share. Improve.">
	<meta property="og:description" content="Open-source software, tools, and experiments built in public.">
	<meta property="og:site_name" content="makitdev">

	<link rel="icon" type="image/svg+xml" href="<?php echo esc_url( get_template_directory_uri() . '/assets/images/favicon.svg' ); ?>">
	<?php wp_head(); ?>

	<script>
		(function () {
			var d = document.documentElement;
			d.classList.add("js");
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				d.classList.add("is-loaded");
			} else {
				requestAnimationFrame(function () {
					d.classList.add("is-loaded");
				});
			}
		})();
	</script>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'makitdev' ); ?></a>

<header class="site-header">
	<div class="container nav-inner">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">makitdev</a>
		<nav aria-label="<?php esc_attr_e( 'Primary', 'makitdev' ); ?>">
			<?php
			if ( has_nav_menu( 'primary' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'menu_class'     => 'nav-links',
						'container'      => false,
						'depth'          => 1,
					)
				);
			} else {
				?>
				<ul class="nav-links">
					<li><a href="<?php echo esc_url( home_url( '/#about' ) ); ?>"><?php esc_html_e( 'About', 'makitdev' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/contributors/' ) ); ?>"><?php esc_html_e( 'Contributors', 'makitdev' ); ?></a></li>
					<li><a class="nav-gh" href="<?php echo esc_url( 'https://github.com/makitdev' ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'GitHub', 'makitdev' ); ?> <span class="arrow" aria-hidden="true">↗</span></a></li>
				</ul>
				<?php
			}
			?>
		</nav>
	</div>
</header>