import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import CommentsInspectorControls from './comments-inspector-controls';

const TEMPLATE = [
	[ 'core/comments-title' ],
	[
		'iwc-blocks/iwc-comment-template',
		{},
		[
			[
				'core/columns',
				{},
				[
					[
						'core/column',
						{ width: '40px' },
						[
							[
								'iwc-blocks/iwc-avatar',
								{
									size: 40,
									style: {
										border: { radius: '20px' },
									},
								},
							],
						],
					],
					[
						'core/column',
						{},
						[
							[
								'core/comment-author-name',
								{
									fontSize: 'small',
								},
							],
							[
								'core/group',
								{
									layout: { type: 'flex' },
									style: {
										spacing: {
											margin: {
												top: '0px',
												bottom: '0px',
											},
										},
									},
								},
								[
									[
										'core/comment-date',
										{
											fontSize: 'small',
										},
									],
									[
										'core/comment-edit-link',
										{
											fontSize: 'small',
										},
									],
								],
							],
							[ 'core/comment-content' ],
							[
								'core/comment-reply-link',
								{
									fontSize: 'small',
								},
							],
						],
					],
				],
			],
		],
	],
	[ 'core/comments-pagination' ],
	[ 'core/post-comments-form' ],
];

export default function CommentsEdit( props ) {
	const { attributes, setAttributes } = props;
	const { tagName: TagName } = attributes;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	return (
		<>
			<CommentsInspectorControls
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<TagName { ...innerBlocksProps } />
		</>
	);
}
