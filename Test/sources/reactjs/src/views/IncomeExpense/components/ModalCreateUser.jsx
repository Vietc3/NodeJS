import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import 'date-fns';
import { Modal } from "antd";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import CreateUser from 'views/User/UserManagement/EditUser';

const propTypes =
{
  visible: PropTypes.bool,
  title: PropTypes.string,
  onChangeVisible: PropTypes.func,
};

class ModalCreateUser extends React.Component {

  render() {
    const { visible, onChangeVisible } = this.props;
    return (

      <Modal
        visible={visible}
        onCancel={() => onChangeVisible(false, undefined)}
        footer={[
        ]}
        width={window.innerWidth > 1100 ? 1200 : 1100}
      >
        <CreateUser
          onChangeVisible={onChangeVisible}
          visibleModal={visible}
          isModal={true}
        />
      </Modal>
    );
  }
}

ModalCreateUser.propTypes = propTypes;

export default (withTranslation("translations")
  (
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ModalCreateUser)
  ));
