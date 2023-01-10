<?php

namespace F2;

class Control {

	public $elementType = 'control';
	public $type = '';
	public $key = '';
	public $classes = 'border border-solid border-gray-700 px-2 py-1 text-sm';
	public $placeholder = '';
	public $choices = array();

	public function setKey( $key ) {
		$this->key = $key;
	}

	public function setType( $type ) {
		$this->type = $type;
	}

	public function setClasses( $classes ) {
		$this->classes = $classes;
	}

	public function setPlaceholder( $placeholder ) {
		$this->placeholder = $placeholder;
	}

	public function setChoices( $choices ) {
		$this->choices = $choices;
	}

	public function setChoicesByJson( $choicesJson ) {
		$this->choices = json_decode($choicesJson);
	}

	public function render() {
		echo '<input type="text" placeholder="' . $this->placeholder . '" class="' . $this->classes . '" />';
	}

}
