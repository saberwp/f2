<?php

namespace F2;

class App {

	public $models = array();
	public $records = array(); // Records record loaded from storage.

	public function addModel( $model ) {
		$this->models[] = $model;
	}

	public function storageInit() {
		if( empty( $this->models ) ) { return; }
		foreach( $this->models as $model ) {
			// Register post type.
			$result = register_post_type(
				$model->key,
				array(
					'label'  => $model->storage->name,
					'labels' => array(
						'name'          => $model->storage->name,
						'singular_name' => $model->storage->singleName,
					),
					'public' => true,
					'show_in_rest' => true,
					'supports'     => array(
						'title',
						'custom-fields'
					),
				)
			);

			// Register meta fields.
			foreach( $model->form->fields as $field ) {
				$result = register_meta( 'post', $field->key, array(
					'object_subtype' => $model->key,
			    'type'           => 'string',
				  'single'         => true,
			    'show_in_rest'   => true,
					'default'        => 'Text Not Set',
				));
			}
		}
	}

	// Used to output the main app container with context based on the $post.
	static public function render( $post ) {
		echo '<div id="f2app" app-id="' . $post->ID . '"></div>';
	}

	public function make( $postId ) {

		// Setup app object and storage.
		$app = new App();

		// Load app post and models.
		$appPost = get_post($postId);
		$appModels = get_post_meta($appPost->ID, 'models', 1);

		if( strlen( $appModels ) < 2 ) {
			return $app;
		}

		$appModelIds = explode(',', $appModels); // Parse the comma-seperated list of fields (1,2,3).

		// Load model post and model fields.
		if( empty( $appModelIds ) ) {
			return $app;
		}

		foreach( $appModelIds as $appModelPostId ) {

			$appModelPost = get_post($appModelPostId);
			$modelKey = get_post_meta($appModelPost->ID, 'key', 1);
			$modelName = get_post_meta($appModelPost->ID, 'name', 1);
			$modelSingleName = get_post_meta($appModelPost->ID, 'singleName', 1);
			$modelForms = get_post_meta($appModelPost->ID, 'forms', 1);

			// Setup app object and storage.
			$model = new Model();
			$model->setKey($modelKey);
			$storage = new Storage();
			$storage->setName($modelName);
			$storage->setSingleName($modelSingleName);
			$model->setStorage($storage);

			// Assemble form.
			$formPost = get_post($modelForms);
			$formFields = get_post_meta($formPost->ID, 'fields', 1);
			$formFields = explode(',', $formFields); // Parse the comma-seperated list of fields (1,2,3).
			$form = new Form();

			// Make fields.
			$fields = [];
			if( ! empty( $formFields )) {

				foreach( $formFields as $fieldPostId ) {

					$fieldPost = get_post($fieldPostId);
					if( ! $fieldPost || get_post_type($fieldPostId) !== 'field' ) {
						// Field ID is not a valid field.
						continue;
					}

					$fieldType = get_post_meta($fieldPost->ID, 'type', 1);
					$fieldLabel = get_post_meta($fieldPost->ID, 'label', 1);
					$fieldKey = get_post_meta($fieldPost->ID, 'key', 1);
					$fieldPlaceholder = get_post_meta($fieldPost->ID, 'placeholder', 1);
					$fieldChoices = get_post_meta($fieldPost->ID, 'choices', 1);
					$field = new Field();
					$field->setClasses('flex flex-col gap-1');
					$label = new Label();
					$label->setText($fieldLabel);
					$label->setClasses('block font-semibold pb-1 text-gray-500');
					$field->addElement( $label );
					$control = new Control();
					$control->setKey($fieldKey);
					$control->setType($fieldType);
					$control->setClasses('border border-solid border-gray-700 px-2 py-1 text-sm');
					$control->setPlaceholder($fieldPlaceholder);

					if( $control->type === 'select' ) {
						$control->setChoicesByJson($fieldChoices);
					}

					if( $control->type === 'post_select' ) {
						$postType = $fieldChoices;
						$choicePosts = get_posts(array(
							'post_type' => $postType,
							'numberposts' => -1,
						));
						$choices = array();
						foreach( $choicePosts as $cp ) {
							$choice = array(
								'value' => $cp->ID,
								'label' => get_post_meta( $cp->ID, 'name', 1),
							);
							$choices[] = $choice;
						}
						$control->setChoices($choices);
					}

					$field->addElement($control);
					$form->addControl($control);
					$fields[] = $field;
				}
			}

			// Add fields to form.
			if( ! empty( $fields ) ) {
				$form->setFields($fields);
			}

			// Add form to model.
			$model->setForm($form);

			// Add model to app.
			$app->addModel( $model );

		}

		return $app;

	}

}
