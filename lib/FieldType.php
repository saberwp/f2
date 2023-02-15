<?php

namespace F2;

class FieldType {

	// $key - text | select...
	public static function getFieldTypeClass( $key ) {
		switch( $key ) {
			case 'select':
				return new FieldType\Select();
				break;
			case 'button':
				return new FieldType\Button();
			break;
			case 'post_select':
				return new FieldType\PostSelect();
				break;
			default:
				return new FieldType\Text();
				break;
		}
	}



}
