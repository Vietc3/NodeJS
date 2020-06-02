import Card from "components/Card/Card.jsx";
import { connect } from "react-redux"
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import OhForm from 'components/Oh/OhForm';
import "date-fns";
import moment from "moment";
import React from "react";
// multilingual
import { withTranslation } from "react-i18next";
import Constants from "variables/Constants/";

class CardInfoForm extends React.Component {
  constructor(props) {
    super(props);

    let { defaultValue, isEdit } = this.props;
    this.state = {
      formData: defaultValue
        ? {
            id: defaultValue.id,
            incomeExpenseAt: defaultValue.incomeExpenseAt,
            code: defaultValue.code,
            notes: defaultValue.notes,
            createdAt: defaultValue.createdAt
          }
        : {
            incomeExpenseAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
            createdAt:  moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
          },
      createdBy: defaultValue ? defaultValue.createdBy.fullName : this.props.currentUser.fullName
    };
    this.props.onRef(this);
    this.isEdit = isEdit;
    this.sendChange();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.isEdit && this.props.defaultValue !== prevProps.defaultValue){
      const {defaultValue} = this.props;
      this.setState({
        formData: {
          id: defaultValue.id,
          incomeExpenseAt: defaultValue.incomeExpenseAt,
          createdAt: moment(defaultValue.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
          code: defaultValue.code,
          notes: defaultValue.notes,
        },
        createdBy: defaultValue.createdBy.fullName
      })
    }
  }

  onChange = obj => {

    if(obj.incomeExpenseAt === "0")
    obj.incomeExpenseAt = new Date().getTime();

    let formData = {
      ...this.state.formData,
      ...obj
    };
    this.setState(
      {
        formData: formData
      }, () => this.sendChange()
    );
  };
  
  sendChange = () => {
    if(this.props.onChange) this.props.onChange(this.state.formData)
  }

  render() {
    const { t, defaultValue, typeId } = this.props;
    const { formData, createdBy } = this.state;
    const isCancel = defaultValue && defaultValue.status === Constants.INCOME_EXPENSE_STATUS.id.CANCELED ? true : false;
    return (
      <GridItem float="right" xs={12} md={6}>
        <Card className = 'income-expense-info-card'>
          <CardBody xs={12} style={{ padding: 0}}>
            <OhForm
              title={t("Thông tin phiếu " + Constants.COST_TYPE_NAME[this.props.typeId].toLowerCase())}
              defaultFormData={{...formData, createdBy} }
              onRef={ref => this.ohFormRef = ref}
              columns={[
                [
                  {
                    name: "code",
                    label: t("Mã phiếu"),
                    ohtype: "input",
                    placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
                    disabled: isCancel
                  },
                  {
                    name: "createdBy",
                    label: t("Người tạo"),
                    ohtype: "label",
                  },
                  {
                    name: "createdAt",
                    label: t("Ngày tạo"),
                    ohtype: "label",
                  },
                  {
                    name: "incomeExpenseAt",
                    label: t("Ngày {{type}}", {type: typeId === Constants.COST_TYPE_NAME.Income ? t(Constants.COST_TYPE_NAME[1]) : t(Constants.COST_TYPE_NAME[2]) } ),
                    ohtype: "date-picker",
                    validation: "required",
                    showTime: true,
                    formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
                  },
                  {
                    name: "notes",
                    label: t("Ghi chú"),
                    ohtype: "textarea",
                    disabled: this.props.isCancel,
                    minRows: 1,
                    maxRows: 2,
                  },
                ],
              ]}
              onChange={value => {
                this.onChange(value);
              }}
              tag={(defaultValue && defaultValue.status === Constants.INCOME_EXPENSE_STATUS.id.CANCELED) ? Constants.INCOME_EXPENSE_STATUS.name[defaultValue.status] : null}
            />
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user
  };
})(withTranslation("translations")(CardInfoForm));
