import { useBlockProps } from '@wordpress/block-editor';
import IwcInspectorControls from './inspector-controls';

export default function IwcEdit( props ) {

	const { serverSideRender: ServerSideRender } = wp;
	const { attributes, setAttributes } = props;
	const blockProps = useBlockProps( {
        className: 'IWC-Comments',
    } );

	return (
		<div { ...blockProps }>
			<IwcInspectorControls
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<ServerSideRender
				block="indieweb/iwc-comments"
			/>
		</div>
	);

}
