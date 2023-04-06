<?php
/**
 * Plugin Name:       Iwc Blocks
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       iwc-blocks
 *
 * @package           create-block
 */

//function create_block_iwc_blocks_block_init() {
//	register_block_type( __DIR__ . '/build' );
//}
function create_block_iwc_blocks_block_init() {
	register_block_type_from_metadata(
	//register_block_type(
		__DIR__ . '/build',
		array(
			'render_callback'   => 'create_block_iwc_blocks_block_render',
			'skip_inner_blocks' => true,
		)
	);
}
add_action( 'init', 'create_block_iwc_blocks_block_init' );

function create_block_iwc_blocks_block_render( $attributes, $content, $block ) {
	global $post;

	$post_id = $block->context['postId'];
	if ( ! isset( $post_id ) ) {
		return '';
	}

	$comment_args = array(
		'post_id' => $post_id,
		'count'   => true,
		'status'  => 'approve',
	);
	// Return early if there are no comments and comments are closed.
	if ( ! comments_open( $post_id ) && get_comments( $comment_args ) === 0 ) {
		return '';
	}

	// If this isn't the legacy block, we need to render the static version of this block.
	$is_legacy = 'create-block/iwc-blocks' === $block->name || ! empty( $attributes['legacy'] );
	if ( ! $is_legacy ) {
		return $block->render( array( 'dynamic' => false ) );
	}

	$post_before = $post;
	$post        = get_post( $post_id );
	setup_postdata( $post );

	ob_start();

	/*
	 * There's a deprecation warning generated by WP Core.
	 * Ideally this deprecation is removed from Core.
	 * In the meantime, this removes it from the output.
	 */
	add_filter( 'deprecated_file_trigger_error', '__return_false' );
	comments_template();
	remove_filter( 'deprecated_file_trigger_error', '__return_false' );

	$output = ob_get_clean();
	$post   = $post_before;

	$classnames = array();
	// Adds the old class name for styles' backwards compatibility.
	if ( isset( $attributes['legacy'] ) ) {
		$classnames[] = 'wp-block-post-comments';
	}
	if ( isset( $attributes['textAlign'] ) ) {
		$classnames[] = 'has-text-align-' . $attributes['textAlign'];
	}

	$wrapper_attributes = get_block_wrapper_attributes(
		array( 'class' => implode( ' ', $classnames ) )
	);

	/*
	 * Enqueues scripts and styles required only for the legacy version. That is
	 * why they are not defined in `block.json`.
	 */
	wp_enqueue_script( 'comment-reply' );
	enqueue_legacy_post_comments_block_styles( $block->name );

	return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $output );
}
