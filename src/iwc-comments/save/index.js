import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes: { tagName: Tag } } ) {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <Tag { ...innerBlocksProps } />;
}