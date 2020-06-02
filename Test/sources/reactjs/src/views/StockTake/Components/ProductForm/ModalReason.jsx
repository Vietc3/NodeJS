import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import 'date-fns';
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import OhModal from "components/Oh/OhModal";
import OhInput from "components/Oh/OhInput";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem";
import { notifyError } from "components/Oh/OhUtils";
import { MdCancel, MdAddCircle } from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';

const propTypes =
{
  visible: PropTypes.bool,
  title: PropTypes.string,
  onChangeVisible: PropTypes.func,
};

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      visible: false
    };
  }

  componentDidMount = () => {
    if(this.props.value){
      this.setState({
        reason: this.props.value
      })
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.visible !== this.props.visible) {
      this.setState({
        visible: this.props.visible
      })
    }
  }

  handleOk = async () => {
    const { reason } = this.state;
    const { t } = this.props;
    if (!reason)
      notifyError(t("Lý do không được để trống"))
    else {
      if(!isNaN(reason)){
        notifyError(t("Lý do không được là số"))
      }
      else
        this.handleClose()
    }
  }

  handleClose = () => {
    this.setState({
      visible: false,
    }, () => this.props.onChangeVisible(false, this.state.reason))
  }

  render() {
    const { t, value } = this.props;
    const { visible } = this.state;
    return (

      <OhModal
        title={t("Lý do chênh lệch")}
        key={"ohmodal reason"}
        width={500}
        onOpen={visible}
        onClose={this.handleClose}
        footer={[
          <OhToolbar
            key ={"ohtoolbar-reason"}
            right={[
              {
                type: "button",
                label: t("Đồng ý"),
                onClick: () => this.handleOk(),
                icon: <MdAddCircle />,
                simple: true,
                typeButton: "add"
              },
              {
                type: "button",
                label: t("Thoát"),
                icon: <MdCancel />,
                onClick: () => this.handleClose(),
                simple: true,
                typeButton: "exit"
              },
            ]}
          />
        ]}
        content={
          <GridContainer justify='center' className='GridContentPopover'>
            <GridItem xs={12}>
              <OhInput
                defaultValue={value}
                onChange={(e) => {
                  this.setState({
                    reason: e
                  })
                }}
              />


            </GridItem>
          </GridContainer>
        }
      />
    );
  }
}

Modal.propTypes = propTypes;

export default (withTranslation("translations")
  (
    withStyles(theme => ({
      ...regularFormsStyle
    }))(Modal)
  ));
