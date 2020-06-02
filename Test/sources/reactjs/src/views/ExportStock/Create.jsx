import React, { Component } from 'react';
import { connect } from "react-redux"
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import { withTranslation } from "react-i18next";
import OhForm from "components/Oh/OhForm.jsx";
import Constants from "variables/Constants/index.js";
import ExtendFunction from "lib/ExtendFunction.js";
import { notifySuccess, notifyError } from "components/Oh/OhUtils.js";
import { MdSave, MdCancel, MdDeleteForever } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import { Container, Row } from "react-grid-system";
import FormLabel from "@material-ui/core/FormLabel";
import OhNumberInput from 'components/Oh/OhNumberInput.jsx';
import OhAutoComplete from 'components/Oh/OhAutoComplete.jsx';
import productService from 'services/ProductService.js';
import UserService from 'services/UserService.js';
import MoveStockService from 'services/MoveStockService.js';
import moment from "moment";
import { Redirect } from 'react-router-dom';
import OhButton from 'components/Oh/OhButton.jsx';
import AlertQuestion from 'components/Alert/AlertQuestion.jsx';
import StoreConfig from 'services/StoreConfig.js';
import { printHtml} from "react-print-tool";
import OhTable from 'components/Oh/OhTable.jsx';
import ModalClickGroup from 'views/ProductType/components/ModalClickGroup/index.js';
import { trans } from "lib/ExtendFunction.js";
import OhSelectMaterial from 'components/Oh/OhSelectMaterial.jsx';
import {Tooltip } from "antd";


