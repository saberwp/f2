<?php

namespace F2\FieldType;

class Select {

	public $key = 'select';

	public function renderControl($control) {

		echo '<select id="' . $control->key . '">';
		foreach($control->choices as $choice) {
			echo '<option value="' . $choice . '">' . $choice . '</option>';
		}
		echo '</select>';

	}


}
