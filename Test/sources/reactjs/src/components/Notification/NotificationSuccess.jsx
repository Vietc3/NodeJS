import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { notification, Icon } from 'antd';

class NotificationSuccess extends Component {

  closeNotification = () => {
    this.props.closeNoti();
    notification.destroy()
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        {
          notification.success({
            message: <span className="notification-success-character">{this.props.message ? t(this.props.message) : "Thành công"}</span>,
            duration: 2,
            onClick: () => this.closeNotification(),
            onClose: () => this.closeNotification(),
            placement: "bottomRight",
            className: "notification-success-style",
            icon: <Icon type="check-circle" className="notification-success-icon" />
          })
        }
      </div>
    );
  }
}

export default withTranslation("translations")(NotificationSuccess);