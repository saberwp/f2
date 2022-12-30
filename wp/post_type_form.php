<?php

$result = register_post_type(
	'form',
	array(
		'label'  => 'Forms',
		'labels' => array(
			'name'          => 'Forms',
			'singular_name' => 'Form'
		),
		'public' => true,
	)
);
