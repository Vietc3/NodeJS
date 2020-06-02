import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import 'date-fns';
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import OhModal from "components/Oh/OhModal";
import OhSelect from "components/Oh/OhSelect";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem";
import productService from 'services/ProductService';
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import { MdCancel, MdCached} from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';
import OhNumberInput from "components/Oh/OhNumberInput";
import ExtendFunction,{ trans } from "lib/ExtendFunction";

const propTypes =
{
  visible: PropTypes.bool,
  title: PropTypes.string,
  onChangeVisible: PropTypes.func,
};

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.defaultFormData = {
      firstProductId: null,
      firstProductQuantity: 0,
      secondProductId: null,
      secondProductQuantity: 0,
      firstProductUnit: null,
      secondProductUnit: null,
      stockId: null
    }
    let options = [];
    if (this.props.productList && this.props.productList.length) {
      options = this.props.productList.map(item => ({
        title: item.name,
        value: item.id,
        unitName: item.unitId_name,
        productTypeId: item.productTypeId_id
      }))
    }
    this.state = {
      formData: this.defaultFormData,
      options
    };
  }

  componentDidMount = () => {
    if(this.props.productList && !this.props.productList)
      this.getProductList();
    
    if ( this.props.changedRecord ) {
      this.setState({
        formData: {
          ...this.state.formData,
          firstProductId: this.props.changedRecord.id,
          firstProductUnit: this.props.changedRecord.unitName ? this.props.changedRecord.unitName : this.props.changedRecord.unitId && this.props.changedRecord.unitId.name ? this.props.changedRecord.unitId.name : ''
        }
      })
    }
  }

  getProductList = async () => {
    let getProductList = await productService.getProductList({
      select: ['id', 'name', 'unitId.name', 'productTypeId.id'],
      filter: {"deletedAt": 0}
    });

    if (getProductList.status) {
      if (getProductList.data.length > 0) {
        let options = [];
        getProductList.data.map(item => {
          let option = {
            title: item.name,
            value: item.id,
            unitName: item.unitId_name,
            productTypeId: item.productTypeId_id
          }
          options.push(option)
          return options;
        })
        this.setState({
          options: options
        })
      }
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.changedRecord !== this.props.changedRecord) {
      this.setState({
        formData: {
          ...this.state.formData,
          firstProductId: this.props.changedRecord.id,
          firstProductUnit: this.props.changedRecord.unitName ? this.props.changedRecord.unitName : this.props.changedRecord.unitId.name
        }
      })
    }
  }

  handleOk = async () => {
    const { formData } = this.state;
    const { t, stockList } = this.props;
    let stocks = Object.keys(stockList);
    let dataChangeStock = formData;

    if (stocks.length <= 1) {
      dataChangeStock = {
        ...dataChangeStock,
        stockId: stocks[0]
      }
    }
    if (!dataChangeStock.stockId )
      notifyError(t("Chọn kho chuyển đổi"))
    else if (!dataChangeStock.secondProductId)
      notifyError(t("Chọn sản phẩm chuyển đổi"))
    else if (!dataChangeStock.firstProductQuantity)
      notifyError(t("Nhập số lượng được chuyển đổi"))
    else if (!dataChangeStock.secondProductQuantity)
      notifyError(t("Nhập số lượng chuyển đổi"))
    else {
      let convert = await productService.convertStockQuantity(dataChangeStock)
      if (convert.status) {
        notifySuccess(t("Chuyển đổi số lượng tồn kho thành công"))
        this.handleClose(true, dataChangeStock.firstProductId, dataChangeStock.secondProductId )
      }
      else {
        notifyError(t(convert.message))
      }
    }
  }

  handleClose = (isGetData, productId_first, productId_second) => { 
    const { options } = this.state;
    let data = [];
    let optionsFirst = [...options]
    let optionsSecond = [...options];

    if (productId_first) {
      let index_first = optionsFirst.findIndex(item => item.value === productId_first)
      let datafirst = optionsFirst.splice(index_first, 1);
        data.push(datafirst[0])
    }
    if (productId_second) {
      let index_second = optionsSecond.findIndex(item => item.value === productId_second)
        let dataSecond = optionsSecond.splice(index_second, 1)
        data.push(dataSecond[0])
    }    

    this.setState({
      formData: this.defaultFormData
    }, () => this.props.onChangeVisible(false, isGetData, data))
  }

  render() {
    const { t, stockList } = this.props;
    const { options, formData } = this.state;
    let listStock = ExtendFunction.getSelectStockList(stockList, [], false);

    let optionFirst = [...options]
    let optionsSecond = [...options];

    if ( formData.firstProductId ) {
      let index = optionsSecond.findIndex(item => item.value === formData.firstProductId)

      optionsSecond.splice(index, 1)
    }

    if ( formData.secondProductId ) {
      let index = optionFirst.findIndex(item => item.value === formData.secondProductId)

      optionFirst.splice(index, 1)
    }
    
    return (

      <OhModal
        title={t("Chuyển đổi số lượng tồn kho")}
        width={700}
        onOpen={this.props.visibleChangeStock}
        onClose={this.handleClose}
        footer={[
          <OhToolbar
            right={[
              {
                type: "button",
                label: t("Chuyển đổi"),
                onClick: () => this.handleOk(),
                icon: <MdCached />,
                simple: true,
                typeButton: "add"
              },
              {
                type: "button",
                label: t("Thoát"),
                icon: <MdCancel />,
                onClick: () => this.handleClose(false),
                simple: true,
                typeButton: "exit"
              },
            ]}
          />
        ]}
        content={
          <GridContainer justify='center' className='GridContentPopover'>
            <GridItem xs={12}>
            {listStock.length > 1 ?
             <GridContainer>
                <GridItem xs={7}>
                <GridContainer xs={12}>
                    <GridItem xs={4}>
                      <FormLabel className="LabelPopover">
                        <b className='ContentForm'>{t("Kho")}</b>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={8}>
                      <OhSelect
                        onChange={(value, record) => {                          
                          this.setState({
                            formData: {
                              ...formData,
                              stockId: value,
                            }
                          })
                        }}
                        value={formData.stockId || null}
                        options={listStock}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer> : null }
              <GridContainer>
                <GridItem xs={7}>
                  <GridContainer xs={12}>
                    <GridItem xs={4}>
                      <FormLabel className="LabelPopover">
                        <b className='ContentForm'>{t("Sản phẩm")}</b>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={8}>
                      <OhSelect
                        onChange={(value, record) => {
                          this.setState({
                            formData: {
                              ...formData,
                              firstProductId: value,
                              firstProductUnit: record.unitName
                            }
                          })
                        }}
                        formater={value => trans(value)}
                        defaultValue={optionFirst.length > 0 ? formData.firstProductId : ''}
                        options={optionFirst}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={5}>
                  <GridContainer xs={12}>
                    <GridItem xs={4}>
                      <FormLabel className="LabelPopover">
                        <b className='ContentForm'>{t("Số lượng")}</b>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={6}>
                      <OhNumberInput
                        style={{ marginTop: 5, height: 29, textAlign: 'right' }}
                        defaultValue={formData.firstProductQuantity || 0}
                        isDecimal={false}
                        isNegative={false}
                        onChange={(e) => {
                          this.setState({
                            formData: {
                              ...formData,
                              firstProductQuantity: e,
                            }
                          })
                        }}
                      />
                    </GridItem>
                    <GridItem xs={2}>
                      <FormLabel className="LabelPopover">
                        <b className='ContentForm'>{t(formData.firstProductUnit)}</b>
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>

              <b className='ContentFormPaddingLeft'>{t("thành")}</b>

              <GridContainer>
                <GridItem xs={7}>
                  <GridContainer xs={12}>
                    <GridItem xs={4}>
                      <FormLabel className="LabelPopover">
                        <b className='ContentForm'>{t("Sản phẩm")}</b>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={8}>
                      <OhSelect
                        onChange={(value, record) => {
                          this.setState({
                            formData: {
                              ...formData,
                              secondProductId: value,
                              secondProductUnit: record.unitName
                            }
                          })
                        }}
                        value={formData.secondProductId || null}
                        formater={value => trans(value)}
                        options={optionsSecond}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={5}>
                  <GridContainer xs={12}>
                    <GridItem xs={4}>
                      <FormLabel className="LabelPopover">
                        <b className='ContentForm'>{t("Số lượng")}</b>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={6}>
                      <OhNumberInput
                        style={{ marginTop: 5, height: 29, textAlign: 'right' }}
                        defaultValue={formData.secondProductQuantity || 0}
                        isDecimal={false}
                        isNegative={false}
                        onChange={(e) => {
                          this.setState({
                            formData: {
                              ...formData,
                              secondProductQuantity: e
                            }
                          })
                        }}
                      />
                    </GridItem>
                    <GridItem xs={2}>
                      <FormLabel className="LabelPopover">
                        <b className='ContentForm'>{t(formData.secondProductUnit)}</b>
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>

            </GridItem>
          </GridContainer>
        }
      />
    );
  }
}

Modal.propTypes = propTypes;

  export default (
    connect(function (state) {
      return {
        stockList: state.stockListReducer.stockList,
        productList: state.productListReducer.products
      };
    })
  ) (
    withTranslation("translations")(
      withStyles(theme => ({
        ...regularFormsStyle
      }))(Modal)
    )
  );