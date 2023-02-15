<?php

namespace F2;

class Form {

	public $key = '';
	public $fields = array(); // Only the data fields.
	public $data = array();

	public function setKey( $key ) {
		$this->key = $key;
	}

	public function setData( $data ) {
		$this->data = $data;
	}

	public function addField( $field ) {
		$this->fields[] = $field;
	}

	public function setFields( $fields ) {
		$this->fields = $fields;
	}

	public function loadByPost( $postId ) {

		$field_post = get_post( $postId );
		$field_meta = get_post_meta( $postId );
		$this->key = $field_meta['key'][0];

		// Set fields from meta.
		$fieldList = $field_meta['fields'][0];
		$this->fields = explode(',',$fieldList);

	}

	public function render() {

		echo '<pre>';
		var_dump( $this );
		echo '</pre>';


		// Render form fields.
		if( ! empty( $this->fields ) ) {
			foreach( $this->fields as $fieldId ) {
				$field = new Field();
				$field->loadByPost($fieldId);
				$field->render();
			}
		}

	}

}
