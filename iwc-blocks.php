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

function iwc_blocks_init() {

	register_block_type_from_metadata(
		__DIR__ . '/build/iwc-comments',
		array(
			'render_callback'   => 'iwc_blocks_comments_render',
			'skip_inner_blocks' => true,
		)
	);

	register_block_type_from_metadata(
		__DIR__ . '/build/iwc-comment-template',
		array(
			'render_callback'   => 'iwc_blocks_comment_template_render',
			'skip_inner_blocks' => true,
		)
	);

	register_block_type_from_metadata(
		__DIR__ . '/build/iwc-avatar',
		array(
			'render_callback'   => 'iwc_blocks_avatar_render',
		)
	);

}
add_action( 'init', 'iwc_blocks_init' );

/**/

function iwc_blocks_comments_render( $attributes, $content, $block ) {

	$post_id = $block->context['postId'];
	if ( ! isset( $post_id ) ) {
		return '';
	}

	$comment_args = array(
		'post_id' => $post_id,
		'count'   => true,
		'status'  => 'approve',
	);

	if ( ! comments_open( $post_id ) && get_comments( $comment_args ) === 0 ) {
		return '';
	}

	return $block->render( array( 'dynamic' => false ) );

}

function iwc_blocks_comment_template_render( $attributes, $content, $block ) {

	if ( empty( $block->context['postId'] ) ) {
		return '';
	}

	if ( post_password_required( $block->context['postId'] ) ) {
		return;
	}

	$comments_args = build_comment_query_vars_from_block( $block );

	$comment_query = new WP_Comment_Query( $comments_args );
	$comments = $comment_query->get_comments();
	if ( count( $comments ) === 0 ) {
		return '';
	}

	$comment_order = get_option( 'comment_order' );

	if ( 'desc' === $comment_order ) {
		$comments = array_reverse( $comments );
	}

	$wrapper_attributes = get_block_wrapper_attributes();

	return sprintf(
		'<ol %1$s>%2$s</ol>',
		$wrapper_attributes,
		iwc_blocks_comment_template_render_comments( $comments, $block )
	);

}

function iwc_blocks_comment_template_render_comments( $comments, $block ) {

	global $comment_depth;
	$thread_comments       = get_option( 'thread_comments' );
	$thread_comments_depth = get_option( 'thread_comments_depth' );

	if ( empty( $comment_depth ) ) {
		$comment_depth = 1;
	}

	$content = '';
	foreach ( $comments as $comment ) {

		$block_content = ( new WP_Block(
			$block->parsed_block,
			array(
				'commentId' => $comment->comment_ID,
			)
		) )->render( array( 'dynamic' => false ) );

		$children = $comment->get_children();

		$comment_classes = comment_class( '', $comment->comment_ID, $comment->comment_post_ID, false );

		if ( ! empty( $children ) && ! empty( $thread_comments ) ) {
			if ( $comment_depth < $thread_comments_depth ) {
				++$comment_depth;
				$inner_content  = iwc_blocks_comment_template_render_comments(
					$children,
					$block
				);
				$block_content .= sprintf( '<ol>%1$s</ol>', $inner_content );
				--$comment_depth;
			} else {
				$block_content .= iwc_blocks_comment_template_render_comments(
					$children,
					$block
				);
			}
		}

		$content .= sprintf( '<li id="comment-%1$s" %2$s>%3$s</li>', $comment->comment_ID, $comment_classes, $block_content );

	}

	return $content;
}

