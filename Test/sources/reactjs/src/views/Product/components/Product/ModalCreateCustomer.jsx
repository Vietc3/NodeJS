import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import 'date-fns';
import { Modal } from "antd";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import CreateCustomer from 'views/Customer/CreateCustomer';

const propTypes =
{
    visible: PropTypes.bool,
    title: PropTypes.string,
    onChangeVisible: PropTypes.func,
};

class ModalCreateCustomer extends React.Component {

    render() {
        const { title, visible, t, onChangeVisible, customerType } = this.props;
        return (

            <Modal
                title={t(title)}
                visible={visible}
                onCancel={()=>onChangeVisible(false, undefined)}
                footer={[
                ]}
                    width={window.innerWidth > 1100 ? 1100 : 900}
                >
                    <CreateCustomer
                        customerType = {customerType}
                        onChangeVisible = {onChangeVisible}
                        visibleModal = {visible}
                        isModal = {true}
                    />
            </Modal>
        );
    }
}

ModalCreateCustomer.propTypes = propTypes;

export default (withTranslation("translations")
    (
        withStyles(theme => ({
            ...regularFormsStyle
        }))(ModalCreateCustomer)
    ));
