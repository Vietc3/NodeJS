import React, { Component } from 'react';
import tinymce from 'tinymce/tinymce.js';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';

class TinyEditor extends Component {
  constructor(props) {
    super(props);
    this.tempFiles = [];
    this.id = "";
    this.state={
      editor: null
    }
  }

  render() {
    return (
      <Editor
        value={this.props.content}
        selector={"#" + this.props.id}
        disabled={this.props.isDisabled}
        onEditorChange={(content, editor) => this.props.onEditorChange(editor.getContent())}
        init={{
          setup: editor => {
            this.setState({ editor });
          },
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
          menubar: "custom",
          menu: {
            custom: { title: "Custom menu", items: "basicitem nesteditem toggleitem" }
          },
          toolbar1: `undo redo | fontselect | fontsizeselect | styleselect | 
                  bold italic underline strikethrough | forecolor backcolor `,
          toolbar2: `alignleft aligncenter alignright alignjustify | numlist bullist checklist outdent indent | charmap emoticons | fullscreen  preview save print |
                  insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment | removeformat | code`       
        }} 
      />
    );
  }
}

export default TinyEditor;