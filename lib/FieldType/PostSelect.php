<?php

namespace F2\FieldType;

class PostSelect {

	public $key = 'post_select';

	public function render($elements) {
		foreach( $elements as $element ) {
			$element->render();
		}
	}


}
