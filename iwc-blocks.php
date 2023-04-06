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

	return $block->render( array( 'dynamic' => false ) );
}
