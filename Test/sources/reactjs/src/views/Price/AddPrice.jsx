import React from "react";
//antd
import { Select, Checkbox, Input } from 'antd';
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
//component
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import ExtendFunction from "lib/ExtendFunction";
import { Grid, ButtonGroup } from "@material-ui/core";
// for multilingual
import { withTranslation } from "react-i18next";
import ProductService from "services/ProductService.js";
import Constant from "variables/Constants";
import OhButton from "components/Oh/OhButton.jsx"
import { MdDone, MdCancel} from "react-icons/md";
import { notifyError, notifySuccess } from "components/Oh/OhUtils";
import _ from 'lodash';
import Store from "store/Store";
import Actions from "store/actions/";
import ManualSortFilter from "MyFunction/ManualSortFilter";
import { connect } from "react-redux";

class AddOriginalPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPrice: 0,
      selectOptionPrice: 0,
      selectPrice: 0,
      value: "0",
      increase: true,
      calPer: true,
      checkedBoxProduct: false,
      isSubmit: false
    };
  }

  getData = () => {
    let { data, isCostUnitPrice } = this.props;

    let newPrice = 0;

    newPrice = isCostUnitPrice ? data.costUnitPrice : data.saleUnitPrice;
    
    this.setState({
      newPrice,
      priceOption: newPrice,
      value: "0",
      increase: true,
      calPer: true,
      selectOptionPrice: 0,
      selectPrice: 0,
      checkedBoxProduct: false
    })
    this.newPrice_copy = newPrice;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data)
      this.getData();
  }

  componentDidMount() {
    this.getData();
  }

  calculatorPrice(data) {
    let { increase, calPer, selectOptionPrice, priceOption } = this.state;
    let value;
    let price = this.props.isCostUnitPrice ? data.costUnitPrice : data.saleUnitPrice;

    if (this.state.value.length > 0)
      switch (selectOptionPrice) {
        case Constant.OPTIONS_PRICE.CURRENT: {        
          if (increase && calPer)
            value = price ? price + (price * parseFloat(this.state.value) / 100) : 0;
          else if (!increase && calPer)
            value = price ? price - (price * parseFloat(this.state.value) / 100) : 0;
          else if (increase && !calPer)
            value = price ? price+ parseFloat(this.state.value) : parseFloat(this.state.value);
          else value = price ? price - parseFloat(this.state.value) : 0;
          priceOption = price || 0;
          break;
        }
        case Constant.OPTIONS_PRICE.UNIT: {
          if (increase && calPer)
            value = data.costUnitPrice ? data.costUnitPrice + (data.costUnitPrice * parseFloat(this.state.value) / 100) : 0;
          else if (!increase && calPer)
            value = data.costUnitPrice ? data.costUnitPrice - (data.costUnitPrice * parseFloat(this.state.value) / 100) : 0;
          else if (increase && !calPer)
            value = data.costUnitPrice ? data.costUnitPrice + parseFloat(this.state.value) : parseFloat(this.state.value);
          else value = data.costUnitPrice ? data.costUnitPrice - parseFloat(this.state.value) : 0;
          priceOption = data.costUnitPrice || 0;
          break;
        }
        case Constant.OPTIONS_PRICE.LAST_IMPORT: {
          if (increase && calPer)
            value = data.lastImportPrice ? data.lastImportPrice + (data.lastImportPrice * parseFloat(this.state.value) / 100) : 0;
          else if (!increase && calPer)
            value = data.lastImportPrice ? data.lastImportPrice - (data.lastImportPrice * parseFloat(this.state.value) / 100) : 0;
          else if (increase && !calPer)
            value = data.lastImportPrice ? data.lastImportPrice + parseFloat(this.state.value) : parseFloat(this.state.value);
          else value = data.lastImportPrice ? data.lastImportPrice - parseFloat(this.state.value) : 0;
          priceOption = data.lastImportPrice || 0;
          break;
        }
        case Constant.OPTIONS_PRICE.GENERAL: {
          if (increase && calPer)
            value = data.saleUnitPrice ? data.saleUnitPrice + (data.saleUnitPrice * parseFloat(this.state.value) / 100) : 0;
          else if (!increase && calPer)
            value = data.saleUnitPrice ? data.saleUnitPrice - (data.saleUnitPrice * parseFloat(this.state.value) / 100) : 0;
          else if (increase && !calPer)
            value = data.saleUnitPrice ? data.saleUnitPrice + parseFloat(this.state.value) : parseFloat(this.state.value);
          else value = data.saleUnitPrice ? data.saleUnitPrice - parseFloat(this.state.value) : 0;
          priceOption = data.saleUnitPrice || 0;
          break;
        }
        default: break;
      }
    else {
      switch (selectOptionPrice) {
        case 0: {
          value = this.props.isCostUnitPrice ? data.costUnitPrice ? data.costUnitPrice : 0 : data.saleUnitPrice ? data.saleUnitPrice : 0;
          priceOption = value;
          break;
        }
        case 3: {
          value = data.saleUnitPrice ? data.saleUnitPrice : 0;
          priceOption = value;
          break;
        }
        case 1: {
          value = data.costUnitPrice ? data.costUnitPrice : 0;
          priceOption = value;
          break;
        }
        case 2: {
          value = data.lastImportPrice ? data.lastImportPrice : 0;
          priceOption = value;
          break;
        }
        default: break;
      }
    }
    return {value, priceOption};
  }

  onChangeSelectOptionPrice(val) {

    this.setState({ selectOptionPrice: val }, () => {
      this.setValuePriceCal();
    })
  }

  success = () => {
    let { t, isCostUnitPrice } = this.props;
    
    notifySuccess(isCostUnitPrice ? t("Cập nhật giá vốn thành công") : t("Cập nhật giá bán thành công"));
    this.setState({ isSubmit: false });
    this.props.onCancel();
  }

  error = () => {
    let { t, isCostUnitPrice } = this.props;

    this.setState({ isSubmit: false });
    notifyError(isCostUnitPrice ? t("Cập nhật giá vốn thất bại") : t("Cập nhật giá bán thất bại"));
  }

  setValuePriceCal() {
    let value = this.calculatorPrice(this.props.data);

    this.setState({ newPrice: value.value > 0 ? Number(value.value).toFixed(2) : 0, priceOption: value.priceOption })
  }

  onClickModalPrice = (e, title) => {
    let { calPer , newPrice, value, priceOption, increase } = this.state;

    newPrice = parseFloat(newPrice);

    if (calPer && title === "vnd" || !calPer && title === "%")
      if ( increase ) {
        if (newPrice - Math.abs(newPrice - priceOption) === 0) value = 0;
        else value = calPer ? value * (newPrice - Math.abs(newPrice - priceOption)) / 100 : value * 100 / (newPrice - Math.abs(newPrice - priceOption));
      }
      else {
        if (newPrice + Math.abs(newPrice - priceOption) === 0) value = 0;
        else value = calPer ? value * (newPrice + Math.abs(newPrice - priceOption)) / 100 : value * 100 / (newPrice + Math.abs(newPrice - priceOption));
      }

    switch (title) {
      case "increase": {
        this.setState({ increase: true }, () => {
          this.setValuePriceCal();
        })
        break;
      }
      case "reduce": {
        this.setState({ increase: false }, () => {
          this.setValuePriceCal();
        })
        break;
      }
      case "vnd": {
        this.setState({ calPer: false, value: value.toString() }, () => this.setValuePriceCal())
        break;
      }
      case "%": {
        this.setState({ calPer: true, value: value.toString() }, () => this.setValuePriceCal())
        break;
      }
      case "value": {
        if (isNaN(ExtendFunction.UndoFormatNumber(e.target.value)) === false
          && parseFloat(ExtendFunction.UndoFormatNumber(e.target.value)) >= 0
          && ExtendFunction.UndoFormatNumber(e.target.value).length >= 1) {

          this.setState({
            [title]: calPer && ExtendFunction.UndoFormatNumber(e.target.value.length) > 3 ? "999" : ExtendFunction.UndoFormatNumber(e.target.value)
          }, () => {
            this.setValuePriceCal();
          })
        } else if (ExtendFunction.UndoFormatNumber(e.target.value).length === 0) {
          this.setState({ [title]: "" }, () => {
            this.setValuePriceCal();
          })
        }
        break;
      }
      default:
        break;
    }
  }

  async saveAllProduct() {
    let { isCostUnitPrice } = this.props;
    
    try {
      let saveProduct = await ProductService.updateProductPrice({
        value: this.state.value === "" ? 0 : this.state.increase ? this.state.value : -this.state.value,
        isCalculatePercent: this.state.calPer,
        selectOptionPrice: this.state.selectOptionPrice,
        type: "all",
        isCostUnitPrice
      })

      if (saveProduct.status) {
        if (this.props.productList && this.props.productList.length) {
          let foundProduct = _.cloneDeep(this.props.productList);

          if (foundProduct.length) {
            for(let item of foundProduct) {
              let { value } = this.calculatorPrice(item);
              let field = isCostUnitPrice ? "costUnitPrice" : "saleUnitPrice";
              item.productprice[field] = value;
              item["product_" + field] = value;
              item[field] = value;
            }

            Store.dispatch(Actions.changeProductList(ManualSortFilter.sortArrayObject(foundProduct, "name", "asc")));
            this.props.onChange();
          }
        }
        else this.props.getData()
        this.success();
      } else this.error();
    }
    catch (err) {
      this.error()
    }
  }

  async saveGroupProduct() {
    let { isCostUnitPrice } = this.props;

    try {
      let saveProduct = await ProductService.updateProductPrice({
        value: this.state.value === "" ? 0 : this.state.increase ? this.state.value : -this.state.value,
        isCalculatePercent: this.state.calPer,
        selectOptionPrice: this.state.selectOptionPrice,
        id: this.props.data.productTypeId.id,
        type: "group",
        isCostUnitPrice 
      })

      if (saveProduct.status) {
        if (this.props.productList && this.props.productList.length) {
          let foundProduct = this.props.productList.filter(item => item.productTypeId.id === this.props.data.productTypeId.id);

          if (foundProduct.length) {
            for(let item of foundProduct) {
              let { value } = this.calculatorPrice(item);
              let field = isCostUnitPrice ? "costUnitPrice" : "saleUnitPrice";
              item.productprice[field] = value;
              item["product_" + field] = value;
              item[field] = value;
            }

            let products = foundProduct.concat(this.props.productList);

            products = _.uniqBy(products, "id");
            Store.dispatch(Actions.changeProductList(ManualSortFilter.sortArrayObject(products, "name", "asc")));
            this.props.onChange();
          }
        }
        else this.props.getData()
        this.success();
      } else this.error();
    }
    catch (err) {
      this.error();
    }

  }

  submit = async (e) => {
    e.preventDefault();
    
    let { newPrice, selectPrice, checkedBoxProduct } = this.state;
    let { data, isCostUnitPrice, isCheckInput } = this.props;
    
    if ( !isCheckInput ) {
      this.setState({ isSubmit: true }, async () => {
        if (checkedBoxProduct) {
          switch (selectPrice) {
            case 0: {
              this.saveAllProduct();
              break;
            }
            case 1: {
              this.saveGroupProduct();
              break;
            }
            default: break;
          }
        }
        else {
          try {
            let saveProduct = await ProductService.updateProductPrice({
              value: newPrice,
              id: data.id,
              isCalculatePercent: this.state.calPer,
              selectOptionPrice: this.state.selectOptionPrice,
              type: "one",
              isCostUnitPrice
            })
    
            if (saveProduct.status) {
              if (this.props.productList && this.props.productList.length) {
                let foundIndex = this.props.productList.findIndex(item => item.id === data.id);
  
                if (foundIndex > -1) {
                  let data = _.cloneDeep(this.props.productList);
                  let product = this.props.productList[foundIndex];
                  let field = isCostUnitPrice ? "costUnitPrice" : "saleUnitPrice";
                  product.productprice[field] = newPrice;
                  product["product_" + field] = newPrice;
                  product[field] = newPrice;
                  data[foundIndex] = product;
                  Store.dispatch(Actions.changeProductList(data));
                  this.props.onChange();
                }
              }
              else this.props.getData()
              this.success();
            } else this.error();
          }
          catch (err) {
            this.error();
          }
        }
      }) 
    }
  }

  render() {
    let { calPer, increase, isSubmit } = this.state;
    let { isCostUnitPrice, t } = this.props;

    return (
      <>
        <Card style={{ width: window.innerWidth > 900 ? 800 : 700, border: "1px solid #1890ff", marginTop: 0 }}>
          <CardBody>
            <Grid container >
              <Grid item xs={12} sm={12} md={12} lg={12} >
                <Grid container>
                  <Grid item xs={12} sm={8} md={8} lg={8}>
                    <Grid container>

                      <Grid item xs={12} sm={4} md={4} lg={5} style={{ marginTop: 5 }}>
                        {t("Giá {{type}} mới", {type: isCostUnitPrice ? t("vốn") : t("bán")})}[<span style={{ color: "#1890ff" }}>{ExtendFunction.FormatNumber(this.state.newPrice)}</span>]=
                      </Grid>

                      <Grid item xs={12} sm={8} md={8} lg={7}>
                        <Grid container spacing={1}>
                          <Grid item xs={6} sm={6} md={6} lg={7}>
                            <Select value={this.state.selectOptionPrice} onChange={(value) => this.onChangeSelectOptionPrice(value)}>
                              <Select.Option value={0} >{t("Giá {{type}}", {type: t("hiện tại")})}</Select.Option>
                              <Select.Option value={1} >{t("Giá {{type}}", {type: t("vốn")})}</Select.Option>
                              <Select.Option value={2} >{t("Giá {{type}}", {type: t("nhập lần cuối")})}</Select.Option>
                              <Select.Option value={3} >{t("Giá {{type}}", {type: t("bán")})}</Select.Option>
                            </Select>
                          </Grid>
                          <Grid item xs={6} sm={6} md={6} lg={5} style={{ paddingTop: 0 }}>
                            <Grid >
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <ButtonGroup style={{marginTop:4}}>
                                <OhButton
                                  id="increase"
                                  type={ increase ? "add" :"exit"}
                                  onClick={(e) => this.onClickModalPrice(e, "increase")}
                                >+
                                </OhButton>
                                <OhButton
                                  id="reduce"
                                  type={ !increase ? "add" :"exit"}
                                  onClick={(e) => this.onClickModalPrice(e, "reduce")}
                                  >-
                                  </OhButton>
                                </ButtonGroup>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                    </Grid>

                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Grid container style={{ paddingTop: 0 }} spacing={1}>
                      <Grid item xs={6} sm={6} md={6} lg={6} >
                        <Input
                          autoFocus
                          onFocus= {(event) => event.target.select()}
                          value={ExtendFunction.FormatNumber(this.state.value)}
                          style={{ textAlign: "right" }}
                          onChange={(e) => this.onClickModalPrice(e, "value")}
                          onClick={(e) => e.target.select()}
                        />
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} style={{ paddingTop: 0 }}>
                        <Grid >
                          <Grid item xs={6} sm={6} md={6} lg={12}>
                            <ButtonGroup style={{marginTop:4}}>
                              <OhButton
                                id="vnd"
                                type={ !calPer ? "add" :"exit"}
                                onClick={(e) => this.onClickModalPrice(e, "vnd")}
                                
                              >
                                vnd
                              </OhButton>
                              <OhButton
                                id="%"
                                type={ calPer ? "add" :"exit"}
                                onClick={(e) => this.onClickModalPrice(e, "%")}
                                
                              >
                                %
                              </OhButton>
                            </ButtonGroup>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} sm={4} md={4} lg={4} style={{ marginTop: 10 }}>
                <Checkbox checked={this.state.checkedBoxProduct} onClick={() => this.setState({ checkedBoxProduct: !this.state.checkedBoxProduct })}>{t("Áp dụng công thức cho")}</Checkbox>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} style={{ marginTop: 5 }}>
                <Select value={this.state.selectPrice} onChange={(value) => this.setState({ selectPrice: value })} disabled={!this.state.checkedBoxProduct}>
                  <Select.Option value={0} >{t("Tất cả sản phẩm")}</Select.Option>
                  <Select.Option value={1} >{t("Cùng nhóm sản phẩm")}</Select.Option>
                </Select>
              </Grid>
            </Grid>
          </CardBody>
          <Grid container >
            <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: "right", marginRight: window.innerWidth > 900 ? 5 : null }}>
            <OhButton
                id="vnd"
                type="add"
                disabled ={ isSubmit }
                onClick={(e) => this.submit(e)}
                icon={<MdDone/>}
              >
               {t("Đồng ý")}
              </OhButton>
              <OhButton
                id="%"
                type= "exit"
                onClick={this.props.onCancel}
                icon={<MdCancel/>}
              
              >
              {t("Thoát")}
              </OhButton>
            </GridItem>
          </Grid>
        </Card>
      </>
    );
  }
}

export default connect(state => {
  return {
    productList: state.productListReducer.products
  };
})(withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle
  }))(AddOriginalPrice)
));
