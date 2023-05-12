<?php
/**
 * Plugin Name:       Iwc Blocks
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.1
 * Author:            Christian Hockenberger
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
		)
	);

}
add_action( 'init', 'iwc_blocks_init' );

/**/

function iwc_blocks_comments_render( $attributes, $content, $block ) {

	if ( post_password_required() ) {
		return;
	}

	ob_start();

	$mentions = get_comments(
		array(
			'post_id'  => get_the_ID(),
			'type__in' => get_webmention_comment_type_names(),
			'status'   => 'approve',
		)
	);
	$grouped_mentions = separate_comments( $mentions );

	foreach ( $grouped_mentions as $mention_type => $mentions ) {
		if ( empty( $mentions ) ) {
			continue;
		}
		?>

		<ul class="reaction-list reaction-list--<?php echo esc_attr( $mention_type ); ?>">
			<h4><?php echo get_webmention_comment_type_attr( $mention_type, 'label' ); ?></h4>
			<?php
			wp_list_comments(
				array(
					'avatar_only' => true,
					'avatar_size' => 64,
				),
				$mentions
			);
			?>
		</ul>

		<?php
	}

	$default_comments = get_comments(
		array(
			'post_id'  => get_the_ID(),
			'type__not_in' => get_webmention_comment_type_names(),
			'status'   => 'approve',
		)
	);
	?>

	<?php if ( 0 < count( $default_comments ) ) : ?>

	<ol class="commentlist">
		<h4>Comments</h4>
		<?php
		wp_list_comments(
			array(
				'style'       => 'ol',
				'avatar_size' => 50,
				'short_ping'  => true,
			),
			$default_comments,
		);
		?>
	</ol><!-- .comment-list -->

	<?php endif; ?>

	<?php

	return ob_get_clean();

}
