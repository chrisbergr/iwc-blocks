import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow } from '@wordpress/components';

export default function IwcInspectorControls() {

	return (
		<InspectorControls>
			<PanelBody title="IWC Comments - Settings" initialOpen={ true }>
				<PanelRow>No settings yet</PanelRow>
			</PanelBody>
		</InspectorControls>
	);

}
