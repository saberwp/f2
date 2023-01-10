<?php

namespace F2;

class FormProcessor {


	public function process( $form ) {

		if( isset( $_POST ) && ! empty( $_POST ) ) {

			$fieldMap = array();
			foreach( $form->fields as $field ) {
				$fieldMap[ $field->key ] = $_POST[ $field->key ];
			}

			wp_insert_post(
				array(
					'post_title'  => time(),
					'post_type'   => $form->storage->key,
					'post_status' => 'publish',
					'meta_input'  => $fieldMap,
				),
				false,
				true
			);
		}

	}

}
