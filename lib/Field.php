<?php

namespace F2;

class Field {

	public $type; // FieldType Object.
	public $typeKey; // FieldType key only (select | text | ...).
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
		$this->typeKey = $field_meta['type'][0];
		$this->type = FieldType::getFieldTypeClass($this->typeKey);

		// Make label.
		$label = new Label();
		$label->text = $field_meta['label'][0];
		$this->addElement($label);

		// Make control.
		$control = new Control();
		$control->setKey( $field_meta['key'][0] );

		switch( $this->typeKey ) {
			case 'select':
			case 'post_select':
				$control->setType('select');
				break;
			default:
				$control->setType('text');
				break;
		}

		$control->setPlaceholder( $field_meta['placeholder'][0] );

		// Control choices.
		$choices = explode(',',$field_meta['choices'][0]);
		$control->setChoices($choices);

		$this->addElement($control);

	}

	/* Render the entire field, including all defined elements and control. */
	public function render() {

		// Render buttons using the FieldType::render() method.
		if( $this->typeKey === 'button' || $this->typeKey === 'post_select' ) {
			$this->type->render($this->elements);
			return;
		}

		foreach( $this->elements as $element ) {
			if( $element->elementType === 'label' ) {
				$element->render();
			}
			if( $element->elementType === 'control' ) {
				if( $this->typeKey === 'select' ) {
					$this->type->renderControl($element);
				} else {
					$element->render();
				}

			}
		}

	}

}
