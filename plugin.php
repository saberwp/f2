<?php

/*
 * Plugin Name: F2 WordPress Plugin
 */

/*
 * File Docs
 * LOC: 87
 * Functions:
 ***** Require PHP classes.
 ***** Register App post types including first, \F2\CoreApp().
 ***** Filter single_template.
 ***** Filter page_template.
 ***** Action wp_enqueue_scripts, enq, 3 scripts and 1 stylesheet, TW output.
 */

define( 'F2_PATH', plugin_dir_path( __FILE__ ) );
define( 'F2_URL', plugin_dir_url( __FILE__ ) );
define( 'F2_VERSION', '0.0.2' );
define( 'F2_TEXT_DOMAIN', 'acf-engine');

require_once( F2_PATH . '/lib/App.php' );
require_once( F2_PATH . '/lib/Form.php' );
require_once( F2_PATH . '/lib/FormProcessor.php' );
require_once( F2_PATH . '/lib/Field.php' );
require_once( F2_PATH . '/lib/FieldType.php' );
require_once( F2_PATH . '/lib/Control.php' );
require_once( F2_PATH . '/lib/CoreApp.php' );
require_once( F2_PATH . '/lib/Label.php' );
require_once( F2_PATH . '/lib/Storage.php' );
require_once( F2_PATH . '/lib/Schema.php' );
require_once( F2_PATH . '/lib/Fetch.php' );
require_once( F2_PATH . '/lib/Model.php' );

// Field Types.
require_once( F2_PATH . '/lib/FieldType/Text.php' );
require_once( F2_PATH . '/lib/FieldType/Select.php' );
require_once( F2_PATH . '/lib/FieldType/Button.php' );
require_once( F2_PATH . '/lib/FieldType/PostSelect.php' );

// Register app post types.
add_action('init', function() {

	require_once( F2_PATH . '/wp/post-types/app.php' );

	$coreApp = new \F2\CoreApp();
	$app = $coreApp->make();
	$app->storageInit();

	$appPosts = get_posts(array(
		'post_type' => 'app',
		'numberposts' => -1,
	));

	if( ! empty( $appPosts )) {
		$appObj = new \F2\App;
		foreach( $appPosts as $appPost ) {
			if( $appPost->post_name === 'app' ) {
				continue;
			}
			$app = $appObj->make($appPost->ID);
			$app->storageInit();
		}
	}
}, 1);

// Provide single app template.
add_filter('single_template', function( $template, $type, $templates ) {

	// Target only F2 apps.
	if( 'app' !== get_post_type() ) {
		return $template;
	}

	return F2_PATH . '/wp/templates/single-app.php';

}, 10, 3);

// Provide docs template.
add_filter('page_template', function( $template, $type, $templates ) {

	// Target only F2 apps.
	global $post;
	if( 91 !== $post->ID && 95 !== $post->ID ) {
		return $template;
	}

	if( 91 === $post->ID ) {
		return F2_PATH . '/wp/templates/page-docs.php';
	}

	if( 95 === $post->ID ) {
		return F2_PATH . '/wp/templates/page-builder.php';
	}

}, 10, 3);

add_action('wp_enqueue_scripts', function() {

	wp_enqueue_script( 'wp-api' );

	wp_enqueue_script(
		'f2-main',
		F2_URL . '/src/main.js',
		array( 'wp-api' ),
		time(),
		true
	);

	wp_enqueue_script(
		'f2-inline-create',
		F2_URL . '/src/f2.inlineCreate.js',
		array( 'f2-main' ),
		time(),
		true
	);

	wp_enqueue_style(
		'saberm-inter',
		'https://rsms.me/inter/inter.css',
		array(),
		time(),
		'all'
	);

	wp_enqueue_style(
		'f2-output',
		F2_URL . '/dist/output.css',
		array(),
		time(),
		'all'
	);

});
