import React, { Component } from 'react';
import { Tabs, Spin } from 'antd';
import { withTranslation } from 'react-i18next';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Constants from 'variables/Constants/index.js';
import moment from 'moment';
import ActionLogService from 'services/ActionLogService.js';
import ExtendFunction, { trans } from 'lib/ExtendFunction.js';

let { TabPane } = Tabs;
class Information extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        action: 1,
        function: 1,
        createdAt: new Date().getTime()
      },
      loading: true
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id) {
      this.getData()
    }
  }

  componentWillMount() {
    this.getData()
  }

  async getData() {
    this.setState({ loading: true })
    let getActionLog = await ActionLogService.getActionLog(this.props.id);

    if (getActionLog.status) {
      this.setState({
        data: getActionLog.data,
        loading: false
      })
    }
  }

  renderProduct = obj => {
    let { data } = this.state;
    let { t } = this.props;

    switch (data.action) {
      case 2:
      case 3: {
        return (<>
          {t("Sản phẩm") + ": "}<span><a href={Constants.EDIT_PRODUCT_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span>
          <br/>{t("Tên") + ": " + trans(obj.name, true)}
          <br/>{t("Nhóm") + ": " + obj.productTypeName}
          <br/>{t("Loại") + ": " + Constants.PRODUCT_TYPES.name[obj.type]}
          {obj.type === Constants.PRODUCT_TYPES.id.merchandise ?
          <>
            <br/>{t("Nhà cung cấp") + ": " + (obj.customerName || "")}
            <br/>{t("Mã vạch") + ": " + (obj.barCode ||"")}
            <br/>{t("Kho") + ": " + obj.stockName}
            <br/>{t("Tồn kho") + ": " + ExtendFunction.FormatNumber(obj.stockQuantity)}
            <br/>{t("TK tối thiểu") + ": " + obj.stockMin}
          </>
          : null}
          <br/>{t("ĐVT") + ": " + obj.productUnitName}
          <br/>{t("Giá vốn") + ": " + ExtendFunction.FormatNumber(obj.costUnitPrice)}
          <br/>{t("Giá bán") + ": " + ExtendFunction.FormatNumber(obj.saleUnitPrice)}
          <br/>{t("CK tối đa") + ": " + obj.maxDiscount}
          <br/>{t("Mô tả") + ": " + (obj.description || "")}
        </>)
      }
      case 5:
        return (
          <>
            {obj.length ? obj.map(item => (<>{t("Sản phẩm") + ": "+ item.code}<br/></>)) : t("Sản phẩm") + ": " + obj.code}
          </>
        )
      case 6:      
      case 9:
        return (
          <>
            {obj.length ? obj.map(item => (<>{t("Sản phẩm") + ": "}<span><a href={Constants.EDIT_PRODUCT_PATH + item.id} target="_blank" rel="noopener noreferrer">{item.code}</a></span><br/></>)) : <>{t("Sản phẩm") + ": "}<span><a href={Constants.EDIT_PRODUCT_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span></>}
          </>
        )
      case 8:
        return (
          <>
            {obj.length ? obj.map(item => (<>{t("Sản phẩm") + ": "}<span><a href={Constants.EDIT_PRODUCT_PATH + item.id} target="_blank" rel="noopener noreferrer">{item.code}</a></span><br/>{t("Nhóm sản phẩm") + ": " + item.productTypeName}<br/></>)) : <>{t("Sản phẩm") + ": "}<span><a href={Constants.EDIT_PRODUCT_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span></>}
          </>
        )
      case 10:
        return (
          <>
            <p>            
        {obj.products && obj.products.map(item => (<>{"- " + Math.abs(item.differenceQuantity) + " " + item.unitName + " "}<span><a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a></span><br/></>))}
              {t("từ kho") + " " + obj.stockName}
            </p>            
          </>
        )
      default: return;
    }
  }

  renderObjectContent = obj => {
    let { data } = this.state;
    let { t } = this.props;

    switch(data.function) {
      case 2: 
        return this.renderProduct(obj);
      case 3:
        return (
          <>
            <p>{t("Khách hàng") + ": "}<span><a href={Constants.EDIT_CUSTOMER_PATH + obj.customerId} target="_blank" rel="noopener noreferrer">{obj.customerCode}</a></span><br />
              {t("Trạng thái") + ": " + t(Constants.INVOICE_STATUS.name[obj.status]) }
              <br />{t("Mã phiếu") + ": "}<span><a href={this.showInfor()} target="_blank" rel="noopener noreferrer">{obj.code}</a></span>
              <br/>{t("Địa chỉ giao hàng") + ": " + (obj.deliveryType && obj.deliveryType === 1 ? t("Nhận tại cửa hàng"): t(obj.deliveryAddress))}
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Tổng tiền") + ": " + ExtendFunction.FormatNumber(obj.totalAmount)}
              <br/>{t("Giảm giá") + ": " + ExtendFunction.FormatNumber(obj.discountAmount)}
              <br/>{t("Thuế") + ": " + ExtendFunction.FormatNumber(obj.taxAmount)}
              <br/>{t("Phí giao hàng") + ": " + ExtendFunction.FormatNumber(obj.deliveryAmount)}
              <br/>{t("Khách phải trả") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}
              {obj.incomeExpense ? 
                <>
                  <br/>{t("Ngày thu") + ": " + moment(obj.incomeExpense.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT) }
                  <br/>{t("Còn lại") + ": " + ExtendFunction.FormatNumber((obj.finalAmount - obj.incomeExpense.amount))}
                  { obj.incomeExpense.depositAmount ?
                    <>
                      <br/>{t("trong đó")}
                      <br/>{t("Tiền ký gửi") + ": " + ExtendFunction.FormatNumber(obj.incomeExpense.depositAmount)}
                    </>
                  : null} 
                </> 
                : data.action === Constants.ACTION.CREATE ? <><br/>{t("Còn lại") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}</> : <><br/>{t("Thanh toán") + ": " + ExtendFunction.FormatNumber(obj.paidAmount)}</>}
              {obj.products && obj.products.map(item => (<><br/><span>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{": " + item.quantity +"*"+ExtendFunction.FormatNumber(item.unitPrice - item.discount) + " " + t("từ") + " "+ item.stockName}</span></>))}
            </p>            
          </>
        )       
      case 4: 
        return (
          <>
            <p>{t("Khách hàng") + ": "}<span><a href={Constants.EDIT_CUSTOMER_PATH + obj.recipientId} target="_blank" rel="noopener noreferrer">{obj.customerCode}</a></span><br />
              {t("Trạng thái") + ": " +  t(Constants.INVOICE_RETURN_CARD_STATUS_NAME[obj.status]) }
              <br />{t("Mã phiếu") + ": "}<span><a href={this.showInfor()} target="_blank" rel="noopener noreferrer">{obj.code}</a></span>
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Tổng tiền") + ": " + ExtendFunction.FormatNumber(obj.totalAmount)}
              <br/>{t("Giảm giá") + ": " + ExtendFunction.FormatNumber(obj.discountAmount)}
              <br/>{t("Thuế") + ": " + ExtendFunction.FormatNumber(obj.taxAmount)}
              <br/>{t("Phải trả khách") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}
              {obj.incomeExpense ? 
                <>
                  <br/>{t("Ngày chi") + ": " + moment(obj.incomeExpense.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT) }
                  <br/>{t("Còn lại") + ": " + ExtendFunction.FormatNumber((obj.finalAmount - obj.incomeExpense.amount))}
                </> 
                : data.action === Constants.ACTION.CREATE ? <><br/>{t("Còn lại") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}</> : <><br/>{t("Thanh toán") + ": " + ExtendFunction.FormatNumber(obj.paidAmount)}</>}
              {obj.products && obj.products.map(item => (<><br/><span>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{": " + item.quantity +"*"+ExtendFunction.FormatNumber(item.finalAmount) + " " + t("từ") + " "+ item.stockName}</span></>))}
            </p>            
          </>
        )
      case 5:
        return (
          <>
            <p>{t("Nhà cung cấp") + ": "}<span><a href={Constants.EDIT_SUPLIER_PATH + obj.recipientId} target="_blank" rel="noopener noreferrer">{obj.customerCode}</a></span><br />
              {t("Trạng thái") + ": " +  t(Constants.IMPORT_CARD_STATUS_NAME[obj.status]) }
              <br />{t("Mã phiếu") + ": "}<span><a href={this.showInfor()} target="_blank" rel="noopener noreferrer">{obj.code}</a></span>
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Tổng tiền") + ": " + ExtendFunction.FormatNumber(obj.totalAmount)}
              <br/>{t("Giảm giá") + ": " + ExtendFunction.FormatNumber(obj.discountAmount)}
              <br/>{t("Thuế") + ": " + ExtendFunction.FormatNumber(obj.taxAmount)}
              <br/>{t("Phí giao hàng") + ": " + ExtendFunction.FormatNumber(obj.deliveryAmount)}
              <br/>{t("Phải trả NCC") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}
              {obj.incomeExpense ? 
                <>
                  <br/>{t("Ngày chi") + ": " + moment(obj.incomeExpense.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT) }
                  <br/>{t("Còn lại") + ": " + ExtendFunction.FormatNumber((obj.finalAmount - obj.incomeExpense.amount))}
                  { obj.incomeExpense.depositAmount ?
                    <>
                      <br/>{t("trong đó")}
                      <br/>{t("Tiền ký gửi") + ": " + ExtendFunction.FormatNumber(obj.incomeExpense.depositAmount)}
                    </>
                  : null}
                </> 
                : data.action === Constants.ACTION.CREATE ? <><br/>{t("Còn lại") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}</> : <><br/>{t("Thanh toán") + ": " + ExtendFunction.FormatNumber(obj.paidAmount)}</>}
              {obj.products && obj.products.map(item => (<><br/><span>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{": " + item.quantity +"*"+ExtendFunction.FormatNumber(item.finalAmount) + " " + t("từ") + " "+ item.stockName}</span></>))}
            </p>            
          </>
        )
      case 6: {
        return (
          <>
            <p>{t("Nhà cung cấp") + ": "}<span><a href={Constants.EDIT_SUPLIER_PATH + obj.recipientId} target="_blank" rel="noopener noreferrer">{obj.customerCode}</a></span><br />
              {t("Trạng thái") + ": " + t(Constants.IMPORT_RETURN_CARD_STATUS_NAME[obj.status]) }
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Tổng tiền") + ": " + ExtendFunction.FormatNumber(obj.totalAmount)}
              <br/>{t("Giảm giá") + ": " + ExtendFunction.FormatNumber(obj.discountAmount)}
              <br/>{t("Thuế") + ": " + ExtendFunction.FormatNumber(obj.taxAmount)}
              <br/>{t("NCC phải trả") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}
              {obj.incomeExpense ? 
                <>
                  <br/>{t("Ngày thu") + ": " + moment(obj.incomeExpense.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT) }
                  <br/>{t("Còn lại") + ": " + ExtendFunction.FormatNumber((obj.finalAmount - obj.incomeExpense.amount))}
                </> 
                : data.action === Constants.ACTION.CREATE ? <><br/>{t("Còn lại") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}</> : <><br/>{t("Thanh toán") + ": " + ExtendFunction.FormatNumber(obj.paidAmount)}</>}
              {obj.products && obj.products.map(item => (<><br/><span>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{": " + item.quantity +"*"+ExtendFunction.FormatNumber(item.finalAmount) + " " + t("từ") + " "+ item.stockName}</span></>))}
            </p>            
          </>
        )
      }
      case 7: 
        return (
          <>
            <p>{t("Khách hàng") + ": "}<span><a href={Constants.EDIT_CUSTOMER_PATH + obj.customerId} target="_blank" rel="noopener noreferrer">{obj.customerCode}</a></span><br />
              {t("Trạng thái") + ": " +  t(Constants.ORDER_CARD_STATUS_NAME[obj.status]) }
              <br/>{t("Ngày đặt hàng") +": " + moment(obj.orderAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Ngày giao hàng") +": " + moment(obj.expectedAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Địa chỉ giao hàng") + ": " + (obj.deliveryType && obj.deliveryType === 1 ? t("Nhận tại cửa hàng"): t(obj.deliveryAddress))}
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Tổng tiền") + ": " + ExtendFunction.FormatNumber(obj.totalAmount)}
              <br/>{t("Giảm giá") + ": " + ExtendFunction.FormatNumber(obj.discountAmount)}
              <br/>{t("Thuế") + ": " + ExtendFunction.FormatNumber(obj.taxAmount)}
              <br/>{t("Khách phải trả") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}              
              {obj.products && obj.products.map(item => (<><br/><span>{"- " }<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{": " + item.quantity +"*"+ExtendFunction.FormatNumber(item.unitPrice - item.discount)}</span></>))}
            </p>            
          </>
        )
      case 8:
        return (
          <>
            <p>{t("Nhà cung cấp") + ": "}<span><a href={Constants.EDIT_SUPLIER_PATH + obj.customerId} target="_blank" rel="noopener noreferrer">{obj.customerCode}</a></span><br />
              {t("Trạng thái") + ": " +  t(Constants.ORDER_CARD_STATUS_NAME[obj.status]) }
              <br/>{t("Ngày đặt hàng") +": " + moment(obj.orderAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Ngày giao hàng") +": " + moment(obj.expectedAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Tổng tiền") + ": " + ExtendFunction.FormatNumber(obj.totalAmount)}
              <br/>{t("Giảm giá") + ": " + ExtendFunction.FormatNumber(obj.discountAmount)}
              <br/>{t("Thuế") + ": " + ExtendFunction.FormatNumber(obj.taxAmount)}
              <br/>{t("Phải trả NCC") + ": " + ExtendFunction.FormatNumber(obj.finalAmount)}              
              {obj.products && obj.products.map(item => (<><br/><span>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{": " + item.quantity +"*"+ExtendFunction.FormatNumber(item.unitPrice - item.discount)}</span></>))}
            </p>            
          </>
        )
      case 9:
        return (
          <>
            <p>{t("Mã phiếu") + ": "}<span><a href={Constants.EDIT_INCOME_CARD_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span><br />
              {t("Nhóm người nộp") + ": " +  t(Constants.INCOME_EXPENSE_CUSTOMER_TYPES.name[obj.customerType]) }
              <br/>{t("Tên người nộp") + ": " + obj.customerName}
              <br/>{t("Trạng thái") + ": " +  t(Constants.INCOME_EXPENSE_CARD_STATUS_NAME[obj.status]) }
              <br/>{t("Người tạo") + ": " + obj.userName}
              <br/>{t("Ngày tạo") + ": " + moment(obj.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Ghi chú") + ": " + obj.notes}             
              {obj.paymentDetail && obj.paymentDetail.length 
              && obj.paymentDetail.map(item => (<><br/>{t("Thanh toán") + ":"}<br/>
              <span style={{color: "blue", textDecorationLine:"underline"}}>{"- " + item.paymentCode + ": " + ExtendFunction.FormatNumber(item.paidAmount) + " " + t("còn lại") + " " + ExtendFunction.FormatNumber(item.amountPaid)}</span></>))} 
              <br/>{t("Giá trị ghi nhận") + ": " + ExtendFunction.FormatNumber(obj.amount)}
            </p>            
          </>
        )
      case 10:
        return (
          <>
            <p>{t("Mã phiếu") + ": "}<span><a href={Constants.EDIT_EXPENSE_CARD_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span><br />
              {t("Nhóm người nhận") + ": " +  t(Constants.INCOME_EXPENSE_CUSTOMER_TYPES.name[obj.customerType]) }
              <br/>{t("Tên người nhận") + ": " + obj.customerName}
              <br/>{t("Trạng thái") + ": " +  t(Constants.INCOME_EXPENSE_CARD_STATUS_NAME[obj.status]) }
              <br/>{t("Người tạo") + ": " + obj.userName}
              <br/>{t("Ngày tạo") + ": " + moment(obj.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Ghi chú") + ": " + obj.notes}
              {obj.paymentDetail && obj.paymentDetail.length 
              && obj.paymentDetail.map(item => (<><br/>{t("Thanh toán") + ":"}<br/>
              <span style={{color: "blue", textDecorationLine:"underline"}}>{"- " + item.paymentCode + ": " + ExtendFunction.FormatNumber(item.paidAmount) + " " + t("còn lại") + " " + ExtendFunction.FormatNumber(item.amountPaid)}</span></>))}
              <br/>{t("Giá trị ghi nhận") + ": " + ExtendFunction.FormatNumber(obj.amount)}    
            </p>            
          </>
        )
      case 11:
        return (
          <>
            <p>{t("Mã phiếu") + ": "}<span><a href={Constants.EDIT_COLLECT_DEPOSIT_CARD_PATH + "/" + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span><br />
              <br/>{t("Tên người nộp") + ": " + obj.customerName}
              <br/>{t("Trạng thái") + ": " +  Constants.DEPOSIT_STATUS_NAME[obj.status] }
              <br/>{t("Người tạo") + ": " + obj.userName}
              <br/>{t("Ngày tạo") + ": " + moment(obj.depositDate).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Giá trị ghi nhận") + ": " + ExtendFunction.FormatNumber(obj.amount)}    
            </p>            
          </>
        )
      case 12:
        return (
          <>
            <p>{t("Khách hàng") + ": " + obj.customerName}
              <br/>{t("Giá trị") + ": " + ExtendFunction.FormatNumber(obj.changeValue)}
              <br/>{t("Công nợ còn lại") + ": " + ExtendFunction.FormatNumber(obj.remainingValue)}
            </p>
          </>
        )
      case 13:
      case 14: 
        return (
          <>
            <p>{t("Tên") + ": " + obj.name}
              <br/>{t("Mã")+ ": " + obj.code}
              <br/>{t("Địa chỉ") + ": " + obj.address}
              <br/>{t("Số điện thoại") + ": " + obj.tel}
              <br/>{t("Email") + ": " + obj.email}
              <br/>{t("Mã số thuế") + ": " + obj.taxCode}
              <br/>{t("Giới tính") + ": " + obj.gender}
              <br/>{t("Ghi chú") + ": " + obj.notes}
            </p>
          </>
        )
      case 15:
        return (
          <>
            <p>{t("Tên chi nhánh") + ": "}<span>{obj.deletedAt > 0 ? obj.name.slice(0, -13) : <a href={Constants.EDIT_BRANCH_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.name}</a>}</span>
              <br/>{t("Trạng thái") + ": " + t(Constants.BRANCH_STATUS_NAME[obj.status])}              
              <br/>{t("Email") + ": " + obj.email}
              <br/>{t("Số điện thoại") + ": " +obj.phoneNumber}
              <br/>{t("Địa chỉ") + ": " + obj.address}
            </p>
          </>
        )
      case 16:
        return (
          <>
            <p>{t("Tên kho") + ": "}<span><a href={Constants.EDIT_STOCK_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.name}</a></span>
              <br/>{t("Chi nhánh") + ": " + obj.branchName}
              <br/>{t("Địa chỉ") + ": " + obj.address}
            </p>
          </>
        )
      case 17:
        return (
          <>
            <p>{t("Mã phiếu") + ": "}<span><a href={Constants.EDIT_STOCKTAKE_CARD_PATH + "/" + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span><br />
              {t("Chi nhánh") + ": " + obj.branchName}
              <br/>{t("Ghi chú") + ": " + obj.notes}            
              {obj.products && obj.products.map(item => (<><br/><span>
                {"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{" " + t("thay đổi") + " " + item.differenceQuantity + " (" + item.unitName + ") " + t("so với") + " " + item.stockQuantity + " (" + item.unitName + ") " + ((item.reason) ? ( t("lý do") + " " + (isNaN(item.reason) ? item.reason : t(Constants.STOCKCHECK_REASONS_NAME[item.reason]))) : "" ) }</span></>))}            </p>            
          </>
        )
      case 18:
        return (
          <>
            <p>{t("Mã phiếu") + ": "}<span><a href={Constants.EDIT_MANUFACTURING_CARD_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span>
              <br/>{t("Trạng thái") + ": " + t(Constants.MANUFACTURING_STATUS[obj.status])}
              <br/>{t("Ngày sản xuất") + ": " + moment(obj.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Thành phần sản xuất") + ": "}
              {obj.finishedProducts && obj.finishedProducts.map(item => (<><br/><span>{"- "}(<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.code}</a>){": " + item.quantity + " " + item.unitName}</span></>))}
              <br/><br/>{t("Nguyên liệu cần thiết") + ": "}
              {obj.materials && obj.materials.map(item => (<><br/><span>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.code}</a>{": " + item.quantity + " " + item.unitName}</span></>))}
            </p>
          </>
        )
      case 19:
        return (
          <>
            <p>{t("Mã phiếu") + ": "}<span><a href={Constants.EDIT_IMPORT_STOCK_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span><br />
              {t("Trạng thái") + ": " +  Constants.MOVE_STOCK_CARD_STATUS.name[obj.status] }
              <br/>{t("Người xuất") + ": " + obj.movedName}
              <br/>{t("Tham chiếu") + ": " + obj.reference}
              <br/>{t("Ngày chuyển") + ": " + moment(obj.movedAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}              
              {obj.products && obj.products.map(item => (<><br/><span>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{": " + item.quantity +" "+item.unitName + " " + t("từ") + " "+ item.stockName}</span></>))}
            </p>            
          </>
        )     
      case 20:
      case 21:
        return (
          <>
            <p>{t("Mã phiếu") + ": "}<span><a href={Constants.EDIT_EXPORT_STOCK_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span><br />
              {t("Trạng thái") + ": " +  Constants.MOVE_STOCK_CARD_STATUS.name[obj.status] }
              <br/>{t("Người nhận") + ": " + obj.movedName}
              <br/>{t("Tham chiếu") + ": " + obj.reference}
              <br/>{t("Ngày chuyển") + ": " + moment(obj.movedAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}              
              {obj.products && obj.products.map(item => (<><br/><span>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.productId} target="_blank" rel="noopener noreferrer">{item.productCode}</a>{": " + item.quantity +" "+item.unitName + " " + t("từ") + " "+ item.stockName}</span></>))}
            </p>            
          </>
        )
      case 22:
        return (
          <>
            <p>{t("Tên nhân viên") + ": "}<span><a href={Constants.EDIT_USER_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.fullName}</a></span>
              <br/>{t("Ngày sinh") + ": " + moment(obj.birthday).format(Constants.DISPLAY_DATE_FORMAT_STRING)}
              <br/>{t("Email") + ": " + obj.email}
              <br/>{t("Số điện thoại") + ": " + obj.phoneNumber}
              <br/>{t("Địa chỉ") + ": " + obj.address}
              <br/>{t("Đang hoạt động") + ": " + (+obj.isActive === 1? t("Có") : t("Không"))}
              <br/>{t("Bộ phận") + ": " + obj.roleName}
              <br/>{t("Chi nhánh") + ": "}
              {obj.branch && obj.branch.length && obj.branch.map(item => (
                <><br/><span>{"- " + item.name}</span></>
              ))}
            </p>
          </>
        )
      case 23:
        return (
          <>
            <p>{t("Mã phiếu") + ": "}<span><a href={Constants.EDIT_WITHDRAW_DEPOSIT_CARD_PATH + "/" + obj.id} target="_blank" rel="noopener noreferrer">{obj.code}</a></span><br />
              <br/>{t("Tên người nhận") + ": " + obj.customerName}
              <br/>{t("Tham chiếu") + ": " + obj.originalVoucherCode}
              <br/>{t("Trạng thái") + ": " +  Constants.DEPOSIT_STATUS_NAME[obj.status] }
              <br/>{t("Người tạo") + ": " + obj.userName}
              <br/>{t("Ngày tạo") + ": " + moment(obj.depositDate).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}
              <br/>{t("Ghi chú") + ": " + obj.notes}
              <br/>{t("Giá trị ghi nhận") + ": " + ExtendFunction.FormatNumber(obj.amount)}    
            </p>            
          </>
        )
      case 24: {
        if (obj.length) {
          switch(data.action){
            case 2: 
              return (
                <>
                  <p>{t("Sản phẩm") + ": "}<a href={Constants.EDIT_PRODUCT_PATH + obj[0].productId} target="_blank" rel="noopener noreferrer">{obj[0].productCode}</a>
                    <br/>{t("Tên sản phẩm") + ": " + trans(obj[0].productName, true)}
                    <br/>{t("Được thêm") + " " + obj.length + " " + t("Hình ảnh").toLowerCase()}
                  </p>
                </>
              )
            case 3: 
              return (
                <>
                  <p>{t("Sản phẩm") + ": "}<a href={Constants.EDIT_PRODUCT_PATH + obj[0].productId} target="_blank" rel="noopener noreferrer">{obj[0].productCode}</a>
                    <br/>{t("Tên sản phẩm") + ": " + trans(obj[0].productName, true)}
                    <br/>{t("Được cập nhật") + " " + obj.length + " " + t("Hình ảnh").toLowerCase()}
                  </p>
                </>
              )
            case 5:
              return (
                <>
                  <p>{t("Sản phẩm") + ": "}<a href={Constants.EDIT_PRODUCT_PATH + obj[0].productId} target="_blank" rel="noopener noreferrer">{obj[0].productCode}</a>
                    <br/>{t("Tên sản phẩm") + ": " + trans(obj[0].productName, true)}
                    <br/>{t("Đã xóa") + " " + obj.length + " " + t("Hình ảnh").toLowerCase()}
                  </p>
                </>
              )
            default: return;
          }
        } else return <>{t("Không có dữ liệu")}</>
      }
      case 25:
        return (
          <>
            <p>{t("Tên") + ": " + obj.name}
              <br/>{t("Loại") + ": " + t(Constants.INCOME_EXPENSE_TYPE_NAME[obj.type])}
              <br/>{t("Ghi chú") + ": " + obj.notes}
            </p>
          </>
        )
      case 26: {
        if (obj.length) {
          return (
            <>
              <p>
                {t("Sản phẩm") + ": "}<a href={Constants.EDIT_PRODUCT_PATH + obj[0].productId} target="_blank" rel="noopener noreferrer">{obj[0].productCode}</a>
                <br/>{t("Tên sản phẩm") + ": " + trans(obj[0].productName, true)}
                <br/>{t("Định mức NVL") + ": "}
                {obj.map(item => (<><br/>{"- "}<a href={Constants.EDIT_PRODUCT_PATH + item.materialId} target="_blank" rel="noopener noreferrer">{item.materialCode}</a>{": " + ExtendFunction.FormatNumber(item.quantity) + " " + item.unitName}</>))}
              </p>
            </>
          )
        }else return <>{t("Không có dữ liệu")}</>
      }
      case 27: {
        if (obj.length) {
          let objContent = {};
          
          for(let item of obj) {
            if(objContent[item.productTypeId])
              objContent[item.productTypeId] = {...objContent[item.productTypeId], count: objContent[item.productTypeId].count + 1 }
            else objContent[item.productTypeId] = { productTypeId: item.productTypeId, productTypeName: item.productTypeName, count: 1 }
          }

          if (Object.keys(objContent).length) {
            let arrContent = Object.values(objContent);

            return (<>{t("Cho các nhóm hàng sau") +":"}<br/>{arrContent.map(item => (<>
              <p>
                {item.productTypeName + ": " + item.count}
              </p>
            </>))}</>)
          }
          else return;
        }
        else {
          if (obj.productImport && obj.productImport.length) {
            let objContent = {};
            for (let item of obj.productImport) {
              if(objContent[item.productTypeId])
                objContent[item.productTypeId] = { ...objContent[item.productTypeId], count: objContent[item.productTypeId].count + 1 }
              else objContent[item.productTypeId] = { productTypeId: item.productTypeId, productTypeName: item.productTypeName, count: 1 }
            }

            if (Object.keys(objContent).length) {
              let arrContent = Object.values(objContent);
  
            return (<>{t("Cho các nhóm hàng sau") +":"}<br/>{arrContent.map(item => (<>
                <p>
                  {item.productTypeName + ": " + item.count}
                </p>
              </>))}</>)
            }
            else return;
          }
          else return;
        };
      }
      case 28: {
        if (obj.length){
          return (
            <>
              <p>
                {obj.map(item => (<>{"- "+ t("Mã khách hàng") + ": " + item.code + ", " + t("Tên khách hàng").toLowerCase() +": " + item.name + ", " + t("Điện thoại").toLowerCase() +", "
                + t("Địa chỉ").toLowerCase() + ": " + item.address + ", " + t("Mã số thuế").toLowerCase() +": " + item.taxCode + ", " + 
                t("Giới tính").toLowerCase() + ": " + item.gender + ", " + t("Email").toLowerCase() +": " + item.email}<br/></>))}
              </p>
            </>
          )
        }
        else return;
      }
      case 29: {
        if (obj.length){
          return (
            <>
              <p>
                {obj.map(item => (<>{"- "+ t("Mã nhà cung cấp") + ": " + item.code + ", " + t("Tên nhà cung cấp").toLowerCase() +": " + item.name + ", " + t("Điện thoại").toLowerCase() +", "
                + t("Địa chỉ").toLowerCase() + ": " + item.address + ", " + t("Mã số thuế").toLowerCase() +": " + item.taxCode + ", " + 
                t("Email").toLowerCase() +": " + item.email + ", " + t("Công nợ").toLowerCase() + ": " + ExtendFunction.FormatNumber(item.totalOutstanding)}<br/></>))}
              </p>
            </>
          )
        }
        else return;
      }
      case 30: return <p>{obj}</p>
      case 31:
        return obj.length ? obj.map(item => 
          (<>
            <p>{t("Tên") + ": " + (data.action === Constants.ACTION.DELETE ? item.name.slice(0,-13) : item.name)}
              <br/>{t("Ghi chú") + ": " + item.notes}
            </p>
          </>)) : (
          <>
            <p>{t("Tên") + ": " + (data.action === Constants.ACTION.DELETE ? obj.name.slice(0,-13) : obj.name)}
            </p>
          </>
        )
      case 32:
        return obj.length ? obj.map(item => 
          (<>
            <p>{t("Tên") + ": " + (data.action === Constants.ACTION.DELETE ? item.name.slice(0,-13) : item.name)}
            </p>
          </>)) : (
          <>
            <p>{t("Tên") + ": " + (data.action === Constants.ACTION.DELETE ? obj.name.slice(0,-13) : obj.name)}
            </p>
          </>
        )
      case 33: 
        return obj.length ? obj.map(item => 
          (<>
            <p>{t("Tên") + ": "}<span><a href={Constants.EDIT_ROLE_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.name}</a></span>
            </p>
          </>)) : (
          <>{t("Tên") + ": "}<span><a href={Constants.EDIT_ROLE_PATH + obj.id} target="_blank" rel="noopener noreferrer">{obj.name}</a></span>
            <br/>{t("Ghi chú") + ": "+ obj.notes}
            <br/>{t("Quyền") + ": "}
            {obj.permission && obj.permission.length && obj.permission.map(item => (
              <><br/>{t(Constants.OPTIONS_PERMISSION_TYPE[item.permissionName]) + ": " + t(Constants.ROLE_TYPE_NAME[item.type])}</>
            ))} 
          </>)
      case 34: {
        if (obj.length) {
          return(
            <>
              {obj.map(item => {
                switch(item.type) {
                  case "store_info": {
                    return (
                      <>
                        <p>
                          {t("Tên cửa hàng") + ": "}<a href={Constants.EDIT_STORE_PATH} target="_blank" rel="noopener noreferrer">{item.value.name}</a>
                          <br/>{t("Email") + ": " + item.value.email}
                          <br/>{t("Địa chỉ") + ": " + item.value.address}
                          <br/>{t("Số điện thoại") + ": " + item.value.tel}
                          <br/>{t("Ngôn ngữ") + ": " + item.value.language}
                          <br/>{t("Địa chỉ truy cập") + ": " + item.value.accessaddress}
                          <br/>{t("Hạn sử dụng") + ": " + moment(item.value.expirydate).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)}<br/>
                        </p>
                      </>
                    );
                  }
                  case "store_logo": {
                    return <>{t("Logo") + ": "}<br/><img src={item.value} alt="..." style={{ height: 150, width: 300}}/> </>
                  }
                  case "language_product": {
                    return <>{(+item.value === Constants.LANGUAGE_PRODUCT_OPTIONS.ON ? t("Bật").toLowerCase() : t("Tắt").toLowerCase()) + " " + t("Ngôn ngữ hệ thống").toLowerCase()}</>;
                  }
                  case "manufacturing_stock": {
                    return <>{(+item.value === Constants.MANUFACTURE_OPTIONS.ON ? t("Bật").toLowerCase() : t("Tắt").toLowerCase()) + " " + t("Kho sản xuất").toLowerCase()}</>;
                  }
                  case "manufacturing": {
                    return <>{(+item.value === Constants.MANUFACTURE_OPTIONS.ON ? t("Bật").toLowerCase() : t("Tắt").toLowerCase()) + " " + t("Quản lý sản xuất").toLowerCase()}</>;
                  }
                  case "print_template_invoice":
                  case "print_template_invoice_return":
                  case "print_template_import":
                  case "print_template_import_return":
                  case "print_template_incomeexponse_receipt":
                  case "print_template_incomeexponse_payment":
                  case "print_template_import_stock":
                  case "print_template_export_stock":
                  case "print_template_manufacturing_stock":
                  case "print_template_stock_take":
                  case "print_template_deposit_receipt":
                  case "print_template_deposit_checked":
                  case "print_template_invoice_order":
                  case "print_template_import_order": {
                    if (obj.length) {
                      let item = obj[0];

                      let splitValue = item.type.split("print_template_");
                      let value = splitValue[1];
                      
                      return (
                        <>
                          <p>
                            {t("Mẫu in") + ": " + t(Constants.PRINT_TEMPLATE_OPTIONS[value])}
                            {item.checkSample ? <><br/>{t("Khổ in") + ": " + item.checkSample}</> : null}
                            {item.checkSampleDefault ? <><br/>{t("Khổ in đặt làm mặc định") + ": " + item.checkSampleDefault}</> : null}
                          </p>
                        </>
                      );
                    }else return;
                  }
                  default: return;
                }

              })}
            </>
          )
        } else return;
      }          
      default: return;
    }
  }

  showInfor = () => {
    let URL = window.location.origin;
    let { data } = this.state;

    switch(data.function) {
      case 2: 
        return (
          URL + Constants.EDIT_PRODUCT_PATH + data.codeId
        ); 
      case 3:
        return (
          URL + Constants.MANAGE_INVOICE + data.codeId
        );      
      case 4:
        return (
          URL + Constants.MANAGE_INVOICE_RETURN + data.codeId
        );
      case 5:
        return (
          URL + Constants.EDIT_IMPORT_CARD_PATH + data.codeId
        );
      case 6:
        return (
          URL + Constants.EDIT_EXPORT_CARD_PATH + data.codeId
        );   
      case 7:
        return (
          URL + Constants.EDIT_ORDER_EXPORT_PATH + data.codeId
        ); 
      case 8:
        return (
          URL + Constants.EDIT_ORDER_IMPORT_PATH + data.codeId
        ); 
      case 9:
        return (
          URL + Constants.EDIT_INCOME_CARD_PATH + data.codeId
        );     
      case 10:
        return (
          URL + Constants.EDIT_EXPENSE_CARD_PATH + data.codeId
        );
      case 11:
        return (
          URL + Constants.EDIT_COLLECT_DEPOSIT_CARD_PATH  + "/" + data.codeId
        )
      case 23:
        return (
          URL + Constants.EDIT_WITHDRAW_DEPOSIT_CARD_PATH + "/" + data.codeId
        )
      case 13:
        return (
          URL + Constants.EDIT_CUSTOMER_PATH + data.codeId
        )
      case 14:
        return (
          URL + Constants.EDIT_SUPLIER_PATH + data.codeId
        )
      case 15:
        return (
          URL + Constants.EDIT_BRANCH_PATH + data.codeId
        )
      case 16:
        return (
          URL + Constants.EDIT_STOCK_PATH + data.codeId
        )
      case 17:
        return (
          URL + Constants.EDIT_STOCKTAKE_CARD_PATH + "/" + data.codeId
        )
      case 18:        
        return (
          URL + Constants.EDIT_MANUFACTURING_CARD_PATH + data.codeId
        )
      case 19:        
        return (
          URL + Constants.EDIT_IMPORT_STOCK_PATH + data.codeId
        )
      case 20:        
        return (
          URL + Constants.EDIT_EXPORT_STOCK_PATH + data.codeId
        )
      case 21:        
        return (
          URL + Constants.EDIT_EXPORT_STOCK_PATH + data.codeId
        )
      default:
        break;
    }
  }

  render() {
    let { data, loading } = this.state;
    let { t } = this.props;

    return (
      <>
        <Tabs key={this.props.id}>
          <TabPane tab={t("Nội dung chi tiết")} key={1}>
            <GridContainer justify="center" >
              <Spin spinning={loading}/>
            </GridContainer>
            { loading ? null :
              <GridContainer>
                <GridItem sm={8}>
                  <div >                    
                    <span style = {{fontWeight: "bold"}}>{data.userName + " " || " "}</span>
                    {t("{{action}} {{function}}",{action: t(Constants.ACTION_LOG_NAME[data.action]).toLowerCase(), function: t(Constants.ACTION_LOG_TYPE_NAME[data.function]).toLowerCase()})} 
                    {data.code ? <span>{" "}<a href={this.showInfor()} target="_blank" rel="noopener noreferrer">{data.code}</a></span> : " "}
                    <br/>{t("vào lúc {{time}} ngày {{date}} từ máy có địa chỉ {{ip}}",{ time:  moment(data.createdAt).format(Constants.DISPLAY_TIME_FORMAT_STRING), date: moment(data.createdAt).format(Constants.DISPLAY_DATE_FORMAT_STRING),ip: data.ip || ""})}
                    {t("bằng {{userAgent}}", { userAgent: data.userAgent || "" })}
                      
                  </div>
                </GridItem>
                {data.objectContentOld ? (data.action === Constants.ACTION.DELETE || data.action === Constants.ACTION.STOP ) || data.function === Constants.ACTION_TYPE.IMAGE_PRODUCT ? null :
                  <GridItem sm={6}>
                    <p style = {{fontWeight: "bold"}}>{t("Thông tin cũ") + ":"}</p>
                    {this.renderObjectContent(data.objectContentOld)}
                  </GridItem>
                : null}
                {data.objectContentNew ? <GridItem sm={6}>
                    <p style = {{fontWeight: "bold"}}>{(data.action === 2 ? t("Thông tin chi tiết") : t("Thông tin cập nhật")) + ":"}</p>
                    {this.renderObjectContent(data.objectContentNew)}
                  </GridItem>
                : null}
              </GridContainer>}        
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default withTranslation("translations")(Information);

