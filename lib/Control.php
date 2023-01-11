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
		switch( $this->type ) {
			case 'text':
				echo '<input type="text" placeholder="' . $this->placeholder . '" class="' . $this->classes . '" />';
				break;
			case 'select':
			echo '<select id="' . $this->key . '">';
				foreach($this->choices as $choice) {
					echo '<option value="' . $choice . '">' . $choice . '</option>';
				}
				echo '</select>';
				break;
		}

	}

}
