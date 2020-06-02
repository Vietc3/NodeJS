import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import { notification, Icon } from 'antd';

class NotificationError extends Component {

  closeNotification = () => {
    this.props.closeNoti();
    notification.destroy()
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        {
          notification.error({
            message: <span className="notification-error-character">{this.props.message ? t(this.props.message) : "Thất bại"}</span>,
            duration: this.props.duration || 2,
            onClick: () => this.closeNotification(),
            onClose: () => this.closeNotification(),
            placement: "bottomRight",
            className: "notification-error-style",
            icon: <Icon type="info-circle" className="notification-error-icon" />
          })
        }
      </div>
    );
  }
}

// export default NotificationError;

export default withTranslation("translations")(NotificationError);