<?php
/**
 * makitdev theme setup, enqueueing, and registrations.
 *
 * @package makitdev
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme setup.
 */
function makitdev_setup() {
	load_theme_textdomain( 'makitdev', get_template_directory() . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'gallery', 'caption', 'style', 'script' )
	);
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/main.css' );

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'makitdev' ),
		)
	);
}
add_action( 'after_setup_theme', 'makitdev_setup' );

/**
 * Enqueue styles and scripts.
 */
function makitdev_scripts() {
	$version = wp_get_theme()->get( 'Version' );

	wp_enqueue_style(
		'makitdev-main',
		get_template_directory_uri() . '/assets/css/main.css',
		array(),
		$version
	);

	wp_enqueue_script(
		'makitdev-main',
		get_template_directory_uri() . '/assets/js/main.js',
		array(),
		$version,
		true
	);

	if ( is_page_template( 'page-contributors.php' ) || is_page( 'contributors' ) ) {
		wp_enqueue_style(
			'makitdev-contributors',
			get_template_directory_uri() . '/assets/css/contributors.css',
			array( 'makitdev-main' ),
			$version
		);
	}
}
add_action( 'wp_enqueue_scripts', 'makitdev_scripts' );

/**
 * Route /contributors automatically to page-contributors.php if not created in WP admin.
 */
function makitdev_contributors_template( $template ) {
	if ( is_page( 'contributors' ) || is_page_template( 'page-contributors.php' ) ) {
		$custom = get_template_directory() . '/page-contributors.php';
		if ( file_exists( $custom ) ) {
			return $custom;
		}
	}
	if ( is_404() ) {
		$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
		$path        = trim( (string) wp_parse_url( $request_uri, PHP_URL_PATH ), '/' );
		if ( 'contributors' === $path ) {
			global $wp_query;
			$wp_query->is_404 = false;
			status_header( 200 );
			$custom = get_template_directory() . '/page-contributors.php';
			if ( file_exists( $custom ) ) {
				return $custom;
			}
		}
	}
	return $template;
}
add_filter( 'template_include', 'makitdev_contributors_template' );

/**
 * The homepage metadata short-circuit for WordPress.
 */
function makitdev_document_title_parts( $title ) {
	if ( is_front_page() ) {
		$title['title'] = __( 'Open Source Software', 'makitdev' );
	}
	return $title;
}
add_filter( 'document_title_parts', 'makitdev_document_title_parts' );