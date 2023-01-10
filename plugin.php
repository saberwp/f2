<?php

/*
 * Plugin Name: F2 WordPress Plugin
 */

define( 'F2_PATH', plugin_dir_path( __FILE__ ) );
define( 'F2_URL', plugin_dir_url( __FILE__ ) );
define( 'F2_VERSION', '0.0.1' );
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

});

// Provide single app template.
add_filter('single_template', function( $template, $type, $templates ) {

	// Target only F2 apps.
	if( 'app' !== get_post_type() ) {
		return $template;
	}

	return F2_PATH . '/wp/templates/single-app.php';

}, 10, 3);

add_action('wp_enqueue_scripts', function() {

	wp_enqueue_script( 'wp-api' );

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
