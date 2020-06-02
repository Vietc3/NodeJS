import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text
} from "native-base";
import {
  AppRegistry,
  Platform,
  StyleSheet,
	ImageBackground, 
	View
} from 'react-native'
import styles from "./styles";
import { throttle } from 'lodash'
import Upload from 'react-native-background-upload'
import ImagePicker from 'react-native-image-picker'

console.log(Upload);
const launchscreenLogo = require("assets/logo-kitchen-sink.png");

class UploadButton extends Component {
	constructor(props) {
    super(props)
    this.state = {
      isImagePickerShowing: false,
      uploadId: null,
      progress: null,
    }
  }

  handleProgress = throttle((progress) => {
    this.setState({ progress })
  }, 200)

  startUpload = (opts) => {
		// console.log(Upload);
    // console.log(opts);
    // console.log(Upload.getFileInfo);
    if(Upload.getFileInfo) {
			Upload.getFileInfo(opts.path).then((metadata) => {
				const options = Object.assign({
					method: 'POST',
					headers: {
						'content-type': metadata.mimeType // server requires a content-type header
					}
				}, opts)

				Upload.startUpload(options).then((uploadId) => {
					console.log(`Upload started with options: ${JSON.stringify(options)}`)
					this.setState({ uploadId, progress: 0 })
					Upload.addListener('progress', uploadId, (data) => {
						this.handleProgress(+data.progress)
						console.log(`Progress: ${data.progress}%`)
					})
					Upload.addListener('error', uploadId, (data) => {
						console.log(`Error: ${data.error}%`)
					})
					Upload.addListener('completed', uploadId, (data) => {
						console.log('Completed!')
					})
				}).catch(function(err) {
					this.setState({ uploadId: null, progress: null })
					console.log('Upload error!', err)
				})
			})
		}else{
			console.log(Upload);
		}
  }

  onPressUpload = (options) => {
    if (this.state.isImagePickerShowing) {
      return
    }

    this.setState({ isImagePickerShowing: true })

    const imagePickerOptions = {
      takePhotoButtonTitle: null,
      title: 'Upload Media',
      chooseFromLibraryButtonTitle: 'Choose From Library'
    }

    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      let didChooseVideo = true

      console.log('ImagePicker response: ', response)
      const { customButton, didCancel, error, path, uri } = response

      if (didCancel) {
        didChooseVideo = false
      }

      if (error) {
        console.warn('ImagePicker error:', response)
        didChooseVideo = false
      }

      // TODO: Should this happen higher?
      this.setState({ isImagePickerShowing: false })

      if (!didChooseVideo) {
        return
      }

      if (Platform.OS === 'android') {
        if (path) { // Video is stored locally on the device
          // TODO: What here?
          this.startUpload(Object.assign({ path }, options))
        } else { // Video is stored in google cloud
          // TODO: What here?
          this.props.onVideoNotFound()
        }
      } else {
        this.startUpload(Object.assign({ path: uri }, options))
      }
    })
  }

  cancelUpload = () => {
    if (!this.state.uploadid) {
      console.log('Nothing to cancel!')
      return
    }

    Upload.cancelUpload(this.state.uploadId).then((props) => {
      console.log(`Upload ${this.state.uploadId} canceled`)
      this.setState({ uploadId: null, progress: null })
    })
  }

  render() {
    return (
      <Button
				small
				iconLeft
				onPress={() => this.onPressUpload({
					url: 'http://192.168.1.43:3004/upload_raw',
					type: 'raw'
				})}
			>
				<Icon
					active
					name="attach"
				/>
				<Text>Choose file</Text>
			</Button>
    );
  }
}

export default UploadButton;
