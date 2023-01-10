<?php

namespace F2;

class FieldType {

	// $key - text | select...
	public function getFieldTypeClass( $key ) {
		switch( $key ) {
			case 'select':
				return new FieldType\Select();
				break;
		}
	}



}
