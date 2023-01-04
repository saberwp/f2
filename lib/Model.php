<?php

class Model {

	public $key;
	public $storage = null;
	public $form = null;

	public function setKey( $key ) {
		$this->key = $key;
	}

	public function setStorage( $storage ) {
		$this->storage = $storage;
	}

	public function setForm( $form ) {
		$this->form = $form;
	}

}
