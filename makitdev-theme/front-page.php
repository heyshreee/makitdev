<?php
/**
 * Front page template.
 *
 * The homepage copy lives here so it stays easy to edit later.
 *
 * @package makitdev
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$github_url = 'https://github.com/makitdev';
?>

<main id="main">

	<!-- Hero -->
	<section class="hero">
		<div class="container">
			<div class="hero-inner">
				<p class="label" data-hero><?php esc_html_e( 'Open Source Software', 'makitdev' ); ?></p>
				<h1>
					<span class="line" data-hero style="--hero-delay: 80ms"><?php esc_html_e( 'Build.', 'makitdev' ); ?></span>
					<span class="line" data-hero style="--hero-delay: 170ms"><?php esc_html_e( 'Share.', 'makitdev' ); ?></span>
					<span class="line" data-hero style="--hero-delay: 260ms"><?php esc_html_e( 'Improve.', 'makitdev' ); ?></span>
				</h1>
				<p data-hero style="--hero-delay: 380ms"><?php esc_html_e( 'makitdev is an open-source organization building useful software, tools, and experiments for the community.', 'makitdev' ); ?></p>
				<a class="tlink hero-cta" data-hero style="--hero-delay: 500ms" href="<?php echo esc_url( $github_url ); ?>" target="_blank" rel="noopener noreferrer">
					<?php esc_html_e( 'Explore GitHub', 'makitdev' ); ?> <i class="arrow" aria-hidden="true">↗</i>
				</a>
			</div>
		</div>
	</section>

	<!-- Introduction -->
	<section class="section" id="about" aria-labelledby="about-title">
		<div class="container about-grid">
			<p class="label reveal"><?php esc_html_e( '01 / About', 'makitdev' ); ?></p>
			<div class="section-copy reveal" style="--reveal-delay: 90ms">
				<h2 class="section-title" id="about-title"><?php esc_html_e( 'What is makitdev?', 'makitdev' ); ?></h2>
				<p><?php esc_html_e( 'makitdev is an open-source organization focused on building practical software and sharing it openly.', 'makitdev' ); ?></p>
				<p><?php esc_html_e( 'We experiment with ideas, build useful tools, and release software that others can inspect, use, modify, and improve.', 'makitdev' ); ?></p>
			</div>
		</div>
	</section>

	<!-- Principles -->
	<section class="section section--tight" id="principles" aria-labelledby="principles-heading">
		<div class="container">
			<div class="section-head reveal">
				<h2 class="label" id="principles-heading"><?php esc_html_e( '02 / Principles', 'makitdev' ); ?></h2>
			</div>
			<div class="principles">
				<article class="principle reveal">
					<p class="principle-num">01</p>
					<h3><?php esc_html_e( 'Build', 'makitdev' ); ?></h3>
					<p><?php esc_html_e( 'Create software that solves real problems.', 'makitdev' ); ?></p>
				</article>
				<article class="principle reveal">
					<p class="principle-num">02</p>
					<h3><?php esc_html_e( 'Share', 'makitdev' ); ?></h3>
					<p><?php esc_html_e( 'Keep useful software open and accessible.', 'makitdev' ); ?></p>
				</article>
				<article class="principle reveal">
					<p class="principle-num">03</p>
					<h3><?php esc_html_e( 'Improve', 'makitdev' ); ?></h3>
					<p><?php esc_html_e( 'Learn from others and make things better together.', 'makitdev' ); ?></p>
				</article>
			</div>
		</div>
	</section>

	<!-- What We Build -->
	<section class="section" id="builds" aria-labelledby="builds-title">
		<div class="container">
			<div class="section-head reveal">
				<p class="label"><?php esc_html_e( '03 / What We Build', 'makitdev' ); ?></p>
				<h2 class="section-title" id="builds-title"><?php esc_html_e( 'Software for curious minds.', 'makitdev' ); ?></h2>
			</div>
			<ul class="wwb-grid">
				<li class="cat" tabindex="0">
					<div class="cat-top">
						<h3><?php esc_html_e( 'Developer Tools', 'makitdev' ); ?></h3>
						<span class="arrow" aria-hidden="true">→</span>
					</div>
					<p class="cat-desc"><?php esc_html_e( 'CLI tools, libraries, APIs and utilities.', 'makitdev' ); ?></p>
				</li>
				<li class="cat" tabindex="0">
					<div class="cat-top">
						<h3><?php esc_html_e( 'Security', 'makitdev' ); ?></h3>
						<span class="arrow" aria-hidden="true">→</span>
					</div>
					<p class="cat-desc"><?php esc_html_e( 'Security tools, analysis utilities and defensive software.', 'makitdev' ); ?></p>
				</li>
				<li class="cat" tabindex="0">
					<div class="cat-top">
						<h3><?php esc_html_e( 'Applications', 'makitdev' ); ?></h3>
						<span class="arrow" aria-hidden="true">→</span>
					</div>
					<p class="cat-desc"><?php esc_html_e( 'Useful software built around real-world problems.', 'makitdev' ); ?></p>
				</li>
				<li class="cat" tabindex="0">
					<div class="cat-top">
						<h3><?php esc_html_e( 'Experiments', 'makitdev' ); ?></h3>
						<span class="arrow" aria-hidden="true">→</span>
					</div>
					<p class="cat-desc"><?php esc_html_e( 'Prototypes, research and technical experiments.', 'makitdev' ); ?></p>
				</li>
			</ul>
		</div>
	</section>

	<!-- Open Source -->
	<section class="section" id="open" aria-labelledby="open-title">
		<div class="container center">
			<p class="label reveal"><?php esc_html_e( '04 / Built In The Open', 'makitdev' ); ?></p>
			<h2 class="section-title reveal" id="open-title" style="--reveal-delay: 90ms"><?php esc_html_e( 'Open by default.', 'makitdev' ); ?></h2>
			<p class="statement-copy reveal" style="--reveal-delay: 160ms"><?php esc_html_e( 'Development happens in public. Source code, documentation, issues, discussions, and contributions are part of the process.', 'makitdev' ); ?></p>
			<ol class="flow" aria-label="<?php esc_attr_e( 'Workflow', 'makitdev' ); ?>">
				<li class="flow-step reveal"><?php esc_html_e( 'Idea', 'makitdev' ); ?></li>
				<li class="flow-arrow reveal" style="--reveal-delay: 60ms" aria-hidden="true">↓</li>
				<li class="flow-step reveal"><?php esc_html_e( 'Build', 'makitdev' ); ?></li>
				<li class="flow-arrow reveal" style="--reveal-delay: 60ms" aria-hidden="true">↓</li>
				<li class="flow-step reveal"><?php esc_html_e( 'Open', 'makitdev' ); ?></li>
				<li class="flow-arrow reveal" style="--reveal-delay: 60ms" aria-hidden="true">↓</li>
				<li class="flow-step reveal"><?php esc_html_e( 'Share', 'makitdev' ); ?></li>
				<li class="flow-arrow reveal" style="--reveal-delay: 60ms" aria-hidden="true">↓</li>
				<li class="flow-step reveal"><?php esc_html_e( 'Improve', 'makitdev' ); ?></li>
			</ol>
		</div>
	</section>

	<!-- CTA -->
	<section class="section section--tight" id="join" aria-labelledby="join-title">
		<div class="container center">
			<p class="label reveal"><?php esc_html_e( '05 / Join The Build', 'makitdev' ); ?></p>
			<h2 class="section-title reveal" id="join-title" style="--reveal-delay: 90ms"><?php esc_html_e( 'Build with us.', 'makitdev' ); ?></h2>
			<p class="statement-copy reveal" style="--reveal-delay: 160ms"><?php esc_html_e( 'Explore the source. Follow the work. Share an idea. Report a problem. Contribute.', 'makitdev' ); ?></p>
			<a class="cta-link reveal" style="--reveal-delay: 240ms" href="<?php echo esc_url( $github_url ); ?>" target="_blank" rel="noopener noreferrer">
				<?php esc_html_e( 'Explore makitdev on GitHub', 'makitdev' ); ?> <i class="arrow" aria-hidden="true">↗</i>
			</a>
		</div>
	</section>

</main>

<?php
get_footer();