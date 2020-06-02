import React from "react";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { Redirect } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import OhForm from "components/Oh/OhForm";

import RoleService from "services/RoleService";
import Constants from "variables/Constants";

import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import { MdSave, MdCancel } from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';
import { connect } from "react-redux";
import userAction from "store/actions/UserAction";
class EditRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: { name: "", notes: "" },
      prevData: {},
      changeData: {},
      typeArray: [],
      redirect: null,
      errors: {},
    };
    this.ohFormRef = null;
  }

  componentDidMount() {
    this.setData();
  }

  getNewType(item) {
    let name = {
      product: 0,
      management_price: 0,
      stock_check: 0,
      invoice: 0,
      import: 0,
      invoice_return: 0,
      import_return: 0,
      deposit: 0,
      income_expense_type: 0,
      income_expense: 0,
      customer: 0,
      supplier: 0,
      report_overall: 0,
      report_sale: 0,
      report_stock: 0,
      report_profit: 0,
      report_debt: 0,
      report_general_debt: 0,
      report_cashbook: 0,
      setup_store: 0,
      action_log: 0,
      setup_user: 0,
      manufacture_product: 0,
      manufacture_ware_house: 0,
      manufacture_card: 0,
      report_income_expense: 0,
      invoice_order_card: 0,
      sales_counter: 0,
      import_order_card: 0,
      report_import_export_detail: 0,
      report_import_export: 0,
      report_low_stock: 0,
      setup_branch: 0,
      setup_stock: 0
    }
    return name
  }

  async setData() {
    let path = this.props.location.pathname.split('/');
    let pathtoken = path[path.length - 1];
    if (pathtoken === "") {
      this.setState({
        changeData: this.getNewType(),
        prevData: this.getNewType(),
        pathtoken: pathtoken
      })
    }
    else {
      let role = await RoleService.getRole(pathtoken);
      this.setState({
        role: role.role,
        changeData: {...this.getNewType(), ...role.type},
        prevData: {...this.getNewType(), ...role.type},
        pathtoken: pathtoken
      })
    }
  }

  handleSubmit = () => {
    let { role, changeData } = this.state
    let data = { ...role, type: changeData }
    
		if(this.ohFormRef.allValid())
      this.doSubmit(data);
  };

  doSubmit(data) {
    let { pathtoken } = this.state;

    if (pathtoken === "" || pathtoken === Constants.ADD_ROLE_ROUTE) {
      this.createRole(data);
    }
    else {
      this.updateRole(data);
    }
  }

  async updateRole(data) {
    const { t , currentUser } = this.props;
    try {
      let updateRole = await RoleService.saveRole(data)
      if (updateRole.status){
        this.setState({
          idRole : updateRole.data.dataRole.id
        });
        
        if ( updateRole.data.dataRole.id === currentUser.role.id){
          this.props.dispatch(userAction.updatePermission(updateRole.data.dataPermisson));
        }

        this.success(t("Cập nhật thành công"))
      } else throw updateRole.error
    }
    catch(error) {
      if (typeof error === "string") {
        this.error(t(error));
        return;
      }
      if (error.response.data.localeCompare(' column "notes" ') === 1 ) {
        this.error(t("Ghi chú quá dài"));
        return;
      }
      this.error()
    }
  }

  async createRole(data) {
    const { t } = this.props;
    try {
      let createRole = await RoleService.addRole(data)

      if (createRole.status){
        this.setState({
          idRole : createRole.data.id
        });
        this.success(t("Tạo bộ phận thành công"))
      }
      else throw createRole.error
    }
    catch(error) {
      if (typeof error === "string") {
        this.error(t(error));
        return;
      }
      if (error.response.data.localeCompare(' column "notes" ') === 1 ) {
        this.error(t("Ghi chú quá dài"));
        return;
      }
      this.error()
    }
  }

  onChange = obj => {
    let keys = Object.keys(obj);
    let findName = keys.find(item => item === "name");
    
    if ( findName ) {
      let role = { ...this.state.role, ...obj };
      this.setState({ role: role });
    }
    else {

      let changeData = { ...this.state.changeData, ...obj };
      this.setState({ changeData: changeData });
    }

  };

  success = (mess) => {
    this.setState({
      redirect: <Redirect to={{ pathname: Constants.MANAGE_ROLE_PATH }} />,
    })
    notifySuccess(mess)
  }

  error = (mess) => {
    notifyError(mess)
  }

  render() {
    const { t } = this.props;
    const { role, errors, prevData, changeData, pathtoken } = this.state;
    let isAdmin = pathtoken && role.id && role.id === 1 ? true : false;
    
    const column1 = [
      {
        name: "name",
        label: t("Bộ phận"),
        ohtype: "input",
        validation: "required",
        message: t("Vui lòng điền tên bộ phận"),
        disabled: isAdmin
      },
      {
        name: "notes",
        label: t("Ghi chú"),
        ohtype: "textarea",
        placeholder: "Ghi chú",
        minRows: 4,
        maxRows: 6,
        disabled: isAdmin
      },
    ]

    function col(title, name, checkSelect) {  
      return ({
        name: name,
        label: title,
        ohtype: "select",
        className: prevData[name] === undefined ? null : prevData[name] === changeData[name] ? null : "select-change",
        options: checkSelect ? Constants.OPTIONS_ROLE_TYPE_REPORT.map( item => ({title: t(item.title), value: item.value})): Constants.OPTIONS_ROLE_TYPE.map( item => ({title: t(item.title), value: item.value})),
        showSearch: false,
        disabled: isAdmin
      })
    }

    const Sanpham = [
      col(t("Danh mục"), "product",false),
      col(t("Quản lý giá"), "management_price",false),
      col(t("Kiểm kho"), "stock_check",false),
    ]

    const BanHang = [
      col(t("Đơn hàng"), "invoice",false),
      col(t("Trả hàng"), "invoice_return",false),
      col(t("Đặt hàng"), "invoice_order_card",false),
      col(t("Bán hàng tại quầy"), "sales_counter",false),
    ]

    const NhapHang = [
      col(t("Nhập hàng"), "import",false),
      col(t("Trả hàng"), "import_return",false),
      col(t("Đặt hàng"), "import_order_card",false),
    ]

    const Quanlysanxuat = [
      col(t("Thành phẩm"), "manufacture_product",false),
      col(t("Kho sản xuất"), "manufacture_ware_house",false),
      col(t("Phiếu sản xuất"), "manufacture_card",false),
    ]

    const Doitac = [
      col(t("Khách hàng"), "customer",false),
      col(t("Nhà cung cấp"), "supplier",false),
    ]
    const Soquy = [
      col(t("Phiếu thu chi"), "income_expense",false),
      col(t("Tiền ký gửi"), "deposit",false),
      col(t("Loại thu chi"), "income_expense_type",false),
    ]
    const Thietlap = [
      col(t("Cửa hàng"), "setup_store",false),
      col(t("Phân quyền"), "setup_user",false),
      col(t("Lịch sử thao tác"), "action_log",false),
      col(t("Chi nhánh"), "setup_branch",false),
      col(t("Kho"), "setup_stock",false),
    ]
    const Baocao = [
      col(t("Tổng quan"), "report_overall", true),
      col(t("Bán hàng"), "report_sale",true),
      col(t("Nhập xuất tồn"), "report_import_export",true),
      col(t("Nhập xuất chi tiết"), "report_import_export_detail",true),
      col(t("Tồn kho"), "report_stock",true),
      col(t("Cảnh báo tồn kho"), "report_low_stock",true),
      col(t("Thu chi tổng quát"), "report_income_expense",true),
      col(t("Công nợ tổng quát"), "report_general_debt",true),
      col(t("Công nợ"), "report_debt",true),
    ]

    const form = (title, columns) => [
      <GridItem key={title} md={12} lg={12} className="role-Gird">
        <Card className="role-card">
          <GridItem sx={12} sm={12} md={10} lg={8} className="role-Gird">
            <OhForm
              title={title}
              totalColumns={1}
              columns={columns}
              defaultFormData = {changeData}
              onChange={value => { this.onChange(value) }}
              validator={this.validator}
              errors={errors}
            />
          </GridItem>
        </Card>
      </GridItem>
    ]

    return (
      <>
        {this.state.redirect}
        <Card>
          <GridContainer >
            <GridItem sx={12} sm={12} md={10} lg={8}>
              <CardHeader>
                <OhForm
                  title={t("Thông tin bộ phận")}
                  totalColumns={1}
                  columns={[column1]}
                  defaultFormData={role}
                  onRef={ref => this.ohFormRef = ref}
                  onChange={value => { this.onChange(value) }}
                  validator={this.validator}
                  errors={errors}
                />
              </CardHeader>
            </GridItem>
          </GridContainer>
        </Card>

        <GridContainer>
          {<span className="HeaderForm-title"><b >{t("Phân quyền")}</b></span> }
          {form("Sản phẩm", [Sanpham])}
          {form("Bán hàng", [BanHang])}
          {form("Nhập hàng", [NhapHang])}
          {parseInt(this.props.Manufacture) === Constants.MANUFACTURE_OPTIONS.ON ? form("Quản lý sản xuất", [Quanlysanxuat]) : null}
          {form("Đối tác", [Doitac])}
          {form("Sổ quỹ", [Soquy])}
          {form("Thiết lập", [Thietlap])}
          {form("Báo cáo", [Baocao])}

        </GridContainer>
            <OhToolbar
              right={[
                {
                  type: "button",
                  label: t("Lưu"),
                  onClick: () => this.handleSubmit(),
                  icon: <MdSave />,
                  simple: true,
                  typeButton: "add",
                  permission: {
                    name: Constants.PERMISSION_NAME.SETUP_USER,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                  disabled: isAdmin
                },
                {
                  type: "link",
                  label: t("Thoát"),
                  icon: <MdCancel />,
                  linkTo: Constants.MANAGE_ROLE_PATH,
                  simple: true,
                  typeButton: "exit"
                },
              ]}
            />
      </>
    )
  }
}

export default connect(function (state) {
  return {
    currentUser: state.userReducer.currentUser,
    Manufacture: state.reducer_user.Manufacture
  };
})(withTranslation("translations")(EditRole));