import React, { Component } from 'react';
import tinymce from 'tinymce/tinymce.js';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';

class TinyView extends Component {
	constructor(props) {
		super(props);
		this.tempFiles = [];
		this.id = "";
	}

	render() {
		return (
			<Editor
				value={this.props.content}
				selector={"#" + this.props.id}
				disabled
				init={{
					theme: "silver",
					readonly: 1,
					height: this.props.height || 500,
					plugins: "image code",
					image_title: true,
					automatic_uploads: true,
					file_picker_types: 'image',
					file_picker_callback: (cb, value, meta) => {
						let input = document.createElement('input');
						let id = 'image_' + (new Date()).getTime();
						this.id = id;
						input.setAttribute('type', 'file');
						input.setAttribute('accept', 'image/*');
						input.onchange = (e) => {
							let file = e.path[0].files[0];
							let reader = new FileReader();

							reader.onload = function (e) {
								let blobCache = tinymce.activeEditor.editorUpload.blobCache;
								let base64 = reader.result.split(',')[1];
								let blobInfo = blobCache.create(id, file, base64);
								blobCache.add(blobInfo);
								cb(blobInfo.blobUri(), { title: file.name });
							};
							reader.readAsDataURL(file);
						};
						input.click();
					},
					toolbar: false,
					menubar: "custom",
					menu: {
						custom: { title: "Custom menu", items: "basicitem nesteditem toggleitem" }
					},
				}}
			/>
		);
	}
}

export default TinyView;