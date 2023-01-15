<?php

namespace F2;

class CoreApp {

	public function make() {

		// Setup app object and storage.
		$app = new App();

		$app = $this->appModel($app);
		$app = $this->modelModel($app);
		$app = $this->formModel($app);
		$app = $this->fieldModel($app);

		return $app;

	}

	public function appModel( $app ) {
		$model = new Model();
		$model->setKey('app');
		$storage = new Storage();
		$storage->setName('Apps');
		$storage->setSingleName('App');
		$model->setStorage($storage);

		$form = new Form();
		$form->setKey('app_form');

		// Field: app_name
		$field = new Field();
		$field->setKey('app_name');
		$label = new Label();
		$label->setText('App Name');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('app_name');
		$control->setType('text');
		$control->setPlaceholder('App name...');
		$field->addElement($control);
		$form->addField($control);

		// Field: models.
		$field = new Field();
		$field->setKey('models');
		$label = new Label();
		$label->setText('Models');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('models');
		$control->setType('text');
		$control->setPlaceholder('Models...');
		$field->addElement($control);
		$form->addField($control);

		$model->setForm($form);
		$app->addModel( $model );
		return $app;
	}

	public function modelModel( $app ) {
		$model = new Model();
		$model->setKey('model');
		$storage = new Storage();
		$storage->setName('Models');
		$storage->setSingleName('Model');
		$model->setStorage($storage);

		$form = new Form();

		// Field: key
		$field = new Field();
		$label = new Label();
		$label->setText('Key');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('key');
		$control->setType('text');
		$control->setPlaceholder('Model key...');
		$field->addElement($control);
		$form->addField($control);
		$fields[] = $field;

		// Field: name.
		$field = new Field();
		$label = new Label();
		$label->setText('Name');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('name');
		$control->setType('text');
		$control->setPlaceholder('Model name...');
		$field->addElement($control);
		$form->addField($control);
		$fields[] = $field;

		// Field: single_name.
		$field = new Field();
		$label = new Label();
		$label->setText('Single Name');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('single_name');
		$control->setType('text');
		$control->setPlaceholder('Model single name...');
		$field->addElement($control);
		$form->addField($control);
		$fields[] = $field;

		// Field: forms.
		$field = new Field();
		$label = new Label();
		$label->setText('Forms');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('forms');
		$control->setType('text');
		$control->setPlaceholder('Forms...');
		$field->addElement($control);
		$form->addField($control);

		$model->setForm($form);
		$app->addModel($model);
		return $app;
	}

	public function formModel( $app ) {
		$model = new Model();
		$model->setKey('form');
		$storage = new Storage();
		$storage->setName('Forms');
		$storage->setSingleName('Form');
		$model->setStorage($storage);

		$form = new Form();

		// Field: key
		$field = new Field();
		$label = new Label();
		$label->setText('Key');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('key');
		$control->setType('text');
		$control->setPlaceholder('Form key...');
		$field->addElement($control);
		$form->addField($control);

		// Field: fields.
		$field = new Field();
		$label = new Label();
		$label->setText('Fields');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('fields');
		$control->setType('text');
		$control->setPlaceholder('Fields...');
		$field->addElement($control);
		$form->addField($control);

		$model->setForm($form);
		$app->addModel($model);
		return $app;
	}

	public function fieldModel( $app ) {

		$model = new Model();
		$model->setKey('field');
		$storage = new Storage();
		$storage->setName('Fields');
		$storage->setSingleName('Field');
		$model->setStorage($storage);

		$form = new Form();

		// Field: type
		$field = new Field();
		$label = new Label();
		$label->setText('Type');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('type');

		// Make choices.
		$control->setType('select');
		$choice1 = new \stdClass;
		$choice1->value = 'text';
		$choice1->label = 'Text';

		$choice2 = new \stdClass;
		$choice2->value = 'select';
		$choice2->label = 'Select';

		$choice3 = new \stdClass;
		$choice3->value = 'button';
		$choice3->label = 'Button';

		$choice4 = new \stdClass;
		$choice4->value = 'post_select';
		$choice4->label = 'Post Select';

		$control->setChoices(
			array(
				$choice1,
				$choice2,
				$choice3,
				$choice4,
			)
		);
		$field->addElement($control);
		$form->addField($control);
		$fields[] = $field;

		// Field: key
		$field = new Field();
		$label = new Label();
		$label->setText('Key');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('key');
		$control->setType('text');
		$control->setPlaceholder('Field key...');
		$field->addElement($control);
		$form->addField($control);
		$fields[] = $field;

		// Field: label
		$field = new Field();
		$label = new Label();
		$label->setText('Label');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('label');
		$control->setType('text');
		$control->setPlaceholder('Label...');
		$field->addElement($control);
		$form->addField($control);
		$fields[] = $field;

		// Field: placeholder
		$field = new Field();
		$label = new Label();
		$label->setText('Placeholder');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('placeholder');
		$control->setType('text');
		$control->setPlaceholder('Placeholder...');
		$field->addElement($control);
		$form->addField($control);
		$fields[] = $field;

		// Field: choices.
		$field = new Field();
		$label = new Label();
		$label->setText('Choices');
		$field->addElement( $label );
		$control = new Control();
		$control->setKey('choices');
		$control->setType('text');
		$control->setPlaceholder('Choices...');
		$field->addElement($control);
		$form->addField($control);

		$model->setForm($form);
		$app->addModel($model);
		return $app;
	}

}
