<?php

namespace F2\FieldType;

class Button {

	public $key = 'button';

	public function render() {
		echo '<button type="submit">GO</button>';
	}

}
