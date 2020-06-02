import { Modal } from "antd";
import NotificationError from "components/Notification/NotificationError.jsx";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import OhForm from 'components/Oh/OhForm';
import _ from "lodash";
import React from "react";
// multilingual
import { withTranslation } from "react-i18next";
import incomeExpenseTypeService from "services/IncomeExpenseTypeService";
import Constants from "variables/Constants/index";
import OhToolbar from "components/Oh/OhToolbar";
import { MdAddCircle, MdSave, MdCancel } from "react-icons/md";

class IncomeExpenseTypeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      br: null,
      brerror: null,
      error: {},
      formData: {},
      incomeExpenseTypes: [],
      title: "",
      isSubmit: false
    };

    this.props.onRef(this);
    this.changeTimeout = null;
  }

  componentDidUpdate = (prevProps, prevState) => {
    let { defaultValue, isEditForm, type, t } = this.props;

    if (prevProps.visible !== this.props.visible) {
      this.setState({
        title: isEditForm ? t("Sửa loại thu chi - ") + defaultValue.name : t("Tạo loại thu chi"),
        formData: isEditForm ? defaultValue || {} : {type},
        error: {}
      });

      if (this.props.visible) {
        this.getData();
      }
    }
  };

  componentDidMount = () => {
    this.getData();
  };

  async getData() {
    let getIncomeExpenseTypes = await incomeExpenseTypeService.getIncomeExpenseTypes();

    this.setState({
      incomeExpenseTypes: getIncomeExpenseTypes.data
    });
  }

  keyPress = e => {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  onChange = objValue => {
    let formData = {
      ...this.state.formData,
      ...objValue
    };

    if (this.changeTimeout) {
      clearTimeout(this.changeTimeout);
      this.changeTimeout = null;
    }

    this.changeTimeout = setTimeout(() => {
      this.checkValidation(Object.keys(objValue), formData);
    }, Constants.UPDATE_TIME_OUT);

    this.setState({
      formData: formData
    });
  };

  checkValidation = (fields, formData, isSubmitted) => {
    let { t } = this.props;
    let { incomeExpenseTypes } = this.state;
    let error = isSubmitted ? {} : this.state.error;

    if (isSubmitted || fields.includes("name") || fields.includes("type")) {
      if (
        incomeExpenseTypes.find(
          item => item.name === formData.name && item.type === formData.type && item.id !== formData.id
        ) !== undefined
      )
        error.name = t("Loại thu chi này đã tồn tại");
      else if (!formData.name || !formData.name.length) error.name = t("Loại thu chi này đã tồn tại");
      else error.name = "";
    }

    if (isSubmitted || fields.includes("type")) {
      if (formData.type === undefined) error.type = t("Loại thu chi này đã tồn tại");
      else error.type = "";
    }

    this.setState({ error: error });
    return error;
  };

  onCancel = () => {
    this.setState({
      notification: null,
      visible: false,
      selectedRowKeys: []
    });
  };

  success = mess => {
    this.setState(
      { br: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={mess} /> },
      () => this.onCancel()
    );
  };

  error = mess => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    });
  };

  handleSubmit = async () => {
    let { formData } = this.state;
    let { t } = this.props;

    if (this.ohFormRef.allValid()) {
      this.setState({isSubmit: true}, async () => {
        try {
          let saveIncomeExpenseType = await incomeExpenseTypeService.saveIncomeExpenseType(
            _.pick(formData, ["id", "name", "type", "notes"])
          );
    
          if (saveIncomeExpenseType.status) {
            this.success(formData.id ? t("Cập nhật thành công") : t("Tạo loại thu chi thành công"));
            this.setState({isSubmit: false})
            this.props.onSuccess(saveIncomeExpenseType.data);
          } else {
            throw saveIncomeExpenseType.error;
          }
        }
        catch(error) {
          this.setState({isSubmit: false})
          if (typeof error === "string") this.error(error);
        }
      })      
    }
  };

  render() {
    const { t, visible, isEditForm, type } = this.props;
    const { formData, title, isSubmit } = this.state;
    return (
      <>
        {this.state.br}
        {this.state.brerror}
        {visible ? (
          <Modal
            title={t(title)}
            visible={true}
            onCancel ={() => this.props.onCancel()}
            footer={[
              <OhToolbar
                right={[
                  {
                    type: "button" ,
                    label: isEditForm ? t("Lưu") : t("Tạo"),
                    onClick:() => this.handleSubmit(),
                    icon: isEditForm ?<MdSave/>:<MdAddCircle />,
                    disabled: isSubmit,
                    typeButton:"add",
                    simple: true,
                    permission:{
                      name: Constants.PERMISSION_NAME.INCOME_EXPENSE_TYPE,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    },
                  },
                  {
                    type: "button",
                    label: t("Thoát"),
                    onClick: () => this.props.onCancel(),
                    icon: <MdCancel />,
                    typeButton:"exit",
                    simple: true
                  },
                ]} 
              />
            ]}
          >
            <OhForm
              defaultFormData={formData}
              onRef={ref => this.ohFormRef = ref}
              columns={[
                [
                  {
                    name: "name",
                    label: t("Tên"),
                    ohtype: "input",
                    validation: "required",
                    message: "Vui lòng nhập tên loại thu chi",
                    placeholder: t("Tên thu chi"),
                  },
                  {
                    name: "type",
                    label: t("Loại"),
                    ohtype: "select",
                    validation: "required",
                    message: "Vui lòng chọn loại thu hoặc chi",
                    placeholder: t("Chọn loại thu hoặc chi"),
                    options: Constants.INCOME_EXPENSE_TYPES.map(item => {
                      return {value: item.id, title: t(item.name)};
                    }),
                    disabled: isEditForm || type
                  },
                  {
                    name: "notes",
                    label: t("Ghi chú"),
                    ohtype: "textarea",
                  },
                ],
              ]}
              onChange={value => {
                delete value.customerType;
                this.onChange(value);
              }}
            />
          </Modal>
        ) : null}
      </>
    );
  }
}

export default withTranslation("translations")(
  IncomeExpenseTypeForm
);
