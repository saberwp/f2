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
require_once( F2_PATH . '/lib/FieldGroup.php' );
require_once( F2_PATH . '/lib/FieldType.php' );
require_once( F2_PATH . '/lib/Field.php' );
require_once( F2_PATH . '/lib/Label.php' );
require_once( F2_PATH . '/lib/Storage.php' );
require_once( F2_PATH . '/lib/Schema.php' );
require_once( F2_PATH . '/lib/Fetch.php' );

add_action('wp_enqueue_scripts', function() {

	// Enqueue main F2 app controller script.
	wp_enqueue_script(
		'f2-main',
		F2_URL . 'js/main.js',
		array(),
		time(),
		true
	);

	// Localize app data for use by JS.
	global $app1;
	wp_localize_script( 'f2-main', 'f2app', $app1 );

});

add_action('init', function() {

	require_once( F2_PATH . '/wp/post_type_app.php' );
	require_once( F2_PATH . '/wp/post_type_form.php' );
	require_once( F2_PATH . '/wp/post_type_entry.php' );

}, 15);

add_action('init', function() {

	// Init application.
	global $app1;
	$app1 = new App();

	// Assemble form.
	$form = new Form();

	$storage = new Storage();
	$storage->setType('post');
	$storage->setKey('quote');
	$storage->setName('Quotes');
	$storage->setSingleName('Quote');
	$app1->setStorage( $storage );

	// Quote Text Field.
	$fg = new FieldGroup();
	$fg->setClasses('flex flex-col gap-1');
	$label = new Label();
	$label->setText('Quote');
	$label->setClasses('block font-semibold pb-1 text-gray-500');
	$fg->addElement( $label );
	$field = new Field();
	$field->setKey('text');
	$field->setClasses('border border-solid border-gray-700 px-2 py-1 text-sm');
	$field->setPlaceholder('Quote text...');
	$fg->addElement( $field );
	$form->addField( $field );

	// Author Field.
	$fg2 = new FieldGroup();
	$fg2->setClasses('flex flex-col gap-1');
	$label = new Label();
	$label->setText('Author');
	$label->setClasses('block font-semibold pb-1 text-gray-500');
	$fg2->addElement( $label );
	$field = new Field();
	$field->setKey('author');
	$field->setClasses('border border-solid border-gray-700 px-2 py-1 text-sm');
	$field->setPlaceholder('Author name...');
	$fg2->addElement( $field );
	$form->addField( $field );

	$form->setFieldGroups([$fg, $fg2]);

	// Add form to app.
	$app1->setForm($form);

	// Setup storage.
	$app1->storageInit();

}, 20);
