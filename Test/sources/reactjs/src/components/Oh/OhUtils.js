import React from "react";
import { notification } from "antd";
import _ from 'lodash';
import i18n from 'i18n';
import moment from 'moment';
import Constants from "variables/Constants";
import OhButton from "components/Oh/OhButton.jsx"
import { MdDelete,MdCancel} from "react-icons/md";

import { Modal } from 'antd';

const confirmAlert = Modal.confirm

var confirms = {};

function closeNotification(key) {
  notification.close(key);
}

function closeConfirm(key) {
  confirms[key].destroy();
}

const openNotification = (type, message, description) => {
  let key = moment.unix();
  
  notification[type]({
    message: <span className={`notification-${type}-character`}>{typeof message === 'string' ? i18n.t(message) : message}</span>,
    duration: 2,
    onClick: () => closeNotification(key),
    onClose: () => closeNotification(key),
    placement: "bottomRight",
    key,
    className: `notification-${type}-style`,
    description
  });
};

const openCofirm = (type, title, content, onOk, onCancel) => {
  let key = moment.unix();
  let okText = 'Đồng ý';
  if(type === "delete-confirm") okText = "Xóa"
  if(type === "process-confirm") okText = "Tiếp tục"
  
  confirms[key] = confirmAlert({
    title: typeof title === 'string' ? i18n.t(title) : title,
    icon: null,
    content: <OhButton
          type="add"
          onClick={() => onOk()}
          icon={<MdDelete/>}
        >
          {i18n.t(okText)}
        </OhButton>,
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
    okText: i18n.t(okText),
    footer: (
      <>
        <OhButton
          type="add"
          onClick={() => onOk()}
          icon={<MdDelete/>}
        >
          {i18n.t(okText)}
        </OhButton>
        <OhButton
          type="exit"
          icon={<MdCancel/>}
          onClick={() => {
            closeConfirm(key);
            onCancel();
          }}
        >
          {i18n.t("Đóng")}
        </OhButton>
      </>
    )
  });
};

let notifySuccess = _.debounce(function(message, description = null) {
  if(message) openNotification("success", message, description);
}, Constants.UPDATE_TIME_OUT, {
  'leading': true,
  'trailing': false
});

let notifyError = _.debounce(function(message, description = null) {
  if(message) openNotification("error", message, description);
}, Constants.UPDATE_TIME_OUT, {
  'leading': true,
  'trailing': false
});

let confirm = _.debounce(function(title, content = null, onOk, onCancel) {
  if(title) openCofirm("confirm", title, content, onOk, onCancel);
}, Constants.UPDATE_TIME_OUT, {
  'leading': true,
  'trailing': false
});

let deleteConfirm = _.debounce(function(title, content = null, onOk, onCancel) {
  if(title) openCofirm("delete-confirm", title, content, onOk, onCancel);
}, Constants.UPDATE_TIME_OUT, {
  'leading': true,
  'trailing': false
});

let processConfirm = _.debounce(function(title, content = null, onOk, onCancel) {
  if(title) openCofirm("process-confirm", title, content, onOk, onCancel);
}, Constants.UPDATE_TIME_OUT, {
  'leading': true,
  'trailing': false
});

export {notifySuccess};
export {notifyError};
export {confirm};
export {deleteConfirm};
export {processConfirm};