function iwc_blocks_avatar_render( $attributes, $content, $block ) {

	$size               = isset( $attributes['size'] ) ? $attributes['size'] : 96;
	$wrapper_attributes = get_block_wrapper_attributes();
	$border_attributes  = iwc_blocks_avatar_render_border_attributes( $attributes );

	$image_classes = ! empty( $border_attributes['class'] ) ? "wp-block-avatar__image {$border_attributes['class']}" : 'wp-block-avatar__image';

	$image_styles = ! empty( $border_attributes['style'] ) ? sprintf( ' style="%s"', esc_attr( $border_attributes['style'] ) ) : '';

	if ( ! isset( $block->context['commentId'] ) ) {
		$author_id   = isset( $attributes['userId'] ) ? $attributes['userId'] : get_post_field( 'post_author', $block->context['postId'] );
		$author_name = get_the_author_meta( 'display_name', $author_id );
		$alt          = sprintf( __( '%s Avatar' ), $author_name );
		$avatar_block = get_avatar(
			$author_id,
			$size,
			'',
			$alt,
			array(
				'extra_attr' => $image_styles,
				'class'      => $image_classes,
			)
		);
		if ( isset( $attributes['isLink'] ) && $attributes['isLink'] ) {
			$label = '';
			if ( '_blank' === $attributes['linkTarget'] ) {
				$label = 'aria-label="' . sprintf( esc_attr__( '(%s author archive, opens in a new tab)' ), $author_name ) . '"';
			}
			$avatar_block = sprintf( '<a href="%1$s" target="%2$s" %3$s class="wp-block-avatar__link">%4$s</a>', esc_url( get_author_posts_url( $author_id ) ), esc_attr( $attributes['linkTarget'] ), $label, $avatar_block );
		}
		return sprintf( '<div %1s>%2s</div>', $wrapper_attributes, $avatar_block );
	}

	$comment = get_comment( $block->context['commentId'] );
	if ( ! $comment ) {
		return '';
	}
	$alt          = sprintf( __( '%s Avatar' ), $comment->comment_author );
	$avatar_block = get_avatar(
		$comment,
		$size,
		'',
		$alt,
		array(
			'extra_attr' => $image_styles,
			'class'      => $image_classes,
		)
	);
	if ( isset( $attributes['isLink'] ) && $attributes['isLink'] && isset( $comment->comment_author_url ) && '' !== $comment->comment_author_url ) {
		$label = '';
		if ( '_blank' === $attributes['linkTarget'] ) {
			$label = 'aria-label="' . sprintf( esc_attr__( '(%s website link, opens in a new tab)' ), $comment->comment_author ) . '"';
		}
		$avatar_block = sprintf( '<a href="%1$s" target="%2$s" %3$s class="wp-block-avatar__link">%4$s</a>', esc_url( $comment->comment_author_url ), esc_attr( $attributes['linkTarget'] ), $label, $avatar_block );
	}
	return sprintf( '<div %1s>%2s</div>', $wrapper_attributes, $avatar_block );

}

function iwc_blocks_avatar_render_border_attributes( $attributes ) {

	$border_styles = array();
	$sides         = array( 'top', 'right', 'bottom', 'left' );

	if ( isset( $attributes['style']['border']['radius'] ) ) {
		$border_styles['radius'] = $attributes['style']['border']['radius'];
	}

	if ( isset( $attributes['style']['border']['style'] ) ) {
		$border_styles['style'] = $attributes['style']['border']['style'];
	}

	if ( isset( $attributes['style']['border']['width'] ) ) {
		$border_styles['width'] = $attributes['style']['border']['width'];
	}

	$preset_color           = array_key_exists( 'borderColor', $attributes ) ? "var:preset|color|{$attributes['borderColor']}" : null;
	$custom_color           = _wp_array_get( $attributes, array( 'style', 'border', 'color' ), null );
	$border_styles['color'] = $preset_color ? $preset_color : $custom_color;

	foreach ( $sides as $side ) {
		$border                 = _wp_array_get( $attributes, array( 'style', 'border', $side ), null );
		$border_styles[ $side ] = array(
			'color' => isset( $border['color'] ) ? $border['color'] : null,
			'style' => isset( $border['style'] ) ? $border['style'] : null,
			'width' => isset( $border['width'] ) ? $border['width'] : null,
		);
	}

	$styles     = wp_style_engine_get_styles( array( 'border' => $border_styles ) );
	$attributes = array();
	if ( ! empty( $styles['classnames'] ) ) {
		$attributes['class'] = $styles['classnames'];
	}
	if ( ! empty( $styles['css'] ) ) {
		$attributes['style'] = $styles['css'];
	}
	return $attributes;

}
