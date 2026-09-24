<?php
/**
 * Template Name: Contributors Page
 *
 * Contributors page template.
 *
 * Renders the contributor cards from assets/data/contributors.json, the
 * same data file the static contributors.html page uses. Keep the copy
 * and data in sync between the two versions.
 *
 * @package makitdev
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contributors_file = get_template_directory() . '/assets/data/contributors.json';
$contributors      = array();

if ( file_exists( $contributors_file ) ) {
	$data = json_decode( (string) file_get_contents( $contributors_file ), true );
	if ( is_array( $data ) ) {
		$contributors = $data;
	}
}

if ( ! function_exists( 'makitdev_contributor_avatar' ) ) {
	function makitdev_contributor_avatar( array $contributor ) {
		$base = isset( $contributor['avatar'] ) && '' !== $contributor['avatar']
			? $contributor['avatar']
			: 'https://github.com/' . rawurlencode( $contributor['username'] ) . '.png';
		$base = ( false === strpos( $base, '?' ) ) ? $base . '?s=144' : $base . '&s=144';
		return $base;
	}
}

if ( ! function_exists( 'makitdev_contributor_link' ) ) {
	function makitdev_contributor_link( array $contributor ) {
		if ( isset( $contributor['github'] ) && '' !== $contributor['github'] ) {
			return $contributor['github'];
		}
		return 'https://github.com/' . rawurlencode( $contributor['username'] );
	}
}

get_header();
?>

<main id="main">

	<!-- Intro -->
	<section class="section" id="contributors" aria-labelledby="contributors-title">
		<div class="container">
			<p class="label"><?php esc_html_e( 'Contributors', 'makitdev' ); ?></p>
			<h1 class="section-title" id="contributors-title"><?php esc_html_e( 'People building makitdev in the open.', 'makitdev' ); ?></h1>
			<p class="statement-copy"><?php esc_html_e( 'The list below comes from the repository\'s contributor data and always reflects the people who have helped build makitdev, whatever the size of the contribution.', 'makitdev' ); ?></p>
		</div>
	</section>

	<!-- Roster -->
	<section class="section section--tight" id="roster" aria-labelledby="roster-heading">
		<div class="container">
			<h2 class="sr-only" id="roster-heading"><?php esc_html_e( 'Contributor list', 'makitdev' ); ?></h2>
			<?php if ( ! empty( $contributors ) ) : ?>
				<ul class="contributors-grid" aria-label="<?php esc_attr_e( 'Contributors', 'makitdev' ); ?>">
					<?php foreach ( $contributors as $person ) :
						if ( ! is_array( $person ) || empty( $person['username'] ) ) {
							continue;
						}
						?>
						<li class="contributor reveal">
							<img
								class="contributor-avatar"
								src="<?php echo esc_url( makitdev_contributor_avatar( $person ) ); ?>"
								alt="<?php echo esc_attr( isset( $person['name'] ) ? $person['name'] : $person['username'] ); ?>"
								width="144"
								height="144"
								loading="lazy"
							>
							<div class="contributor-body">
								<div class="contributor-head">
									<div>
										<h3 class="contributor-name"><?php echo esc_html( isset( $person['name'] ) ? $person['name'] : '@' . $person['username'] ); ?></h3>
										<p class="contributor-handle">@<?php echo esc_html( $person['username'] ); ?></p>
									</div>
									<a class="contributor-link tlink" href="<?php echo esc_url( makitdev_contributor_link( $person ) ); ?>" target="_blank" rel="noopener noreferrer">
										<?php esc_html_e( 'GitHub', 'makitdev' ); ?> <span class="arrow" aria-hidden="true">↗</span>
									</a>
								</div>
								<?php if ( ! empty( $person['role'] ) ) : ?>
									<p class="contributor-role"><?php echo esc_html( $person['role'] ); ?></p>
								<?php endif; ?>
								<?php if ( ! empty( $person['contribution'] ) ) : ?>
									<p class="contributor-desc"><?php echo esc_html( $person['contribution'] ); ?></p>
								<?php endif; ?>
							</div>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php else : ?>
				<p class="statement-copy"><?php esc_html_e( 'No contributors listed yet.', 'makitdev' ); ?></p>
			<?php endif; ?>
		</div>
	</section>

	<!-- Contribute -->
	<section class="section section--tight" id="contribute" aria-labelledby="contribute-title">
		<div class="container center">
			<p class="label reveal"><?php esc_html_e( 'Want to contribute?', 'makitdev' ); ?></p>
			<h2 class="section-title reveal" id="contribute-title" style="--reveal-delay: 90ms"><?php esc_html_e( 'Build. Share. Improve.', 'makitdev' ); ?></h2>
			<p class="statement-copy reveal" style="--reveal-delay: 160ms"><?php esc_html_e( 'Explore the source, open an issue, or send a pull request. Every contribution counts.', 'makitdev' ); ?></p>
			<div class="cta-actions reveal" style="--reveal-delay: 240ms">
				<a class="tlink" href="https://github.com/makitdev/makitdev/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">
					<?php esc_html_e( 'View CONTRIBUTING.md', 'makitdev' ); ?> <span class="arrow" aria-hidden="true">↗</span>
				</a>
				<a class="tlink" href="https://github.com/makitdev" target="_blank" rel="noopener noreferrer">
					<?php esc_html_e( 'GitHub Organization', 'makitdev' ); ?> <span class="arrow" aria-hidden="true">↗</span>
				</a>
			</div>
		</div>
	</section>

</main>

<?php
get_footer();