<?php

register_post_type(
	'app',
	array(
		'label'  => 'App',
		'labels' => array(
			'name'          => 'Apps',
			'singular_name' => 'App',
		),
		'public' => true,
		'show_in_rest' => true,
		'supports'     => array(
			'title',
			'custom-fields'
		),
	)
);
