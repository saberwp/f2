<?php

class Label {

	public $type = 'label';
	public $classes = '';
	public $text = 'Label';

	public function setClasses( $classes ) {
		$this->classes = $classes;
	}

	public function setText( $text ) {
		$this->text = $text;
	}

	public function render() {

		echo '<label class="' . $this->classes . '">' . $this->text . '</label>';

	}

}
