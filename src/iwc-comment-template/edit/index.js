import { useState, memo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	BlockContextProvider,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	__experimentalUseBlockPreview as useBlockPreview,
} from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';

import { useCommentQueryArgs, useCommentTree } from './hooks';

const TEMPLATE = [
	[ 'iwc-blocks/iwc-avatar' ],
	[ 'core/comment-author-name' ],
	[ 'core/comment-date' ],
	[ 'core/comment-content' ],
	[ 'core/comment-reply-link' ],
	[ 'core/comment-edit-link' ],
];

const getCommentsPlaceholder = ( {
	perPage,
	pageComments,
	threadComments,
	threadCommentsDepth,
} ) => {

	const commentsDepth = ! threadComments ? 1 : Math.min( threadCommentsDepth, 3 );

	const buildChildrenComment = ( commentsLevel ) => {
		if ( commentsLevel < commentsDepth ) {
			const nextLevel = commentsLevel + 1;
			return [
				{
					commentId: -( commentsLevel + 3 ),
					children: buildChildrenComment( nextLevel ),
				},
			];
		}
		return [];
	};

	const placeholderComments = [
		{ commentId: -1, children: buildChildrenComment( 1 ) },
	];

	if ( ( ! pageComments || perPage >= 2 ) && commentsDepth < 3 ) {
		placeholderComments.push( {
			commentId: -2,
			children: [],
		} );
	}

	if ( ( ! pageComments || perPage >= 3 ) && commentsDepth < 2 ) {
		placeholderComments.push( {
			commentId: -3,
			children: [],
		} );
	}

	return placeholderComments;
};

function CommentTemplateInnerBlocks( {
	comment,
	activeCommentId,
	setActiveCommentId,
	firstCommentId,
	blocks,
} ) {
	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{},
		{ template: TEMPLATE }
	);

	return (
		<li { ...innerBlocksProps }>
			{ comment.commentId === ( activeCommentId || firstCommentId )
				? children
				: null }

			{ /* To avoid flicker when switching active block contexts, a preview
			 is ALWAYS rendered and the preview for the active block is hidden.
			 This ensures that when switching the active block, the component is not
			 mounted again but rather it only toggles the `isHidden` prop.
			 The same strategy is used for preventing the flicker in the Post Template
			 block. */ }
			<MemoizedCommentTemplatePreview
				blocks={ blocks }
				commentId={ comment.commentId }
				setActiveCommentId={ setActiveCommentId }
				isHidden={
					comment.commentId === ( activeCommentId || firstCommentId )
				}
			/>

			{ comment?.children?.length > 0 ? (
				<CommentsList
					comments={ comment.children }
					activeCommentId={ activeCommentId }
					setActiveCommentId={ setActiveCommentId }
					blocks={ blocks }
					firstCommentId={ firstCommentId }
				/>
			) : null }
		</li>
	);
}

const CommentTemplatePreview = ( {
	blocks,
	commentId,
	setActiveCommentId,
	isHidden,
} ) => {
	const blockPreviewProps = useBlockPreview( {
		blocks,
	} );

	const handleOnClick = () => {
		setActiveCommentId( commentId );
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<div
			{ ...blockPreviewProps }
			tabIndex={ 0 }
			role="button"
			style={ style }
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			onClick={ handleOnClick }
			onKeyPress={ handleOnClick }
		/>
	);
};

const MemoizedCommentTemplatePreview = memo( CommentTemplatePreview );

const CommentsList = ( {
	comments,
	blockProps,
	activeCommentId,
	setActiveCommentId,
	blocks,
	firstCommentId,
} ) => (
	<ol { ...blockProps }>
		{ comments &&
			comments.map( ( { commentId, ...comment }, index ) => (
				<BlockContextProvider
					key={ comment.commentId || index }
					value={ {
						commentId: commentId < 0 ? null : commentId,
					} }
				>
					<CommentTemplateInnerBlocks
						comment={ { commentId, ...comment } }
						activeCommentId={ activeCommentId }
						setActiveCommentId={ setActiveCommentId }
						blocks={ blocks }
						firstCommentId={ firstCommentId }
					/>
				</BlockContextProvider>
			) ) }
	</ol>
);

export default function CommentTemplateEdit( {
	clientId,
	context: { postId },
} ) {
	const blockProps = useBlockProps();

	const [ activeCommentId, setActiveCommentId ] = useState();
	const {
		commentOrder,
		threadCommentsDepth,
		threadComments,
		commentsPerPage,
		pageComments,
	} = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().__experimentalDiscussionSettings;
	} );

	const commentQuery = useCommentQueryArgs( {
		postId,
	} );

	const { topLevelComments, blocks } = useSelect(
		( select ) => {
			const { getEntityRecords } = select( coreStore );
			const { getBlocks } = select( blockEditorStore );
			return {
				topLevelComments: commentQuery
					? getEntityRecords( 'root', 'comment', commentQuery )
					: null,
				blocks: getBlocks( clientId ),
			};
		},
		[ clientId, commentQuery ]
	);

	let commentTree = useCommentTree(
		commentOrder === 'desc' && topLevelComments
			? [ ...topLevelComments ].reverse()
			: topLevelComments
	);

	if ( ! topLevelComments ) {
		return (
			<p { ...blockProps }>
				<Spinner />
			</p>
		);
	}

	if ( ! postId ) {
		commentTree = getCommentsPlaceholder( {
			perPage: commentsPerPage,
			pageComments,
			threadComments,
			threadCommentsDepth,
		} );
	}

	if ( ! commentTree.length ) {
		return <p { ...blockProps }>{ __( 'No results found.' ) }</p>;
	}

	return (
		<CommentsList
			comments={ commentTree }
			blockProps={ blockProps }
			blocks={ blocks }
			activeCommentId={ activeCommentId }
			setActiveCommentId={ setActiveCommentId }
			firstCommentId={ commentTree[ 0 ]?.commentId }
		/>
	);
}
