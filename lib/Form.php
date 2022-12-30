<?php

class Form {

	public $storage = null;
	public $fieldGroups = array(); // Used for rendering fields and labels.
	public $fields = array(); // Only the data fields.
	public $data = array();

	public function setStorage( $storage ) {
		$this->storage = $storage;
	}

	public function setData( $data ) {
		$this->data = $data;
	}

	public function addField( $field ) {
		$this->fields[] = $field;
	}

	public function setFieldGroups( $fieldGroups ) {
		$this->fieldGroups = $fieldGroups;
	}

}
