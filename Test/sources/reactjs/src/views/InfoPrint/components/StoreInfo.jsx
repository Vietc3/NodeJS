import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { withTranslation } from 'react-i18next';
import withStyles from "@material-ui/core/styles/withStyles"
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody";
import "react-datepicker/dist/react-datepicker.css";
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import OhModal from 'components/Oh/OhModal';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import Constants from 'variables/Constants/';
import OhForm from "components/Oh/OhForm";
import OhButton from "components/Oh/OhButton";
import { MdSave, MdCancel } from "react-icons/md";
import StoreService from "services/StoreConfig";
import SimpleReactValidator from "simple-react-validator";
import { Redirect } from 'react-router-dom';

class InfoStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      br: null,
      brerror: null,
      open: false,
      onOk: false,
      config: {
        expirydate: "",
        name: "",
        email: "",
        address: "",
        tel: "",
        language: 'vn',
        accessaddress: "",
      },
      store_logo: {
        type:"store_logo",
        logo: "",
      },
      store_info: {},
      data_copy: [],
      errors: {},
    };
    this.ohFormRef = null;
    this.validator = new SimpleReactValidator();
    this.cropImg = Constants.LOGO;
  }
  componentDidMount() {
    this.getData()
  }
  handleInputChange = (event, type) => {
    this.setState({
      config: {
        ...this.state.config,
        [event.target.name]: event.target.value,
      },
    });
  }
  async getData() {
    let config = await StoreService.getConfig({types: ["store_info","store_logo"]});
    if(Object.entries(config.data).length === 0){
      this.setState({
        store_logo:{ ...this.state.store_logo, logo: config.data.store_logo ? config.data.store_logo : Constants.LOGO }
      })
      return;
    }
    for(let i in config.data){
      if(i !== "store_logo")
        config.data[i] = JSON.parse(config.data[i])
    }
    this.setState({
      config: config.data.store_info,
      store_logo:{ ...this.state.store_logo, logo: config.data.store_logo ? config.data.store_logo : Constants.LOGO }
    })
  }

  updateConfig = async () => {
    const { t } = this.props;
    let info = JSON.stringify(this.state.config)
    let updateConfig = await StoreService.saveConfig({configs: {store_info: info, store_logo:this.state.store_logo.logo}}); 

    if (updateConfig) {
      this.success(t("Cập nhật thông tin cửa hàng thành công"))
    } else {
      this.error(updateConfig.error)
    }
  }

  handleSubmit = () => {
    if(this.ohFormRef.allValid()){
      this.updateConfig();
    }
  };
  onChange = obj => {
    this.setState({
      config: {
        ...this.state.config,
        ...obj
      }
    })
  }

  success = (mess) => {
    this.setState({
      redirect: <Redirect to={{ pathname: '/' }} />,
    })
    notifySuccess(mess)
  }

  handleOpen = () => {
    this.cropImg = this.state.store_logo.logo;
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleOk = () => {
    this.handleClose();
    
    this.cropper.getCroppedCanvas().getContext('2d');
    
    this.cropImg = this.cropper.getCroppedCanvas({
      width: 160,
      height: 90,
      minWidth: 256,
      minHeight: 256,
      maxWidth: 4096,
      maxHeight: 4096,
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
    }).toDataURL("image/png");
   
    const store_logo = {...this.state.store_logo, logo: this.cropImg};
    this.setState({store_logo:store_logo});
  }

  handleImageChange = e => {
    let { t } = this.props
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    if (!file) {
      this.setState({ file: this.state.file || undefined });
      return;
    }
    if (file.type.indexOf("image/") !== -1) {
      if (file.size / 1048576 <= 2) {
        reader.onloadend = () => {
          this.cropImg = reader.result
          this.setState({
            file: file,
          });
        };
        reader.readAsDataURL(file);
      }
      else this.error(t("Vui lòng chọn ảnh dưới 2MB"))
    }
    else
      this.error(t("Vui lòng chọn file có định dạng .jpg,.jpeg,.png,.svg,.svgz,.gif"))
  };

  handleImage = (e) => {
    this.fileInput.current.click()
  }

  error = (mess) => {
    notifyError(mess)
  }

  fileInput = React.createRef();

  render() {
    const { config, errors } = this.state;
    const { t } = this.props;
    const imgStyle = {
      border: '1px solid black',
      height: 132.64,
      width: 400,
      textAlign: 'center',
      background: this.state.store_logo.logo ? '#333333' : null,
      borderRadius: '5px'
    }
    const content = [
      <div className="fileinput">
        <Cropper
          ref={cropper => { this.cropper = cropper; }}
          src={this.cropImg}
          style={{ width: 400, height: 300 }}
          guides={false}
          zoomable={false}
          scaleble={false}
          autoCropArea={1}
        />
        <input type="file" name="myFile" title="" ref={this.fileInput} accept=".jpg,.jpeg,.png,.svg,.svgz,.gif" onChange={e => this.handleImageChange(e)} />
        <OhButton 
          onClick={this.handleImage}
          permission={{
            name: Constants.PERMISSION_NAME.SETUP_STORE,
            type: Constants.PERMISSION_TYPE.TYPE_ALL
          }}>{t("Chọn ảnh")}</OhButton>
        <i>{t("Lưu ý") + ": " + t("Ảnh không quá 2MB")}</i>
      </div>
    ]

    const storeOptions = Constants.CONFIG_LANGUAGE;

    const columns = [
      {
        name: "name",
        label: t("Tên cửa hàng"),
        ohtype: "input",
        validation: "required",
        message: t("Vui lòng điền tên cửa hàng"),
      },
      {
        name: "email",
        label: t("Email"),
        ohtype: "input",
        validation: "required|email",
        message: t("Vui lòng điền email"),
      },
      {
        name: "address",
        label: t("Địa chỉ"),
        ohtype: "input",
      },
      {
        name: "tel",
        label: t("Số điện thoại"),
        ohtype: "input",
        validation: "required",
        message:t("Vui lòng điền số điện thoại"),
      },
      {
        name: "language",
        label: t("Ngôn ngữ"),
        ohtype: "select",
        placeholder: t("Ngôn ngữ"),
        options: storeOptions,
        onChange: (value) => this.setState({ config: { ...this.state.config, language: value } }),
      },
      {
        name: "accessaddress",
        label: t("Địa chỉ truy cập"),
        ohtype: "input",
        disabled: true
      },
      {
        name: "expirydate",
        label: t("Hạn sử dụng"),
        ohtype: "date-picker",
        formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
        disabled: true
      }
    ];
    return (
      <Fragment>
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        <OhModal
          title={t("Chọn ảnh đại diện")}
          content={content}
          onOpen={this.state.open}
          onClose={this.handleClose}
          footer={[
            <OhButton key="submit" onClick={this.handleOk}
              permission={{
                name: Constants.PERMISSION_NAME.SETUP_STORE,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }}>
              {t("Lưu")}
            </OhButton>,
            <OhButton key="back" type="exit" onClick={this.handleClose}>
              {t("Hủy")}
            </OhButton>,
          ]}
        />
        <Card>
          <CardBody>
            <GridContainer>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <OhForm
                  title={t("Thông tin cửa hàng")}
                  totalColumns={1}
                  defaultFormData={config}
                  onRef={ref => this.ohFormRef = ref}
                  columns={[columns]}
                  onChange={value => { this.onChange(value) }}
                  validator={this.validator}
                  errors = {errors}
                />
              </GridItem>

              <GridItem xs={6} sm={6} md={6} lg={6} style={{ textAlign: '-webkit-center' }}>
                <div style={{ marginTop: 65 }}>
                  <GridItem style={imgStyle}>
                    <img alt="OhStore" style={{ margin: '-10px', height: 'inherit', padding: 'inherit' }} src={this.state.store_logo.logo}></img></GridItem>
                  <GridItem><OhButton onClick={this.handleOpen}
                    permission={{
                      name: Constants.PERMISSION_NAME.SETUP_STORE,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }}>{t("Chọn ảnh đại diện")}</OhButton></GridItem>
                </div>
              </GridItem>
            </GridContainer>
            <GridContainer justify="flex-end">
              <GridItem xs={12} style={{ textAlign: "right" }}>
                <OhButton
                  type="add"
                  icon={<MdSave />}
                  onClick={() => this.handleSubmit()}
                  permission={{
                    name: Constants.PERMISSION_NAME.SETUP_STORE,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  }}>
                  {t("Lưu")}
                </OhButton>
                <OhButton
                  type="exit"
                  icon={<MdCancel />}
                  simple={true}
                  linkTo={"/admin/settings"}>
                  {t("Thoát")}
                </OhButton>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </Fragment>
    )
  }
}

InfoStore.propTypes = {
  classes: PropTypes.object
};

export default (withTranslation("translations")(withStyles((theme) => ({
  ...extendedTablesStyle,
  ...buttonsStyle
}))(InfoStore)));