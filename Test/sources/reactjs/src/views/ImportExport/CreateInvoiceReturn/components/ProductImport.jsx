import React, { Component } from 'react';
import FormLabel from "@material-ui/core/FormLabel";
import { connect } from "react-redux";
import { Select, Popover, Tooltip } from "antd";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import Constants from 'variables/Constants/';
import { Container, Col, Row } from "react-bootstrap";
import productService from 'services/ProductService';
import productUnitService from 'services/ProductUnitService';
import DiscountForm from 'views/Invoice/Create/DiscountForm';
import OhAutoComplete from 'components/Oh/OhAutoComplete';
import OhTable from "components/Oh/OhTable";
import TextField from '@material-ui/core/TextField';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import OhButton from 'components/Oh/OhButton';
import ModalClickGroup from 'views/ProductType/components/ModalClickGroup';
import { notifyError } from 'components/Oh/OhUtils';
import { trans } from "lib/ExtendFunction";
import OhSelectMaterial from 'components/Oh/OhSelectMaterial';
import _ from "lodash";
const { Option } = Select;

class ProductImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      ProductsForm: [],
      dataProducts: [],
      totalAmount: 0,
      totalQuantity: 0,
      discountAmount: 0,
      finalAmount: 0,
      taxAmount: 0,
      deliveryAmount: 0,
      isChange: false,
      isVisible: false,
      tax: 0,
      discount: 0,
      visiblePopDiscount: false,
      visiblePopTax: false,
      selectStock: "0",
    };
    this.count = 1;
  }

  onClickProduct = (id) => {
    id = Number(id);
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

    let { dataProducts, ProductsForm } = this.state;
    let productFound = dataProducts.find(item => item.id === id);
    let product = {};    

    if (productFound) {
      product = {
        productId: id,
        key: this.count,
        index: this.count,
        productCode: productFound.code,
        productName: productFound.name,
        unit: productFound.unitId.name,
        quantity: 1,
        discount: 0,
        stockQuantity: productFound[stockList[stockIdFirst].stockColumnName] || 0,
        finalAmount: productFound.lastImportPrice,
        lastImportPrice: productFound.lastImportPrice,
        unitPrice: productFound.lastImportPrice,
        total: productFound.lastImportPrice,
        stockQuantity: productFound.stockQuantity,
        stockId: Number(stockIdFirst),
        stockDelete: false
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
        dataProducts: [],
        isChange: true
      }, () => this.calculationPrice())
    }
  }


  async componentDidUpdate(prevProps, prevState) {
    let { stockList } = this.props;
    let stock_List = Object.keys(stockList);

    if (this.props.dataEdit !== prevProps.dataEdit && this.props.dataEdit) {
      if (this.props.dataEdit.products.length > 0) {        
        let products = this.props.dataEdit.products;        
        let unitProduct = await productUnitService.getProductUnits();
        products.forEach(async item => {
          let checkStock =  stockList[item.stockId] && stockList[item.stockId].deletedAt === 0;          
          if (!checkStock) {
            item.stockQuantity = 0;
            item.stockDelete =  true;
          } else {
            item.stockQuantity = item.productStock[stockList[item.stockId].stockColumnName] || 0;
            item.stockDelete =  false;
          }

          item.total = item.quantity * item.finalAmount;
          for (let i in unitProduct.data) {
            if (item.productId.unitId === unitProduct.data[i].id) {
              item.unit = unitProduct.data[i].name;
              break;
            }
          }
          
          stock_List.map(stock => {
            let check_Stock =  stockList[stock] && stockList[stock].deletedAt === 0;
            if (check_Stock){
              item[stock] = item.productId[stockList[stock].stockColumnName] || 0 ;
            }
          }) 

          item.lastImportPrice = item.productId.lastImportPrice;      
          item.productId = item.productId.id || item.productId;
          item.oldStock = item.stockId;
          item.key = this.count;
          item.index = this.count;
          this.count += 1;
        })
        this.setState({
          ProductsForm: products,
          totalAmount: this.props.totalAmount,
          discountAmount: this.props.discountAmount,
          finalAmount: this.props.finalAmount,
          taxAmount: this.props.taxAmount,
          deliveryAmount: this.props.deliveryAmount,
          discount: (this.props.discountAmount/this.props.totalAmount)*100,
          isPercentDiscount: true,
          tax: (this.props.taxAmount/this.props.totalAmount)*100,
          isPercentTax: true
        }, () => this.calculationPrice())
      }
    }
  }

  calculationPrice() {
    let { ProductsForm, deliveryAmount, isChange, discount, isPercentDiscount, tax, isPercentTax } = this.state;
    let {paidAmount, type} = this.props;
    let totalAmount = 0, finalAmount = 0, totalQuantity = 0;
    ProductsForm.forEach(item => {
      totalAmount += parseFloat(item.finalAmount * item.quantity);
      totalQuantity += item.quantity;
    });
    finalAmount = totalAmount;

    let discountAmount = parseFloat((isPercentDiscount ? totalAmount * discount / 100 : discount) || 0);
    if (discountAmount)
      finalAmount = Math.round(finalAmount - discountAmount);

    let taxAmount = Math.round((isPercentTax ? totalAmount * tax / 100 : tax) || 0);
    if (taxAmount)
      finalAmount = Math.round(finalAmount + taxAmount);
    if (deliveryAmount)
      finalAmount = Math.round(finalAmount + deliveryAmount);
    paidAmount = type === 'add' ? finalAmount : Math.round(paidAmount);

    let dataSend = {
      totalAmount,
      totalQuantity,
      discountAmount,
      finalAmount,
      taxAmount,
      deliveryAmount,
      paidAmount,
      debtAmount: finalAmount - paidAmount,
      products: ProductsForm
    }
    
    this.setState({
      totalAmount,
      totalQuantity,
      discountAmount,
      finalAmount,
      taxAmount,
      deliveryAmount,
      isChange: true
    }, () => {
      this.props.onChangeInfoImport(dataSend, isChange)
    })
  }

  onSearchProduct = async value => {
    this.time = new Date().getTime();
    let getProductList = await productService.getProductList({
      filter: { type: Constants.PRODUCT_TYPES.id.merchandise, or: [{ name: { contains: value } },  { code: { contains: value } }] },
      limit: value === "" ? 0 : Constants.LIMIT_AUTOCOMPLETE_SEARCH,
      time: this.time
    });

    if (getProductList.status) {
      if ( getProductList.data.length > 0 && this.time === getProductList.time )      
        this.setState({ dataProducts: getProductList.data });
      else 
        this.setState({ dataProducts: [] });
    }
  }

  onKeyInput = async (event) => {
    const { t } = this.props
    if (event.target.value && event.keyCode === 13) {
      if(this.state.dataProducts.length === 0) {
      let getProductList = await productService.getProductList({
        filter: {type: Constants.PRODUCT_TYPES.id.merchandise, or: [{ code: event.target.value  }, { barCode: event.target.value }] }     
      })
        if (getProductList.status) {
          this.setState({
            dataProducts: getProductList.data
          }, () => {
            if (getProductList.data.length === 1) {
              this.onRef.ref.props.onSelect(getProductList.data[0].id)
            }
            else if ( getProductList.data.length > 1 ) {
              this.onRef.ref.props.onSelect()
              this.chooseProduct(getProductList.data)
            }
            else notifyError(t("Sản phẩm không tồn tại hoặc đã ngừng kinh doanh"))
            this.onRef.ref.props.onSelect()
          })
        }
        else notifyError(getProductList.error)
     }
   }
  }

  chooseProduct(products) {
    let { ProductsForm } = this.state;
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
        unitPrice: item.lastImportPrice,
        finalAmount: item.lastImportPrice,
        lastImportPrice: item.lastImportPrice,
        sellPrice: item.lastImportPrice,
        discount: 0,
        maxDiscount: item.maxDiscount,
        costUnitPrice: item.costUnitPrice,
        total: item.lastImportPrice,
        stockDelete: false
      }
      stock_List.map(stock => {
          newProduct[stock] = item[stockList[stock].stockColumnName] || 0 ;
      }) 
      this.count += 1;
      ProductsForm.push(newProduct);
    })
    
    this.setState({
      ProductsForm: ProductsForm,
      dataProducts: [],
      isChange: true,
    }, () => this.calculationPrice())
  }

  renderOption = item => {
    return (
      <Option key={item.id} text={item.name}>
        <div className="global-search-item">
          <span className="global-search-item-desc">{item.name}</span>
          <span className="global-search-item-count">{item.code}</span>
        </div>
      </Option>
    );
  };

  removeProduct = (record) => {
    let products = this.state.ProductsForm;
    let index = products.findIndex(item => item.index === record.index);
    if ( index > -1 ) {
      products.splice(index, 1);
    }
    this.setState({ ProductsForm: products }, () => this.calculationPrice())
  }

  visiblePopoverDiscountChange = (e) => {
    this.setState({visiblePopDiscount: e});
  }
  visiblePopoverTaxChange = (e) => {
    this.setState({visiblePopTax: e});
  }

  getTextFieldDiscount = (value, readOnly) => {
    return(
      <TextField
        value={value ? ExtendFunction.FormatNumber(Math.round(value*100)/100) : 0}
        InputProps={{
          readOnly: readOnly,
          inputProps: {
            style: { textAlign: "right", width: 80, padding: 0 }
          },
        }}
      />
    )
  }

  onClickGroupProduct = async productTypeId => {
    const { t } = this.props
    try {
      let products = await productService.getProductList({filter: { type: Constants.PRODUCT_TYPES.id.merchandise, productTypeId } })

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
  
  render() {
    const { t, isCanceledCard, isReturn, stockList, dataEdit } = this.props;
    const { ProductsForm } = this.state;
    let listStock = ExtendFunction.getSelectStockList(stockList, []);

    let columns = [
      {
        title: t("Mã"),
        dataIndex: "productCode",
        key: "code",
        align:"left",
        width: "11%"
      },
      {
        title: t("Tên"),
        dataIndex: "productName",
        key: "name",
        align:"left",
        width: "25%",
        render: value =>  trans(value) 
      },
      {
        title: t("Đơn vị"),
        dataIndex: "unit",
        key: "unit",
        align:"left",
        width: "12%"
      },
      {
        title: t("Kho"),
        dataIndex: "store",
        key: "store",
        align:"left",
        width: "13%",
        render: (value, record, index) => {  
          let data = ProductsForm[index];
          if (data && data.stockDelete && data.stockDelete === true || isCanceledCard || isReturn) {
            return (<Tooltip 
              placement="leftTop" 
              title={  data.stockId && stockList[data.stockId] ? stockList[data.stockId].name : ""} 
              mouseEnterDelay={0.5}
              ><span className="ellipsis-not-span">{data.stockId && stockList[data.stockId] ? stockList[data.stockId].name : ""}</span></Tooltip>) 
          } else {                
          return (
            <OhSelectMaterial 
              options = {listStock}
              onChange = {(value) => {
                data.stockQuantity = record[value];
                data.stockId = Number(value);
                this.setState({
                  ProductsForm: ProductsForm
                }, () => this.calculationPrice())
              }}
              value={data.stockId}
              formater={value => t(value)}
              disabled={(isCanceledCard || isReturn)}

            />
          );
          }
        }
      },
      {
        title: t("Tồn kho"),
        dataIndex: "stockQuantity",
        key: "stockQuantity",
        align: 'right',
        width: "9%",
        render: value => {
          return ExtendFunction.FormatNumber(Math.round(value*100)/100) || 0;
        },
      },
      {
        title: t("Số lượng"),
        dataIndex: "quantity",
        key: "quantity",
        align:"right",
        width: "12%",
        render: (value, record, index) => {

          return (
          <TextField
            id={"Input_quantity" + record.productId}
            value={ExtendFunction.FormatNumber(value)}
            InputProps={{
              readOnly: isCanceledCard || isReturn || record.stockDelete,
              inputProps: {
                style: { textAlign: "right", width: 50}
              },
              onChange: (e) => {
                let item = ProductsForm[index];
                let val = e.target.value;
               
                if(val === '') {
                  item.quantity = '';
                  item.total = 0;
                }
                else{
                  if (isNaN(ExtendFunction.UndoFormatNumber(val)) === false) {
                    let value = parseInt(ExtendFunction.UndoFormatNumber(val));                    
                    item.quantity = value;
                    item.total = value * item.finalAmount
                  }
                }
                this.setState({ 
                  ProductsForm,
                  isChange: true
                }, () => this.calculationPrice())
              },
              onClick: e => {
                if(e.target.value === '1')
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
          />);
        },
      },
      {
        title: t("Giá nhập lại"),
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: "12%",
        align: "right",
        render: (value, record, index) => {
          return (
            <TextField
              id={"Input_unitPrice" + record.productId}
              value={ExtendFunction.FormatNumber(record.finalAmount)}
              InputProps={{
                inputProps: {
                  style: { textAlign: "right", width: 100}
                },
                onChange: (e) => {
                  let item = ProductsForm[index];                  
                  let val = e.target.value;
                  if(val === '') {
                    item.finalAmount = '';
                    item.total = 0;
                  }
                  else {
                    if (isNaN(ExtendFunction.UndoFormatNumber(val)) === false) {
                      let value = parseInt(ExtendFunction.UndoFormatNumber(val));
                      item.finalAmount = value;
                      item.total = value * item.quantity;
                    }
                  }
                  this.setState({ 
                    ProductsForm,
                    isChange: true
                  }, () => this.calculationPrice())
                },
                onClick: (e) => {
                  if(parseInt(e.target.value) === 0)
                    e.target.value = ''
                },
                onBlur: async (e) => {
                  let item = ProductsForm[index];
                  if (e.target.value === "") {
                    item.finalAmount = 0;
                    item.total = 0;
                  }
                  this.setState({ 
                    ProductsForm,
                  })
                },
                readOnly: isCanceledCard || isReturn || record.stockDelete
              }}
            />
          );
        },
      },
      {
        title: t("Thành tiền"),
        dataIndex: "total",
        key: "total",
        align: "right",
        render: (value) => {
          return value ? ExtendFunction.FormatNumber(value) : 0;
        },
        width: "15%"
      },
    ];

    if(listStock.length <= 1){
      columns.splice(3,1);
    }

    return (
      <GridItem xs={12} sm={12} md={12} lg={12} >
        <ModalClickGroup
          visible={this.state.isVisible}
          transferData={(isVisible, data) => {
            this.setState({ isVisible });
            this.onClickGroupProduct(data.productTypeId)
          }}
          handleCloseModal={isVisible => this.setState({ isVisible })}
        />
        <Card >
          <CardBody >
            <GridContainer style={{ width: "100%" }}>
              <GridItem xs={12} >
                <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
                  <b className="HeaderForm">{t("Thông tin sản phẩm")}</b>
                </FormLabel>
              </GridItem>
            </GridContainer>

            {isCanceledCard || isReturn ? null :
              <GridContainer style={{ width: '100%', marginLeft: 0 }}>
                <GridItem className = {"products_auto_complete"} xs={12} style={{ width: '100%' }} id="autocompleteItem" >
                  <OhAutoComplete
                    dataSelects={this.state.dataProducts}
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

            <GridContainer justify='flex-end'>
              <GridItem xs={5}>
                <Container style={{ paddingBottom: 20 }}>
                  <Row>
                    <Col style={{textAlign: "right"}}>{t("Tổng số lượng") + ":"}</Col>
                    <Col className="Colums">
                      {ExtendFunction.FormatNumber(this.state.totalQuantity)}
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ textAlign: "right", whiteSpace: 'nowrap' }}>{t("Tổng số mặt hàng") + ":"}</Col>
                    <Col className="Colums">
                      {ProductsForm.length}
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ textAlign: "right" }}>{t("Tổng tiền hàng") + ":"}</Col>
                    <Col className="Colums">
                      {this.state.totalAmount ? ExtendFunction.FormatNumber(Math.round(this.state.totalAmount)) : 0}
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ textAlign: "right" }}>
                      {t("Chiết khấu") + ":"}
                    </Col>

                    <Col className="Colums">
                    {isCanceledCard || isReturn ? this.getTextFieldDiscount(this.state.discountAmount, true) :
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
                                discount: discount,
                                isPercentDiscount: isPercent,
                              }, () => this.calculationPrice())
                            }}
                            discountAmount={this.state.discountAmount}
                            totalAmount={this.state.totalAmount}
                            onChangeVisible={ (e) => this.visiblePopoverDiscountChange(e) }
                          />
                        }
                      >
                        {this.getTextFieldDiscount(this.state.discountAmount, false)}
                      </Popover>
                    }
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ textAlign: "right" }}>{t("Phải trả khách hàng") + ":"}</Col>
                    <Col className="Colums">
                      {this.state.finalAmount ? ExtendFunction.FormatNumber(Math.round(this.state.finalAmount)) : 0}
                    </Col>
                  </Row>
                </Container>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default (
  connect(function (state) {
    return {
      stockList: state.stockListReducer.stockList
    };
  })
) (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProductImport)
  )
);