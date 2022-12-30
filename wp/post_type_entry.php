<?php

$result = register_post_type(
	'entry',
	array(
		'label'  => 'Entries',
		'labels' => array(
			'name'          => 'Entries',
			'singular_name' => 'Entry'
		),
		'public' => true,
	)
);
