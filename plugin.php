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
require_once( F2_PATH . '/lib/Label.php' );
require_once( F2_PATH . '/lib/Storage.php' );
require_once( F2_PATH . '/lib/Schema.php' );
require_once( F2_PATH . '/lib/Fetch.php' );
require_once( F2_PATH . '/lib/Model.php' );

add_action('wp_enqueue_scripts', function() {

	// Enqueue model controller script.
	wp_enqueue_script(
		'f2-model',
		F2_URL . 'js/model.js',
		array(),
		time(),
		true
	);

	// Enqueue main F2 app controller script.
	wp_enqueue_script(
		'f2-main',
		F2_URL . 'js/main.js',
		array(),
		time(),
		true
	);

	// Localize app data for use by JS.
	$postType = get_post_type();
	if( 'app' === $postType ) {
		global $post;
		$appObj = new App;
		$app = $appObj->make($post->ID);
		wp_localize_script( 'f2-main', 'f2app', $app );
	}

});

// Register app post types.
add_action('init', function() {

	$appPosts = get_posts(array(
		'post_type' => 'app',
		'numberposts' => -1,
	));

	if( !empty( $appPosts )) {
		$appObj = new App;
		foreach( $appPosts as $appPost ) {
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
