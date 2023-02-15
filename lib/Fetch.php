<?php

namespace F2;

class Fetch {

	public $postType = 'post';

	public function setPostType( $postType ) {
		$this->postType = $postType;
	}

	public function all() {

		$posts = get_posts(
			array(
				'post_type'   => $this->postType,
				'numberposts' => -1,
			)
		);

		foreach( $posts as $post ) {
			$post->meta = new stdClass;
			$post->meta->text = get_post_meta( $post->ID, 'text', 1 );
			$post->meta->author = get_post_meta( $post->ID, 'author', 1 );
		}

		return $posts;

	}

}
