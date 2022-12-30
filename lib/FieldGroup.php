<?php

class FieldGroup {

	public $elements = array();
	public $classes = '';

	public function addElement( $element ) {
		$this->elements[] = $element;
	}

	public function setClasses( $classes ) {
		$this->classes = $classes;
	}

	// $data is passed from the Form render loop.
	public function render( $data ) {

		echo '<div class="' . $this->classes . '">';
		if( !empty( $this->elements )) {
			foreach( $this->elements as $element ) {

				// Check if we are rendering a field type.
				if ($element instanceof Field && ! empty( $data )) {
					foreach( $data as $key => $value ) {
						if( $key === $element->key ) {
							$element->value = $value;
						}
					}
				}

				// Render with or without value.
				$element->render();

			}
		}
		echo '</div>';

	}

}
