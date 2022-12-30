<?php

class App {

	public $storage = null;
	public $form = null;
	public $records = array(); // Records record loaded from storage.
	public $recordJson = null; // Records in JSON for JS.

	public function setStorage( $storage ) {
		$this->storage = $storage;
	}

	public function setForm( $form ) {
		$this->form = $form;
	}

	public function storageInit() {

		if( $this->storage->type !== 'post' ) { return; }

		// Register post type.
		$result = register_post_type(
			$this->storage->key,
			array(
				'label'  => 'Quotes',
				'labels' => array(
					'name'          => $this->storage->name,
					'singular_name' => $this->storage->singleName,
				),
				'public' => true,
				'show_in_rest' => true,
				'supports'     => array(
					'title',
					'custom-fields'
				),
			)
		);

		// Register meta fields.
		foreach( $this->form->fields as $field ) {
			$result = register_meta( 'post', $field->key, array(
				'object_subtype' => 'quote',
		    'type'           => 'string',
			  'single'         => true,
		    'show_in_rest'   => true,
				'default'        => 'Text Not Set',
			));
		}

	}

}
