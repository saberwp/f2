<?php

class CoreApp {

	public function make() {

		// Setup app object and storage.
		$app = new App();

		$model = new Model();
		$model->setKey('app');
		$storage = new Storage();
		$storage->setName('Apps');
		$storage->setSingleName('App');
		$model->setStorage($storage);

		$form = new Form();

		$field = new Field();
		$label = new Label();
		$label->setText('App Name');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('app_name');
		$control->setType('text');
		$control->setPlaceholder('App name...');
		$field->addElement($control);
		$form->addControl($control);
		$fields[] = $field;
		$form->setFields($fields);
		$model->setForm($form);
		$app->addModel( $model );

	}

}
