<?php

class Storage {

	public $type;
	public $key;
	public $name;
	public $singleName;

	public function setType( $type ) {
		$this->type = $type;
	}

	public function setKey( $key ) {
		$this->key = $key;
	}

	public function setName( $name ) {
		$this->name = $name;
	}

	public function setSingleName( $singleName ) {
		$this->singleName = $singleName;
	}

}
