import React, { Component } from 'react';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import OhForm from 'components/Oh/OhForm';
import { withTranslation } from "react-i18next";
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import OhButton from 'components/Oh/OhButton';
import OhSelect from 'components/Oh/OhSelect';
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel, MdDelete } from "react-icons/md";
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import BranchService from 'services/BranchService';
import { Redirect } from 'react-router-dom';
import AlertQuestion from 'components/Alert/AlertQuestion';
import { connect } from "react-redux";
import HttpService from "services/HttpService";
import StockService from 'services/StockService';
import Constants from 'variables/Constants/';
import _ from "lodash";

class index extends Component {
  constructor(props){
    super(props);
    
    let editState = {};
    if(this.props.match && this.props.match.params && this.props.match.params.stockId){
      editState = {
        stockId: parseInt(this.props.match.params.stockId),
        formData: {
          stockId: parseInt(this.props.match.params.stockId),
        },
        isEdit: true
      }
    }
    this.state = {
      formData: {},
      isSubmit: false,
      isEdit: false,
      redirect: null,
      branchList: [],
      ...editState
    }
    this.formData = {}
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    let {isEdit, stockId, formData} = this.state;
    let promises = [];
    
    // lấy danh sách branch
    promises.push(BranchService.getBranches());
    
    // lấy thông tin stock nếu update
    if(isEdit) {
      promises.push(StockService.getStock(stockId))
    }
    
    let [getBranches, getStockList] = await Promise.all(promises);
    let newState = {};
    
    if(getBranches.status){
      newState.branchList = getBranches.data;
    } else notifyError(getBranches.message)
    
    if(getStockList){
      if(getStockList.status){
        newState.formData = {...formData, ...getStockList.data}
      } else {
        notifyError(getStockList.message)
      }
    }    
    this.setState(newState)
  }

  onChange(obj) {
    this.setState({
      formData: {

        ...this.state.formData,
        ...obj
      }
    })
  }

  submit = () => {
    let { formData, isEdit } = this.state;
    let { t } = this.props;
    
    if (this.ohFormRef.allValid()) {
      this.setState({
        isSubmit: true
      }, async () => {
        let saveStock = await StockService.saveStock(_.pickBy(formData, _.identity));

        if (saveStock.status) {         
          notifySuccess(isEdit ? t("Cập nhật kho thành công") : t("Tạo kho mới thành công"));

          HttpService.setBranch(this.props.branchId, false, this.props.nameBranch);          

          this.setState({
            isSubmit: false,
            redirect: <Redirect to={"/admin/stock_management"} />
          })
        }
        else {
          notifyError(saveStock.message);

          this.setState({
            isSubmit: false
          })
        }
      })      
    }
  }

  remove = async () => {
    let { t } = this.props;
    let { stockId, formData } = this.state;
    this.setState({moveToStockId: null})
    let moveTo = null;
    let getStockList = await StockService.getStockList({filter: {deletedAt: 0, branchId: formData.branchId}});
    if (!getStockList.status) {
      notifyError(getStockList.message);
      return;
    }
    let stockList = getStockList.data.filter(item => item.id !== stockId);
    if(!stockList.length) {
      notifyError("Không thể xóa kho duy nhất của chi nhánh");
      return;
    }
    
    this.setState({
      alertSelectBranch: 
      <AlertQuestion
        style={{overflow: 'visible', zIndex: 5000}}
        messege={
          <>
            <span >
              {t("Bạn hãy chọn kho sẽ tiếp nhận tồn kho hiện tại của kho bị xóa")+ ": "} 
            </span>
            <div style={{paddingTop: '10px'}}>
              <OhSelect
                options={getStockList.data.filter(item => item.id !== stockId).map(item => ({value: item.id, title: item.name}))}
                onChange={value => {
                  moveTo = value;
                }}
                placeholder={t("Chọn kho")}
                className= "stock-select"
              />
            </div>
          </>
        }
        name={this.formData.name}
        hideAlert={() => this.setState({ alertSelectBranch: null })}
        buttonOk= "Tiếp tục"
        action={async () => {
          if(moveTo !== null) {
            this.setState({
              alertSelectBranch: null,
              alert: 
              <AlertQuestion
                style={{overflow: 'visible', zIndex: 5001}}
                messege="Bạn chắc chắn muốn xóa kho này?"
                name={this.formData.name}
                hideAlert={() => this.setState({ alert: null })}
                buttonOk= "Xóa"
                action={async () => {
                  let removeBranch = await StockService.deleteStock(stockId, moveTo);

                  if (removeBranch.status) {
                    this.setState({ 
                      alert: null,
                      redirect: <Redirect to="/admin/stock_management" />
                    })
                    notifySuccess(t("Xóa kho {{type}} thành công", { type: this.formData.name }))
                    HttpService.setBranch(this.props.branchId, false, this.props.nameBranch)
                  }
                  else notifyError(removeBranch.message)
                }}
              />
            });
          } else notifyError("Chưa chọn kho tiếp nhận")
        }}
      />
    })
  }

  render() {
    let { formData, isSubmit, isEdit, redirect, alert, alertSelectBranch, branchList } = this.state;
    let { t } = this.props;

    return (
      <GridContainer>
        {redirect}
        {alert}
        {alertSelectBranch}
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <OhForm
                defaultFormData={ formData }
                onRef={ref => this.ohFormRef = ref}
                columns={[
                  [
                    {
                      name: "name",
                      label: t("Tên kho"),
                      ohtype: "input",
                      placeholder: t("Nhập tên kho"),
                      validation: "required",
                      message: t("Vui lòng nhập tên kho")
                    },
                    {
                      name: "branchId",
                      label: t("Chi nhánh"),
                      ohtype: "select",
                      validation: "required",
                      options: branchList.map(item => ({value: item.id, title: item.name})),
                      placeholder: t("Chọn chi nhánh"),
                      message: t("Vui lòng chọn chi nhánh"),
                      disabled: isEdit
                    },
                    {
                      name: "address",
                      label: t("Địa chỉ"),
                      ohtype: "textarea",
                      minRows: 2,
                      maxRows: 3,
                      placeholder: t("Nhập địa chỉ kho")
                    },
                    {
                      name: "notes",
                      label: t("Ghi chú"),
                      ohtype: "textarea",
                      minRows: 2,
                      maxRows: 3,
                      placeholder: t("Nhập ghi chú")
                    },
                  ],
                ]}
                onChange={value => {
                  this.onChange(value);
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} style={{ textAlign: 'right' }}>
          <OhButton
            type="add"
            disabled={isSubmit}
            icon={<AiOutlineSave />}
            onClick={() => this.submit()}  
            permission={{
              name: Constants.PERMISSION_NAME.SETUP_STOCK,
              type: Constants.PERMISSION_TYPE.TYPE_ALL
            }}         
          >
            {t("Lưu")}
          </OhButton>
          { 
            isEdit ? 
              <OhButton
                type="delete"
                icon={<MdDelete />}
                onClick={() => this.remove()} 
                permission={{
                  name: Constants.PERMISSION_NAME.SETUP_STOCK,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}         
              >
                {t("Xóa")}
              </OhButton>
              : null 
          }
          <OhButton
            type="exit"
            icon={<MdCancel />}
            onClick={() => this.setState({
              redirect: <Redirect to="/admin/stock_management" />
            })}            
          >
            {t("Thoát")}
          </OhButton>
        </GridItem>
      </GridContainer>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user,
    branchId: state.branchReducer.branchId,
    isGetBranch: state.branchReducer.isGetBranch,
    nameBranch: state.branchReducer.nameBranch,    
  };
})(withTranslation("translations")(index));