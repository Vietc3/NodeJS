import React from "react";
import { connect } from "react-redux";
import FormLabel from "@material-ui/core/FormLabel";
import { Popover, Tooltip } from "antd";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
// multilingual
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import Constants from 'variables/Constants/';
import { Container, Col, Row } from "react-bootstrap";
import "date-fns";
import productService from 'services/ProductService';
import productUnitService from 'services/ProductUnitService';
import DiscountForm from './DiscountForm';
import DiscountUnitPriceForm from './DiscountUnitPriceForm';
import NotificationError from "components/Notification/NotificationError.jsx";
import OhTable from "components/Oh/OhTable";
import TextField from '@material-ui/core/TextField';
import OhAutoComplete from "components/Oh/OhAutoComplete";
import ModalClickGroup from "views/ProductType/components/ModalClickGroup";
import { notifyError } from 'components/Oh/OhUtils';
import { trans } from "lib/ExtendFunction";
import OhSelectMaterial from 'components/Oh/OhSelectMaterial';
import _ from "lodash";

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      ProductsForm: [],
      discountAmount: 0,
      finalAmount: 0,
      totalAmount: 0,
      taxAmount: 0,
      payType: 0,
      deliveryType: 0,
      deliveryAmount: 0,
      paidAmount: 0,
      debtAmount: 0,
      isVisible: false,
      isChange: false,
      visiblePopDiscount: false,
      visiblePopTax: false,
    };

    this.uniqueId = 0;
    this.count = 1;
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { dataEdit, stockList } = this.props;
    let stock_List = Object.keys(stockList);

    if (prevProps.dataEdit !== dataEdit && dataEdit) {
      let productUnit = null;
      let products = dataEdit.products;
      let getProductUnits = this.props.productUnits && this.props.productUnits.length ? this.props.productUnits : await productUnitService.getProductUnits();

      if (!getProductUnits.length) {
        getProductUnits = getProductUnits.data
      }

      products.forEach(item => {
        let checkStock =  stockList[item.stockId] && stockList[item.stockId].deletedAt === 0;
        
        if (!checkStock) {
          item.stockQuantity = 0;
          item.stockDelete = true;
        } else {
          item.stockQuantity = item.productId[stockList[item.stockId].stockColumnName] || 0;
          item.stockDelete = false;
        }

        item.maxDiscount = item.productId.maxDiscount;
        item.type = item.productId.type;
        getProductUnits.forEach(unit => {
          if (item.productId.unitId === unit.id) {
            productUnit = unit;
            item.unit = productUnit.name;
            return;
          }
        })

        stock_List.map(stock => {
          let check_Stock =  stockList[stock] && stockList[stock].deletedAt === 0;
          if (check_Stock){
            item[stock] = item.productId[stockList[stock].stockColumnName] || 0 ;
          }
        }) 

        item.productId = item.productId.id;
        item.key = this.count;
        item.index = this.count;
        this.count += 1;

      })
      this.setState({
        ProductsForm: products,
        discountAmount: dataEdit.discountAmount,
        finalAmount: dataEdit.finalAmount,
        totalAmount: dataEdit.totalAmount,
        taxAmount: dataEdit.taxAmount,
        payType: dataEdit.payType,
        deliveryType: dataEdit.deliveryType,
        deliveryAmount: dataEdit.deliveryAmount,
        delivery: dataEdit.deliveryAmount,
        paidAmount: dataEdit.paidAmount,
        debtAmount: dataEdit.debtAmount,
        discount: (dataEdit.discountAmount/dataEdit.totalAmount)*100,
        isPercentDiscount: true,
        tax: (dataEdit.taxAmount/dataEdit.totalAmount)*100,
        isPercentTax: true
      }, () => this.sendData())
    }
  }

  onClickProduct = (id) => {
    let {stockList} = this.props;
    let { products, ProductsForm } = this.state;

    id = Number(id);
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

    let productFound = products.find(item => item.id === id);
    let product = {};
    if ( productFound ) {
      this.uniqueId += 1;
      product = {
        id: 'new_' + this.uniqueId,
        key: this.count,
        index: this.count,
        productId: id,
        productCode: productFound.code,
        productName: productFound.name,
        unit: productFound.unitId.name,
        stockQuantity: productFound[stockList[stockIdFirst].stockColumnName] || 0,
        stockId: Number(stockIdFirst),
        quantity: 1,
        unitPrice: productFound.saleUnitPrice,
        finalAmount: productFound.saleUnitPrice,
        sellPrice: productFound.saleUnitPrice,
        maxDiscount: productFound.maxDiscount,
        costUnitPrice: productFound.costUnitPrice,
        discount: 0,
        stockDelete: false,
        type: productFound.type
      }
      stock_List.map(stock => {
          product[stock] = productFound[stockList[stock].stockColumnName] || 0 ;
      }) 
      this.count += 1;
      this.setState({
        ProductsForm: [
          ...ProductsForm,
          product
        ],
        products: [],
        isChange: true,
      }, () => this.getTotalAmount())
    }
  }

  error = (mess) => {
    const { t } = this.props;
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={t(mess)} />
    })
  }

  getTotalAmount = () => {
    let total = 0;
    const { ProductsForm } = this.state;
    ProductsForm.map(item => total += item.finalAmount);
    this.setState({
      totalAmount: total,
    }, () => this.getAmounts())
  }

  getAmounts = () => {
    let { totalAmount, discount, isPercentDiscount, tax, isPercentTax, delivery } = this.state;
    let discountTotal = isPercentDiscount ? totalAmount * discount / 100 : discount;
    let taxTotal = isPercentTax ? totalAmount * tax / 100 : tax;
    let finalTotal = totalAmount;
    if (discountTotal)
      finalTotal -= discountTotal;
    if (taxTotal)
      finalTotal += taxTotal;
    delivery = Number(delivery);
    if(delivery)
      finalTotal += delivery;
    this.setState({
      discountAmount: !isNaN(discountTotal) ? discountTotal : 0,
      taxAmount: !isNaN(taxTotal) ? taxTotal : 0,
      deliveryAmount: delivery || 0,
      finalAmount: finalTotal,
      paidAmount: finalTotal,
      debtAmount: 0
    }, () => this.sendData())
  }

  sendData = () => {
    let { ProductsForm, discountAmount, finalAmount, totalAmount, taxAmount, deliveryAmount, paidAmount, debtAmount, isChange } = this.state;
    this.props.sendProductsData(
      ProductsForm,
      discountAmount,
      Math.round(finalAmount),
      totalAmount,
      taxAmount,
      deliveryAmount,
      paidAmount,
      debtAmount,
      isChange,
    )
  }

  onKeyInput = async (event) => { 
    const { t } = this.props
    if (event.target.value && event.keyCode === 13) {
      if(this.state.products.length === 0) {
      let getProductList = await productService.getProductList({
          filter: { stoppedAt: 0, or: [{ code: event.target.value }, { name: { contains: event.target.value } }, { barCode: event.target.value }] }      
        })
        if (getProductList.status) {
          this.setState({
            products: getProductList.data
          }, () => {
            if (getProductList.data.length === 1) { 
              this.onRef.ref.props.onSelect(getProductList.data[0].id) 
            } 
            else if (getProductList.data.length > 1) {
              this.onRef.ref.props.onSelect()
              this.chooseProduct(getProductList.data)
            }
            else
              notifyError(t("Sản phẩm không tồn tại hoặc đã ngừng kinh doanh"));
              this.onRef.ref.props.onSelect()
          }) 
        }
        else notifyError(getProductList.error)
      }
    }
  }

  onSearchProduct = async value => {
    this.time = new Date().getTime()
    let getProductList = await productService.getProductList({
      filter: { stoppedAt: 0, or: [{ name: { contains: value } }, { code: { contains: value } }] },
      limit: value === "" ? 0 : Constants.LIMIT_AUTOCOMPLETE_SEARCH,
      time: this.time
    });

    if (getProductList.status) {
      if (getProductList.data.length > 0 && this.time === getProductList.time)
        this.setState({ products: getProductList.data });
      else this.setState({ products: [] });
    }
  };

  removeProduct = (record) => {
    let products = this.state.ProductsForm;
    let index = products.findIndex(item => item.index === record.index);
    if ( index > -1 ) {
      products.splice(index, 1);
    }
    this.setState({ ProductsForm: products }, () => this.getTotalAmount())
  }

  getTextFieldDiscount = (value, readOnly) => {
    return(
      <TextField
        value={value ? ExtendFunction.FormatNumber(Math.round(value)) : 0}
        InputProps={{
          readOnly: readOnly,
          inputProps: {
            style: { textAlign: "right", width: 80, padding: 0 }
          },
        }}
      />
    )
  }

  chooseProduct(products) {
    let { ProductsForm } = this.state;
    let { stockList } = this.props;
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
    products.forEach(item => {
      this.uniqueId += 1;
      let newProduct = {
        id: 'new_' + this.uniqueId,
        key: this.count,
        index: this.count,
        productId: item.id,
        productCode: item.code,
        productName: item.name,
        unit: item.unitId.name,
        stockQuantity: item[stockList[stockIdFirst].stockColumnName] || 0,
        stockId: Number(stockIdFirst),
        quantity: 1,
        unitPrice: item.saleUnitPrice,
        finalAmount: item.saleUnitPrice,
        sellPrice: item.saleUnitPrice,
        discount: 0,
        maxDiscount: item.maxDiscount,
        costUnitPrice: item.costUnitPrice,
        stockDelete: false,
        type: item.type
      }
      stock_List.map(stock => {
          newProduct[stock] = item[stockList[stock].stockColumnName] || 0 ;
      }) 
      this.count += 1;
      ProductsForm.push(newProduct)
    })
    this.setState({
      ProductsForm: ProductsForm,
      products: [],
      isChange: true,
    }, () => this.getTotalAmount())
  }

  onClickGroupProduct = async productTypeId => {    
    const { t } = this.props
    try {
      let products = await productService.getProductList({filter: { productTypeId } })

      if (products.status) {
        if ( products.data.length > 0 ) {
          this.chooseProduct(products.data)
        } else notifyError(t("Không có sản phẩm nào ở nhóm này"))      
      } else throw products.error
    }
    catch(error){
      notifyError(t("Lấy sản phẩm theo nhóm sản phẩm bị lỗi"))
    }

  }
  
  visiblePopoverDiscountChange = (e) => {
    this.setState({visiblePopDiscount: e});
  }
  visiblePopoverTaxChange = (e) => {
    this.setState({visiblePopTax: e});
  }

  getStoreSelect = (record, index, options) => {
    let { t, stockList } = this.props;
    let { ProductsForm, isCanceledCard, isReturn } = this.state;
    if (ProductsForm[index] && ProductsForm[index].stockDelete && ProductsForm[index].stockDelete === true || isCanceledCard || isReturn) {
      return (<Tooltip 
        placement="leftTop" 
        title={ (ProductsForm[index].stockId && stockList[ProductsForm[index].stockId]) ? stockList[ProductsForm[index].stockId].name : ""} 
        mouseEnterDelay={0.5}
        ><span className="ellipsis-not-span">{ (ProductsForm[index].stockId && stockList[ProductsForm[index].stockId]) ? stockList[ProductsForm[index].stockId].name : ""}</span></Tooltip>) 
    } else {      
    return (
      <OhSelectMaterial 
        options = {options}
        onChange = {(value) => {
          ProductsForm[index].stockQuantity = record[value];
          ProductsForm[index].stockId = Number(value);
          this.setState({
            ProductsForm: ProductsForm
          },() => this.getTotalAmount())
        }}
        value={ProductsForm[index].stockId}
        formater={value => t(value)}
        disabled={isCanceledCard || isReturn}

      />
     )
    }
  }

  render() {
    let { t, isReturn, isCanceledCard, stockList } = this.props;
    let { products, ProductsForm, discountAmount, finalAmount, totalAmount, taxAmount, deliveryAmount } = this.state;
    let listStock = ExtendFunction.getSelectStockList(stockList, []);

    let columns = [
      {
        title: t("Mã"),
        dataIndex: "productCode",
        key: "productCode",
        width: "11%",
        align: "left",
      },
      {
        title: t("Tên sản phẩm"),
        dataIndex: "productName",
        key: "productName",
        width: "20%",
        align: "left",
        render: value => trans(value)
      },
      {
        title: t("Đơn vị"),
        dataIndex: "unit",
        key: "unit",
        width: "10%",
        align: "left",
      },
      {
        title: t("Kho"),
        dataIndex: "store",
        key: "store",
        width: "10%",
        align: "left",
        render: (value, record, index) => {
          if(record.type === Constants.PRODUCT_TYPES.id.merchandise)
            return this.getStoreSelect(record, index, listStock);
        }
      },
      {
        title: t("Tồn kho"),
        dataIndex: "stockQuantity",
        key: "stockQuantity",
        align: 'right',
        width: "10%",
        render: (value, record, index) => {
          if(record.type === Constants.PRODUCT_TYPES.id.merchandise)
            return ExtendFunction.FormatNumber(Math.round(value*100)/100) || 0;
        },
      },
      {
        title: t("Số lượng"),
        dataIndex: "quantity",
        key: "quantity",
        align: 'right',
        width: "10%",
        render: (value, record, index) => {
          return (
            <TextField
              value={ExtendFunction.FormatNumber(value) || 0}
              style = {{marginTop: record.discount && !isReturn && !isCanceledCard ? -14 : null}}
              InputProps={{
                readOnly: isReturn || isCanceledCard || (record.stockDelete && record.type === Constants.PRODUCT_TYPES.id.merchandise) ,
                inputProps: {
                  style: { textAlign: "right", width: 50}
                },
                onChange: e => {
                  let item = ProductsForm[index];
                  let sellPrice = Number(item.unitPrice - (item.discount ? item.discount : 0));
                  let val = e.target.value;
                  if (isNaN(ExtendFunction.UndoFormatNumber(val)) === false) {
                    let value = parseInt(ExtendFunction.UndoFormatNumber(val));
                    
                    item.quantity = value;
                    item.finalAmount = value * sellPrice;
                  }
                  if (val === "") {
                    item.quantity = '';
                    item.finalAmount = 0;
                  }

                  this.setState({ 
                    ProductsForm: ProductsForm,
                    isChange: true,
                   }, () => this.getTotalAmount())
                },
                onFocus: (e) => {
                  e.target.select()
                },
                onClick: (e) => {
                  e.target.select()
                },
                onKeyDown: async (e) => {
                  if (e.keyCode === 13 && (e.target.value === "" || e.target.value === "0")) {
                    this.removeProduct(record);
                  }
                },
                onBlur: async (e) => {
                  if (e.target.value === "" || e.target.value === "0") {
                    this.removeProduct(record);
                  }
                },
              }}
            />
          );
        },
      },
      {
        title: t("Giá bán"),
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: "10%",
        align: "right",
        render: (value, record, index) => {
          let product = ProductsForm[index];
          let oldFinalAmount = product.quantity * product.unitPrice;
          
          return (
            (isReturn || isCanceledCard || (record.stockDelete && record.type === Constants.PRODUCT_TYPES.id.merchandise))
            ? <TextField
                value={value ? ExtendFunction.FormatNumber(Math.round(product.unitPrice - product.discount)) : 0}
                InputProps={{
                  readOnly: true,
                  inputProps: {
                    style: { textAlign: "right", width: 80 }
                  },
                }}
              />
            :
              <Popover
                trigger="click"
                placement="bottomRight"
                getPopupContainer={trigger => trigger.parentNode}
                content={
                  <DiscountUnitPriceForm
                    onChange={(formData) => {
                      let item = ProductsForm[index];

                      item.discount = formData.unitPrice - formData.sellPrice;
                      item.finalAmount = formData.sellPrice * item.quantity;
                      item.sellPrice = formData.sellPrice;
                      this.setState({ 
                        ProductsForm: ProductsForm, 
                        isChange: true, 
                      }, () => this.getTotalAmount())
                    }}
                    defaultFormData={{
                      unitPrice: product.unitPrice,
                      discount: record.discount,
                      discountType: record.discountType,
                      finalAmount: product.unitPrice - (product.discount ? product.discount : 0),
                      maxDiscount: product.maxDiscount
                    }}
                    isInvoice
                  />
                }
              >
                <span>
                  <TextField
                    value={ExtendFunction.FormatNumber(Math.round( product.sellPrice || (product.unitPrice - product.discount))) || 0}
                    InputProps={{
                      readOnly: true,
                      inputProps: {
                        style: { textAlign: "right", width: 80}
                      }
                    }}
                  />
                </span><br />
                {product.finalAmount !== oldFinalAmount && (
                  <span className={'line-through'}>
                    {ExtendFunction.FormatNumber(Math.round(product.unitPrice)) || 0}
                  </span>
                )}
              </Popover>
          )
        },
      },
      {
        title: t("Thành tiền"),
        dataIndex: "finalAmount",
        key: "finalAmount",
        align: 'right',
        render: value => {
          return ExtendFunction.FormatNumber(Math.round(value)) || 0;
        },
        width: "15%"
      },
    ];

    if(listStock.length <= 1){
      columns.splice(3,1);
    }

    return (
      <>
        {this.state.br}
        {this.state.brerror}
        <GridContainer style={{ width: "100%" }}>
          {this.state.isVisible ? 
          <ModalClickGroup
            visible={this.state.isVisible}
            transferData={(isVisible, data) => {
              this.setState({ isVisible });
              this.onClickGroupProduct(data.productTypeId)
            }}
            handleCloseModal={isVisible => this.setState({ isVisible })}
          /> : null }
          <GridItem xs={12} >
            <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className='HeaderForm'>{t("Thông tin sản phẩm")}</b>
            </FormLabel>
          </GridItem>
        </GridContainer>
        {isReturn || isCanceledCard ? null :
          <GridContainer style={{ width: '100%', marginLeft: 0 }}>
            <GridItem className = {"products_auto_complete"} xs={12} style={{ width: '100%' }} id='AutoComplete' >
              <OhAutoComplete
                dataSelects={products}
                onSearchData={value => this.onSearchProduct(value)}
                placeholder={t(Constants.PLACEHOLDER_SEARCH_PRODUCTS)}
                onClickValue={id => this.onClickProduct(id)}
                isButton
                onClick={() => this.setState({isVisible: true})}
                onKeyPress={e => this.onKeyInput(e)}
                onRef={ref => this.onRef = ref}
              />
            </GridItem>
          </GridContainer>            
          }
        <GridContainer style={{ width: "100%", margin: 0 }}>
          <GridItem xs={12} >
            <OhTable
              onRef={ref => (this.tableRef = ref)}
              columns={columns}
              dataSource={ProductsForm}
              hasRemoveColumn={(value, record)=>{
                return !(
                    (record.stockDelete || isCanceledCard || isReturn)
                  )
              }}
              onClickRemove={(value, record) => {
                this.removeProduct(record)
              }}
              isNonePagination={true}
              id={"product-form-table"}
              emptyDescription={Constants.NO_PRODUCT}
            />
          </GridItem>
        </GridContainer>

        <GridContainer style={{ width: "100%" }} justify='flex-end'>
          <GridItem xs={6}>
            <Container>
              <Row>
                <Col style={{ textAlign: "right" }}>{t("Tổng tiền ({{ count }} sản phẩm)", {count: ProductsForm.length})}</Col>
                <Col style={{ maxWidth: 150, textAlign: "right", fontWeight: 700 }}>
                  {ExtendFunction.FormatNumber(Math.round(totalAmount))}
                </Col>
              </Row>

              <Row className = 'row-invoice'>

                <Col style={{ textAlign: "right" }}>
                  {t("Chiết khấu")}
                </Col>

                <Col style={{ maxWidth: 150, textAlign: "right", fontWeight: 700 }}>
                  {isReturn || isCanceledCard ? this.getTextFieldDiscount(discountAmount, true) :
                    <Popover
                      trigger="click"
                      placement="bottomRight"
                      getPopupContainer={trigger => trigger.parentNode}
                      visible={this.state.visiblePopDiscount}
                      onVisibleChange={ (e) => this.visiblePopoverDiscountChange(e) }
                      content={
                        <DiscountForm
                          title={t('Chiết khấu thường')}
                          onChangeDiscount={(isPercent, discount) => {
                            this.setState({
                              discount: Number(discount),
                              isPercentDiscount: isPercent,
                              isChange: true,
                            }, () => this.getAmounts())
                          }}
                          discountAmount={discountAmount}
                          totalAmount={totalAmount}
                          onChangeVisible={ (e) => this.visiblePopoverDiscountChange(e) }
                        />
                      }
                    >
                      {this.getTextFieldDiscount(discountAmount, true)}
                    </Popover>
                  }
                </Col>
              </Row>

              <Row className = 'row-invoice'>
                <Col style={{ textAlign: "right" }}>
                  {t("Thuế")}
                </Col>
                <Col style={{ maxWidth: 150, textAlign: "right", fontWeight: 700 }}>
                {isReturn || isCanceledCard ? this.getTextFieldDiscount(taxAmount, true) :
                  <Popover
                    trigger="click"
                    placement="bottomRight"
                    getPopupContainer={trigger => trigger.parentNode}
                    visible={this.state.visiblePopTax}
                    onVisibleChange={ (e) => this.visiblePopoverTaxChange(e) }
                    content={
                      <DiscountForm
                        title={t('Thuế GTGT')}
                        onChangeDiscount={(isPercent, tax) => {
                          this.setState({
                            tax: Number(tax),
                            isPercentTax: isPercent,
                            isChange: true,
                          }, () => this.getAmounts())
                        }}
                        discountAmount = {taxAmount}
                        totalAmount = {totalAmount}
                        onChangeVisible={ (e) => this.visiblePopoverTaxChange(e) }
                      />
                    }
                  >
                    {this.getTextFieldDiscount(taxAmount, true)}
                    </Popover>
                  }
                </Col>
              </Row>

              <Row className = 'row-invoice'>
                <Col style={{ textAlign: "right" }}>
                  {t("Phí giao hàng")}
                </Col>
                <Col style={{ maxWidth: 150, textAlign: "right", fontWeight: 700 }}>
                  <TextField
                    value={deliveryAmount ? ExtendFunction.FormatNumber(parseInt(deliveryAmount)) : 0}
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "right", width: 80, padding: 0 },
                      },
                      onChange: (e) => {
                        let value = e.target.value.replace(/[^0-9]/g, "");
                        this.setState({
                          delivery: value,
                          isChange: true,
                        }, () => this.getAmounts())
                      },
                      onClick: (e) => {
                        e.target.select()
                      },
                      readOnly: isReturn || isCanceledCard ? true : false
                    }}
                  />
                </Col>
              </Row>

              <Row className = 'row-invoice'>
                <Col style={{ textAlign: "right" }}>{t("Khách phải trả")}</Col>
                <Col style={{ maxWidth: 150, textAlign: "right", fontWeight: 700 }} className={'total-amount'}>
                  {finalAmount ? ExtendFunction.FormatNumber(Math.round(finalAmount)) : 0}
                </Col>
              </Row>
            </Container>
          </GridItem>
        </GridContainer>
      </>
    );
  }
}

export default connect(function(state) {
  return ({
    stockList: state.stockListReducer.stockList,
    productUnits: state.productUnitReducer.productUnits
  });
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProductForm)
  )
);
