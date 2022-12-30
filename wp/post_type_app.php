<?php

$result = register_post_type(
	'app',
	array(
		'label'  => 'Apps',
		'labels' => array(
			'name'          => 'Apps',
			'singular_name' => 'App'
		),
		'public' => true,
	)
);
