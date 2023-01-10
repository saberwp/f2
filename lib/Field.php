<?php

class Field {

	public $elements = array();
	public $classes = 'flex flex-col gap-1';

	public function addElement( $element ) {
		$this->elements[] = $element;
	}

	public function setClasses( $classes ) {
		$this->classes = $classes;
	}

	public function loadByPost( $postId ) {
		$field_post = get_post( $postId );
		$field_meta = get_post_meta( $postId );
	}

	/* Render the entire field, including all defined elements and control. */
	public function render() {


	}

}
