<?php

class Field {

	public $type = 'field';
	public $key = '';
	public $classes = '';
	public $placeholder = '';

	public function setKey( $key ) {
		$this->key = $key;
	}

	public function setClasses( $classes ) {
		$this->classes = $classes;
	}

	public function setPlaceholder( $placeholder ) {
		$this->placeholder = $placeholder;
	}

	public function render() {
		if( isset( $this->value ) ) {
			echo '<input id="' . $this->key . '" name="' . $this->key . '" class="' . $this->classes . '" type="text" placeholder="' . $this->placeholder . '" value="' . $this->value . '" />';
			return;
		}
		echo '<input id="' . $this->key . '" name="' . $this->key . '" class="' . $this->classes . '" type="text" placeholder="' . $this->placeholder . '" />';
	}

}
