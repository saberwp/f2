<?php

class Field {

	public $elements = array();
	public $classes = '';

	public function addElement( $element ) {
		$this->elements[] = $element;
	}

	public function setClasses( $classes ) {
		$this->classes = $classes;
	}

}