class Management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        reason: Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT,
        userName: this.props.currentUser.fullName,
        movedAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        movedBy: this.props.currentUser.id
      },
      dataRecipient: [],
      dataProducts: [],
      Products: [],
      redirect: null,
      isEdit: this.props.match.params.cardID ? true : false,
      alert: null,
      isSubmit: false,
      isVisible: false
    };
    this.ohFormRef = null;
    this.oldProducts = [];
    this.deleteProducts = [];
    this.count = 1;
  }
  
  componentWillMount = () => {
    let {products, reason} = this.props.location.state || {};
    if(products) this.addProductToList(Object.values(products).map(item => ({...item.record, quantity: item.value})));
    if(reason) this.setState({
      data: {
        ...this.state.data,
        reason
      }
    });
  }

  componentDidMount() {
    if ( this.props.match && this.props.match.params && this.props.match.params.cardID ) {
      this.getDataEdit(this.props.match.params.cardID)
    }

    this.getDataUser();
  }

  getDataEdit = async (id) => {
    const { stockList } = this.props
    let getDataEdit = await MoveStockService.getMoveStockCard(id);    
    let stock_List = Object.keys(stockList);

    if ( getDataEdit.status ) {
      let {foundMoveStockCard, foundMoveStockCardProducts} = getDataEdit.data;
      foundMoveStockCardProducts.forEach(item => {

        let checkStock =  stockList[item.stockId] && stockList[item.stockId].deletedAt === 0;

        if (!checkStock) {
          item.stockQuantity = 0;
          item.stockDelete = true;
        } else {          
          item.stockQuantity = item.productId[stockList[item.stockId].stockColumnName] || 0;
          item.stockDelete = false;
        }

        stock_List.map(stock => {
          let check_Stock =  stockList[stock] && stockList[stock].deletedAt === 0;
          if (check_Stock){
            item[stock] = item.productId[stockList[stock].stockColumnName] || 0 ;
          }
        }) 
        item.manufacturingQuantity = item.productId.manufacturingQuantity || 0;
        item.productId = item.productId.id || item.productId;
        item.oldQuantity = item.quantity || 0;
        item.key = this.count;
        item.index = this.count;
        this.count += 1;
      })

      this.setState({
        isEdit: true,
        data: {...foundMoveStockCard, userName: foundMoveStockCard.createdBy.fullName, movedBy: foundMoveStockCard.movedBy.id},
        dataProducts: foundMoveStockCardProducts || []
      })

      this.oldProducts = JSON.parse(JSON.stringify(getDataEdit.data.foundMoveStockCardProducts))
    }
    else notifyError(getDataEdit.message)
  }

  getDataUser = async () => {
    try {
      let getUsers = await UserService.getUserList({
        select: ["id", "fullName", "createdAt"] 
      })

      if ( getUsers.status ) {
        this.setState({ dataRecipient: getUsers.data })
      }
      else throw getUsers.error

    }
    catch(error) {
      if ( typeof error === "string" ) notifyError(error)      
    }
  }

  getDataPrintTemplate = async () => {
    let { data, dataProducts, dataRecipient } = this.state;
    let dataPrint = {
      created_on: data.createdAt ? 
        moment(Number(data.createdAt)).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) : moment(Number(data.movedAt)).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
      exported_on: moment(Number(data.movedAt)).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      received_on: moment(Number(data.movedAt)).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
      reference: data.reference || "",
      order_code: data.code || "",
      recipient_name: "",
      products: [],
      total_quantity: 0
    };

    let findRecipient = dataRecipient.findIndex(item => item.id === data.movedBy);
    
    if ( findRecipient !== -1 ) {
      dataPrint.recipient_name = dataRecipient[findRecipient].fullName
    }      

    if ( dataProducts.length > 0 ) {
      let count = 1;

      for ( let item of dataProducts ) {
        let name = trans(item.productName, true)
        dataPrint = {
          ...dataPrint,
          products: dataPrint.products.concat({
            line_stt: count++,
            line_variant_code: item.productCode,
            line_variant_name: name,
            line_quantity: Number(item.quantity)
          }),
          total_quantity: dataPrint.total_quantity += Number(item.quantity)
        }
      }

    }

    try {
      let printTemplate = await StoreConfig.printTemplate({ data: dataPrint, type: "export_stock" });
      if ( printTemplate.status ) 
        await printHtml(printTemplate.data)
      else throw printTemplate.error

    }
    catch(error) {
      if ( typeof error === "string" ) notifyError(error)
    }

  }

  handleSubmit = async () => {
    let { t } = this.props;
    let { dataProducts } = this.state;

    if ( this.ohFormRef.allValid() &&  dataProducts) {
      
      if ( dataProducts.length === 0 ) {
        notifyError(t("Chưa có sản phẩm"));
        return;
      }
      this.setState({isSubmit: true}, () => this.saveImportStock())       
    }
  }

  async saveImportStock() {
    let { dataProducts, data, isEdit } = this.state;
    let { t } = this.props;
  
    data.products = dataProducts;
    if ( this.deleteProducts.length > 0 ) data.deleteProducts = this.deleteProducts;
    let saveMoveStockCard = await MoveStockService.saveMoveStockCard(data);
    
    if ( saveMoveStockCard.status ) {
      let idMoveStockCard = this.props.match && this.props.match.params.cardID ? this.props.match.params.cardID : saveMoveStockCard.data.id;

      notifySuccess(isEdit ? t("Cập nhật phiếu {{type}} thành công", { type: t("Phiếu xuất kho") })  : t("Tạo phiếu {{type}} thành công", { type: t("Phiếu xuất kho") }))
      this.setState({ isSubmit: false, redirect: <Redirect to={{ pathname:"/admin/list-export_card" }} /> })
    }
    else {
      notifyError(saveMoveStockCard.message);
      this.setState({ isSubmit: false });
    }
  }

  cancelVote = () => {  
    let { t } = this.props;
    let { data } = this.state;

    this.setState({
      alert: (
        <AlertQuestion 
          messege={t("Bạn chắc chắn muốn hủy phiếu {{code}}?", {code: data.code})} 
          hideAlert={ this.hideAlert }
          action={() => {
            this.hideAlert()
            this.handleCancelVote();
          }}
          buttonOk={"Đồng ý"}
        />
      )
    })
  }

  handleCancelVote = async () => {
    let { data } = this.state;
    let { t } = this.props;
    
    let cancelMoveStockCard = await MoveStockService.cancelMoveStockCard(data.id);

    if ( cancelMoveStockCard.status ) {
      notifySuccess(t("Hủy phiếu xuất kho thành công"))
      this.setState({redirect: <Redirect to="/admin/list-export_card" />});

    }
    else notifyError(cancelMoveStockCard.message)
  }

  hideAlert = () => {
    this.setState({ alert: null })
  }

  removeProduct = record => {
    let { dataProducts, isEdit } = this.state;
    let { t } = this.props;
    let newProductList = dataProducts.slice();

    if ( isEdit && record.oldQuantity ) {
      let item = this.oldProducts.find(item => item.index === record.index);

      if ( item > -1 ) {
        if ( item.quantity > ( item.oldQuantity + item.stockQuantity ) ) {
          notifyError(t("Số lượng sản phẩm nhiều hơn tồn kho"))
          return;
        }
      }
    }

    let index = newProductList.findIndex(item => item.index === record.index);

    if ( index > -1 ) {
      if ( isEdit && record.oldQuantity ) this.deleteProducts.push(newProductList[index].id)

      newProductList.splice(index, 1);
    }

    this.setState({
      dataProducts: newProductList
    }, () => this.calculatorPrice());
  };

  getColumns = () => {
    const { t, stockList } = this.props;
    let { isEdit, data } = this.state;
    let listStock = ExtendFunction.getSelectStockList(stockList, []);

    let columns = [
      {
        title: t("Mã"),
        align: "left",
        width: "13%",
        dataIndex: "productCode",
        key: "code",
      },
      {
        title: t("Tên sản phẩm"),
        align: "left",
        width: "36%",
        dataIndex: "productName",
        key: "name",
        render: value =>trans(value)
      },
      {
        title: t("ĐVT"),
        align: "left",
        width: "12%",
        dataIndex: "productUnit",
        key: "productUnit",
      },
      {
        title: t("Kho"),
        dataIndex: "store",
        key: "store",
        width: "10%",
        align: "left",
        render: (value, record, index) => {
          return this.getStoreSelect(record, index, listStock);
        }
      },
      {
        title: t("Tồn kho"),
        align: "right",
        width: "13%",
        dataIndex: "stockQuantity",
        type: "number",
        key: "stockQuantity",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(Math.round(value*100000)/100000)
        }
      },
      {
        title: t("Tồn kho sx"),
        align: "right",
        width: "13%",
        dataIndex: "manufacturingQuantity",
        type: "number",
        key: "manufacturingQuantity",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(Math.round(value*100000)/100000)
        }
      },
      {
        title: t("SL xuất"),
        align: "right",
        width: "13%",
        dataIndex: "quantity",
        type: "number",
        key: "quantity",
        render: (value, record, index) => {
          let item = this.state.dataProducts[index];                    
          return <OhNumberInput 
            defaultValue={item.quantity} 
            isNegative={false}
            onChange={value => this.onChangeQuantity(value, item.index)}
            style={{ color: ( ( !isEdit && value > item.manufacturingQuantity ) 
              || ( isEdit && ( ( item.oldQuantity ? item.oldQuantity : 0 ) + item.manufacturingQuantity) < value ) )
              ? "red" : null }}
            disabled= { ((data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED) && isEdit) || item.stockDelete  }
          />
        }
      },
    ];

    if(listStock.length <= 1){
      columns.splice(3,1);
    }

    return columns
  }

  getStoreSelect = (record, index, options) => {
    let { t, stockList } = this.props;
    let { dataProducts, isEdit, data } = this.state;

    if (dataProducts[index] && dataProducts[index].stockDelete && dataProducts[index].stockDelete === true || ((data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED) && isEdit)) {
      return (<Tooltip 
        placement="leftTop" 
        title={ dataProducts[index].stockId && stockList[dataProducts[index].stockId] ? stockList[dataProducts[index].stockId].name : ""} 
        mouseEnterDelay={0.5}
        ><span className="ellipsis-not-span">{dataProducts[index].stockId && stockList[dataProducts[index].stockId] ? stockList[dataProducts[index].stockId].name : ""}</span></Tooltip>)
    } else {
      return (
        <OhSelectMaterial 
          options = {options}
          onChange = {(value) => {
            dataProducts[index].stockQuantity = record[value];
            dataProducts[index].stockId = Number(value);
            this.setState({
              dataProducts: dataProducts
            }, () => this.onChangeQuantity(record.quantity, record.productId))
          }}
          value={dataProducts[index].stockId}
          formater={value => t(value)}
          disabled={(data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED) && isEdit}
        />
      )
    }
  }

  onChangeQuantity = (value, id) => {
    let { dataProducts } = this.state;

    id = Number(id);

    let foundProduct = dataProducts.findIndex( item => item.index === id )

    if ( foundProduct !== -1 ) {
      if ( value.length === 0 ) value = 0;

      dataProducts[foundProduct].quantity = value;
      dataProducts[foundProduct].finalAmount = value * dataProducts[foundProduct].unitPrice;
      dataProducts[foundProduct].total = value * dataProducts[foundProduct].unitPrice;

      this.setState({
        dataProducts
      }, () => this.calculatorPrice())
    }

  }

  calculatorPrice() {
    let { dataProducts } = this.state;    
    let totalAmount = 0;

    dataProducts.forEach(item => {
      item.finalAmount = (item.unitPrice * item.quantity);
      totalAmount += item.finalAmount;
    });

    this.setState({dataProducts: dataProducts});
    this.onChange({ totalAmount })
  }

  onSearchData = async value => {
    let { data } = this.state;
    this.time = new Date().getTime();
    let getProductList = await productService.getProductList({
      filter: { 
        type: Constants.PRODUCT_TYPES.id.merchandise,
        or: [{ name: { contains: value } }, { code: { contains: value } }] ,
        ...(data.reason === Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT ? {category: Constants.PRODUCT_CATEGORY_TYPE.FINISHED} : {})
      }, 
      manualFilter: {
        ["productstock.manufacturingQuantity"]: { ">": 0},
      },
      limit: value === "" ? 0 : Constants.LIMIT_AUTOCOMPLETE_SEARCH,
      time: this.time
    });
    if ( getProductList.status ) {
      if (getProductList.time === this.time)
        this.setState({ Products: getProductList.data });
    }
  }

  onChange = value => {
    this.setState({
      data: {
        ...this.state.data,
        ...value
      }
    })
  }

  onClickProduct = (id) => {
    id = Number(id);
    let { dataProducts, Products, isEdit } = this.state;
    let {stockList} = this.props;
    let stockIdFirst;
    let stock_Lists = Object.keys(stockList);
    let stock_List = [];

    if (stock_Lists.length){
      stock_Lists.map(stock => {
        let check_Stock =  stockList[stock] && stockList[stock].deletedAt === 0;
        if (check_Stock){
          stock_List.push(stock) ;
        }
      })
  
      stockIdFirst = stock_List[0];
    }
    
    let productFound = Products.find(item => item.id === id);    
    let product = {};   
    if (productFound) {
      product = {
        productId: id,
        key: this.count,
        index: this.count,
        productCode: productFound.code,
        productName: productFound.name,
        productUnit: productFound.unitId.name,
        quantity: productFound.quantity !== undefined ? productFound.quantity : 1,
        discount: 0,
        finalAmount: productFound.saleUnitPrice,
        unitPrice: productFound.saleUnitPrice,
        total: productFound.saleUnitPrice,
        stockQuantity: productFound[stockList[stockIdFirst].stockColumnName] || 0,
        stockId: Number(stockIdFirst),
        manufacturingQuantity: productFound.manufacturingQuantity,
        stockDelete: false
      }  
      stock_List.map(stock => {
          product[stock] = productFound[stockList[stock].stockColumnName] || 0 ;
      }) 
      this.count += 1;   
      this.setState({
        dataProducts: [
          ...dataProducts,
          product
        ]
      }, () => this.calculatorPrice())
    }
  }

  onClickGroupProduct = async productTypeId => {
    let { data } = this.state;
    let { t } = this.props;

    try {
      let products = await productService.getProductList({
        filter: { 
          type: Constants.PRODUCT_TYPES.id.merchandise,
          productTypeId,
          ...(data.reason === Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT ? {category: Constants.PRODUCT_CATEGORY_TYPE.FINISHED} : {}) 
        },
        manualFilter: {
          ["productstock.manufacturingQuantity"]: { ">": 0},
        },
      })

      if (products.status) {
        if ( products.data.length > 0 ) {
          this.addProductToList(products.data)
        } else notifyError(t("Không có sản phẩm nào"))      
      } else throw products.error
    }
    catch(error){
      notifyError(t("Lấy sản phẩm theo nhóm sản phẩm bị lỗi"))
    }
  }
  
  addProductToList = (products) => {
    let {dataProducts} = this.state;
    const {stockList} = this.props;
    let stockIdFirst;
    let stock_Lists = Object.keys(stockList);
    let stock_List = [];

    if (stock_Lists.length){
      stock_Lists.map(stock => {
        let check_Stock =  stockList[stock] && stockList[stock].deletedAt === 0;
        if (check_Stock){
          stock_List.push(stock) ;
        }
      })
  
      stockIdFirst = stock_List[0];
    }

    for(let product of products) {
      let newProduct = {
        productId: product.id,
        key: this.count,
        index: this.count,
        productCode: product.code,
        productName: product.name,
        productUnit: product.unitId.name,
        quantity: product.quantity !== undefined ? product.quantity : 1,
        discount: 0,
        finalAmount: product.saleUnitPrice,
        unitPrice: product.saleUnitPrice,
        total: product.saleUnitPrice,
        stockQuantity: product[stockList[stockIdFirst].stockColumnName] || 0,
        stockId: Number(stockIdFirst),
        manufacturingQuantity: product.manufacturingQuantity,
        stockDelete: false
      }
      stock_List.map(stock => {
          newProduct[stock] = product[stockList[stock].stockColumnName] || 0 ;
      }) 
      this.count += 1;   
      dataProducts.push(newProduct);
      
    }
    
    this.setState({
      dataProducts: dataProducts,
    }, () => this.calculatorPrice())
  }

  render() {
    const { data, dataRecipient, isEdit, isSubmit, dataProducts, Products } = this.state;
    const { t } = this.props;
    const isCancel = data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED ? true : false;
    
    const column1 = [
      {
        name: "code",
        label: t("Mã phiếu"),
        ohtype: "input",
        placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
        disabled: isCancel
      },
      {
        name: "reason",
        label: t("Lý do"),
        ohtype: "select",
        options: Constants.MOVE_STOCK_REASON.arr.filter(item => item.id !== Constants.MOVE_STOCK_REASON.id.IMPORT).map(item => ({title: t(item.name), value: item.id})),
        validation: "required",
        message: "Vui lòng chọn lý do xuất kho",
        disabled: isCancel || isEdit
      },
      {
        name: "reference",
        label: t("Tham chiếu"),
        ohtype: "input",
        disabled: ((data.status === Constants.MOVE_STOCK_CARD_STATUS.id.FINISHED) || !isEdit) ? false : true
      },
      {
        name: "movedBy",
        label: t("Người xuất"),
        validation: "required",
        ohtype: "select",
        message: "Vui lòng chọn tên người xuất kho",
        placeholder: t("Chọn người nhận"),
        options: dataRecipient.map(item => ({ title: item.fullName || item.name, value: item.id })),
        disabled: ((data.status === Constants.MOVE_STOCK_CARD_STATUS.id.FINISHED) || !isEdit) ? false : true
      },
    ];

    const column2 = [
      {
        name: "userName",
        label: t("Người tạo"),
        ohtype: "input",
        disabled: true
      },
      {
        name: "movedAt",
        label: t("Ngày nhập"),
        ohtype: "date-picker",
        placeholder: t("Chọn ngày nhập"),
        formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
        disabled: isEdit
      },
      {
        name: "notes",
        label: t("Ghi chú"),
        ohtype: "textarea",
        minRows: 3,
        maxRows: 4,
        disabled: data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED ? true : false
      },
    ];

    return (      
      <Card>
        {this.state.redirect}
        {this.state.alert}
        <ModalClickGroup
          visible={this.state.isVisible}
          transferData={(isVisible, data) => {
            this.setState({ isVisible });
            this.onClickGroupProduct(data.productTypeId)
          }}
          handleCloseModal={isVisible => this.setState({ isVisible })} 
        />
        <CardBody>
          <OhForm
            title={t("Thông tin chung")}
            tag={isCancel ? Constants.MOVE_STOCK_CARD_STATUS.name[data.status] : null}
            defaultFormData={data}
            onRef={ref => this.ohFormRef = ref}
            columns={[column1, column2]}
            onChange={value => { this.onChange(value) }}
            validator={this.validator}
          />
          <Container className={"react-grid-system-container"}>
            <Row className={"oh-row"}>
              <FormLabel className="ProductFormAddEdit">
                <b className="HeaderForm">{t("Danh sách sản phẩm")}</b>
              </FormLabel>
            </Row>
            <OhAutoComplete 
              dataSelects={Products} 
              onSearchData={value => this.onSearchData(value)}
              placeholder={t("Tìm nguyên vật liệu hoặc sản phẩm theo mã hoặc tên")}
              onClickValue={id => this.onClickProduct(id)}
              disabled= { ((data.status === Constants.MOVE_STOCK_CARD_STATUS.id.FINISHED) || !isEdit) ? false : true }
              isButton
              onClick={() => this.setState({isVisible: true})} 
            />
            <OhTable
              id= "export-stock-products"  
              columns={this.getColumns()}
              hasRowNumberColumn={true}
              hasRemoveColumn={(value, record)=>{
                return !(
                    ((data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED) && isEdit) || record.stockDelete
                  )
              }}
              onClickRemove={(value, record) => {
                this.removeProduct(record)
              }}
              dataSource={dataProducts}
              isNonePagination
              emptyDescription={Constants.NO_PRODUCT}
            />
          </Container>
        </CardBody>
        <CardFooter>
          <GridContainer justify="flex-end" style={{ padding: 10 }}>
            {isCancel ? null :
              <OhButton
                type= "add"
                icon= {<MdSave />}
                onClick={() => this.handleSubmit()}
                disabled= {data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED || isSubmit ? true : false}
                permission={{
                  name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}
              >
                {t("Lưu")}
              </OhButton>
            }
            {this.props.match.params.cardID && !isCancel? 
              <OhButton
                type= "add"
                icon= {<AiFillPrinter />}
                onClick={() => this.getDataPrintTemplate()}
                disabled= {data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED ? true : false}
                permission={{
                  name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}
              >
                {t("In phiếu")}
              </OhButton>
            :null}
            {isCancel || !isEdit ? null :
              <OhButton
                type= "delete"
                icon= {<MdDeleteForever />}
                onClick={() => isEdit ? this.cancelVote() : null}
                linkTo={isEdit ? null : (Constants.ADMIN_LINK + Constants.LIST_EXPORT_STOCK)}
                disabled= {data.status === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED ? true : false}
                permission={{
                  name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}
              >
                {t("Hủy")}
              </OhButton>
            }
            
            <OhButton
              type= "exit"
              icon= {<MdCancel />}
              onClick={() => this.setState({ redirect: <Redirect to={Constants.ADMIN_LINK + Constants.LIST_EXPORT_STOCK} /> })}
            >
              {t("Thoát")}
            </OhButton>          
          </GridContainer>
        </CardFooter>
      </Card>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user,
    languageCurrent: state.languageReducer.language,
    stockList: state.stockListReducer.stockList
  };
})(withTranslation("translations")(Management));