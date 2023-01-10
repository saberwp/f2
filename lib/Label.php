<?php

namespace F2;

class Label {

	public $elementType = 'label';
	public $classes = 'block font-semibold pb-1 text-gray-500';
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
