<?php

namespace F2;

class Field {

	public $type; // FieldType Object.
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

		// Metas: key, label, placeholder, type, choices.
		$field_meta = get_post_meta( $postId );

		// Parse field type key from meta.
		$fieldTypeKey = $field_meta['type'][0];

		// Make label.
		$label = new Label();
		$label->text = $field_meta['label'][0];
		$this->addElement($label);

		// Make control.
		$control = new Control();
		$control->setKey( $field_meta['key'][0] );
		$control->setType( $field_meta['type'][0] );
		$control->setPlaceholder( $field_meta['placeholder'][0] );
		$this->addElement($control);

	}

	/* Render the entire field, including all defined elements and control. */
	public function render() {

		foreach( $this->elements as $element ) {
			if( $element->elementType === 'label' ) {
				$element->render();
			}
			if( $element->elementType === 'control' ) {
				$element->render();
			}
		}

	}

}
