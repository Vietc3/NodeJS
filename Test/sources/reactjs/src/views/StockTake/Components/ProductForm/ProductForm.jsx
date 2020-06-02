import React, { Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Close from "@material-ui/icons/Close";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import { connect } from "react-redux";
import {
  Select as SelectAnt,
  Icon,
  Input as InputAnt,
  Button as ButtonAnt,
  AutoComplete,
  Modal
} from "antd";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { trans } from "lib/ExtendFunction";
// multilingual
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import Constants from "variables/Constants/";
import ProductGroup from "views/StockTake/Components/ProductGroup/ProductGroup";
import Input from "views/StockTake/Components/Input/";
import productService from "services/ProductService";
import _ from "lodash";
import { MdCancel ,MdAddCircle} from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';
import OhTable from 'components/Oh/OhTable';
import OhAutoComplete from "components/Oh/OhAutoComplete";
import ModalReason from './ModalReason';
const { Option } = SelectAnt;

class FormIssue extends React.Component {
  constructor(props) {
    super(props);
    let { defaultProductList } = this.props;
    this.state = {
      productList: defaultProductList ? Object.keys(defaultProductList) : [],
      productDataList: defaultProductList || {},
      searchedProductList: [],
      openModalReason: {},
      reason: {},
    };
    this.defaultProduct = {
      notes: ""
    };
    this.props.onRef(this);
    this.inputRefs = {};
  }

  componentWillUnmount = () => {
    if (this.getStore) this.getStore.off();
    if (this.getProductUnit) this.getProductUnit.off();
    if (this.getStockTakeReason) this.getStockTakeReason.off();
  };

  componentDidUpdate(prevProps, prevState) {
    const {defaultProductList, stockList} = this.props;
    let reasons = {};
    if ( prevProps.defaultProductList !== defaultProductList ) {
      let check_Stock =  this.props.stockId && stockList[this.props.stockId] && stockList[this.props.stockId].deletedAt === 0;

      Object.values(defaultProductList).map((item) => {
        if(isNaN(item.reason))
          reasons[item.productId] = {
            name: item.reason
          }

        return item;
      })
      
      this.setState({
        productList: Object.keys(defaultProductList),
        productDataList: defaultProductList,
        reason: reasons
      })
    }

    if(prevProps.stockId !== this.props.stockId && prevProps.stockId !== undefined){
      this.changeStockProductList(this.props.stockId);
    }
  }

  changeStockProductList = (stockId) => {
    let { stockList } = this.props;

    let {productDataList} = this.state;
    for(let productId in productDataList){
      let newStockQuantity = productDataList[productId].product[stockList[stockId].stockColumnName] || 0;
      let newDifferenceQuantity = productDataList[productId].realQuantity - newStockQuantity;
      productDataList[productId].stockQuantity = newStockQuantity;
      productDataList[productId].differenceQuantity = newDifferenceQuantity;
      productDataList[productId].differenceAmount = newDifferenceQuantity * productDataList[productId].product.costUnitPrice;
    }

    this.setState({
      productDataList
    })
  }

  getColumns = () => {
    let { t, editEnable } = this.props;

    let columns = [
     {
        title: t(" "),
        dataIndex: "",
        key: "x",
        align: "center",
        width: "4%",
        render: (value, record) => {
          let { classes } = this.props;
          return (
            <div>
              {editEnable === true ?
               <Button
              color="danger"
              simple
              round={true}
              style={{ padding: 0, margin: 0 }}
              className={classes.actionButton}
              onClick={() => (editEnable ? this.removeProduct(record) : null)}
              disabled={!editEnable}
            >
              <Close className={classes.icon} />
            </Button>
             :null}
            </div>
          );
        },
      },
      {
        title: t("Mã sản phẩm"),
        dataIndex: "productCode",
        key: "ProductCode",
        width: "12%",
        align: "left",
      },
      {
        title: t("Tên sản phẩm"),
        dataIndex: "productName",
        key: "ProductName",
        width: "29%",
        align: "left",
        render: value => trans(value)
      },
      {
        title: t("ĐVT"),
        dataIndex: "productUnit",
        key: "ProductUnit",
        width: "11%",
        align: "left",
        render: (value, record) => (record.product && record.product.unitId ? record.product.unitId.name : "")
      },
      {
        title: t("Tồn kho"),
        dataIndex: "stockQuantity",
        key: "StoreQty",
        className: "qty-column",
        align: "right",
        width: "11%",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(value);
        }
      },
      {
        title: t("Thực tế"),
        dataIndex: "realQuantity",
        key: "realQuantity",
        className: "realqty-column",
        align: "right",
        width: "11%",
        render: (value, record) => {
          return   (
            editEnable ? 
              <Input
              disabled = {editEnable ? false : true}
                onRef={ref => (this.inputRefs[record.productId] = ref)}
                defaultValue={value ? value : this.state.productDataList[record.productId] ? this.state.productDataList[record.productId].stockQuantity : 0}
                onChange={value => {
                  let { productDataList } = this.state;
                  let differenceQuantity =
                    value !== undefined ? value - productDataList[record.productId].stockQuantity : value;
                  
                  const newProductDataList = {
                    ...this.state.productDataList,
                    [record.productId]: {
                      ...this.state.productDataList[record.productId],
                      realQuantity: value,
                      realAmount: value !== undefined ? value * parseFloat(record.product.costUnitPrice) : undefined,
                      differenceQuantity: differenceQuantity,
                      differenceAmount:
                        differenceQuantity !== undefined
                          ? parseFloat(record.product.costUnitPrice) * differenceQuantity
                          : undefined
                    }
                  };
                  this.setState(
                    {
                      productDataList: newProductDataList
                    },
                    () => this.props.onChange(
                        _.sumBy(Object.values(this.state.productDataList), function(o) {
                          return o.realQuantity || 0;
                        })
                      )
                  );
                }}
              />
              : ExtendFunction.FormatNumber(value)
          );
        }
      },
      {
        title: t("SL lệch"),
        dataIndex: "differenceQuantity",
        key: "differenceQuantity",
        className: "qty-column",
        align: "right",
        width: "11%",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(value);
        }
      },
      {
        title: t("Lý do"),
        dataIndex: "name",
        key: "name",
        width: "12%",
        align: "left",
        render: (value, record) => {
          return this.getReasonSelect(record);
        }
      }
    ];

    if(!editEnable){
      columns.splice(0, 1);
    }

    return columns;

  };

  getReasonSelect = record => {
    let { t, classes, stockList } = this.props;
    const {reason} = this.state;
    let check_Stock =  this.props.stockId && stockList[this.props.stockId] && stockList[this.props.stockId].deletedAt === 0;

    return (
      <Select
        MenuProps={{
          className: classes.selectMenu
        }}
        classes={{
          select: classes.select
        }}
        value={record.reason}
        disabled ={!check_Stock}
        onChange={e => {
          if(typeof e.target.value === 'number'){
            this.setState({
              productDataList: {
                ...this.state.productDataList,
                [record.productId]: {
                  ...this.state.productDataList[record.productId],
                  reason: e.target.value
                }
              }
            });
          }
          else {
            this.setState({
              openModalReason: {
                ...this.state.openModalReason,
                [record.productId]: true
              }
            })
          }
        }}
        inputProps={{
          name: "simpleSelect",
          id: "simple-select"
        }}
      >
        {Constants.STOCKCHECK_REASONS.map(item => {
          return (
            <MenuItem
              key={item.id}
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected
              }}
              value={item.id}
            >
              {t(item.name)}
            </MenuItem>
          );
        })}
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          value={isNaN(record.reason) && record.reason ? record.reason : (reason[record.productId] ? reason[record.productId].name : null)}
        >
          {isNaN(record.reason) && record.reason ? record.reason : (reason[record.productId] ? reason[record.productId].name : t("Nhập lý do"))}
        </MenuItem>
      </Select>
    );
  };

  onSearchProduct = async value => {
    let getProductList = await productService.getProductList({
      filter: { or: [{ name: { contains: value } }, { code: { contains: value } }] },
      limit: value === "" ? 0 : Constants.LIMIT_AUTOCOMPLETE_SEARCH
    });
    if (getProductList.status) {
      this.setState({ searchedProductList: getProductList.data });
    }
  };

  renderOption = item => {
    return (
      <Option key={item.id} text={trans(item.name)}>
        <div className="global-search-item">
          <span className="global-search-item-desc">{trans(item.name)}</span>
          <span className="global-search-item-count">{item.code}</span>
        </div>
      </Option>
    );
  };

  handleCancel = () => {
    this.setState({
      visibleProductGroup: false
    });
  };

  addProductGroup = async checkedGroup => {
    let { stockList } = this.props;

    delete checkedGroup.all;
    let getProductList = await productService.getProductList({
      filter: { productTypeId: { in: Object.keys(checkedGroup) } }
    });

    let newProductDataList = _.cloneDeep(this.state.productDataList);
    let newProductList = this.state.productList.slice();

    getProductList.data.map(item => {
      if (!newProductDataList[item.id]) {
        newProductList.push(item.id);
        newProductDataList[item.id] = {
          productId: item.id,
          productName: item.name,
          productCode: item.code,
          stockQuantity: stockList[this.props.stockId] ? item[stockList[this.props.stockId].stockColumnName] : 0,
          product: item,
          realQuantity: stockList[this.props.stockId] ? item[stockList[this.props.stockId].stockColumnName] : 0,
          differenceQuantity: 0,
          ...this.defaultProduct
        };
      }
      return null;
    });

    this.setState({
      productList: newProductList,
      productDataList: newProductDataList
    });

  };

  addProduct = id => {
    let { stockList } = this.props;
    id = Number(id);
    let { productDataList, productList, searchedProductList } = this.state;
    let newProductDataList = _.cloneDeep(productDataList);
    let newProductList = productList.slice();

    let selectedProduct = searchedProductList.find(item => item.id === id);
    if (!newProductDataList[id]) {
      newProductList.push(id);
      newProductDataList[id] = {
        productId: id,
        productName: selectedProduct.name,
        productCode: selectedProduct.code,
        stockQuantity: stockList[this.props.stockId] ? selectedProduct[stockList[this.props.stockId].stockColumnName] : 0,
        product: selectedProduct,
        realQuantity: stockList[this.props.stockId] ? selectedProduct[stockList[this.props.stockId].stockColumnName] : 0,
        ...this.defaultProduct
      };
    } else {
      let value = newProductDataList[id].realQuantity === undefined ? 1 : newProductDataList[id].realQuantity + 1;
      let differenceQuantity = value !== undefined ? value - newProductDataList[id].stockQuantity : value;

      newProductDataList[id] = {
        ...newProductDataList[id],
        realQuantity: value,
        realAmount: value !== undefined ? value * parseFloat(newProductDataList[id].product.costUnitPrice) : undefined,
        differenceQuantity: differenceQuantity,
        differenceAmount:
          differenceQuantity !== undefined
            ? parseFloat(newProductDataList[id].product.costUnitPrice) * differenceQuantity
            : undefined
      };
    }

    this.setState({
      productList: newProductList,
      productDataList: newProductDataList,
    });
    if (this.inputRefs[id]) this.inputRefs[id].updateValue(newProductDataList[id].realQuantity);
  };

  removeProduct = record => {
    let { productDataList, productList } = this.state;
    let newProductDataList = JSON.parse(JSON.stringify(productDataList));
    let newProductList = productList.slice();

    var index = newProductList.findIndex(item => Number(item) === record.productId);
    if (index > -1) {
      newProductList.splice(index, 1);
    }

    delete newProductDataList[record.productId];
    this.setState({
      productList: newProductList,
      productDataList: newProductDataList
    });
  };

  getDataSource = () => {
    const { productList, productDataList } = this.state;
    return productList.map(item => {
      return {
        ...productDataList[item],
        key: item
      };
    });
  };

  render() {
    const { t, editEnable } = this.props;
    const { visibleProductGroup, searchedProductList, openModalReason } = this.state;
    let dataSource = this.getDataSource();
    dataSource.map((item, index) => (item.index = index + 1));
    return (
      <Fragment>
        { dataSource.map((item) => {
          return(
            <ModalReason 
              key = {"key_reason_"+ item.productId}
              visible={this.state.openModalReason[item.productId]}
              value={this.state.reason[item.productId] ? this.state.reason[item.productId].name : (isNaN(item.reason) ? item.reason : null)}
              onChangeVisible={(visible, reason) => {
                this.setState({
                  openModalReason: {
                    ...openModalReason,
                    [item.productId] : visible
                  }
                })

                if (reason) {
                  this.setState({
                    productDataList: {
                      ...this.state.productDataList,
                      [item.productId]: {
                        ...this.state.productDataList[item.productId],
                        reason: reason
                      }
                    },
                    reason: {
                      ...this.state.reason,
                      [item.productId]: {
                        name: reason
                      }
                    }
                  });
                }
              }}
            />
          )
        })
        }
        <GridContainer>
          <GridItem xs={12} style={{ position: "relative" }}>
            {editEnable ? (
              <>
                <OhAutoComplete
                  dataSelects={searchedProductList}
                  onSearchData={value => this.onSearchProduct(value)}
                  placeholder={t(Constants.PLACEHOLDER_SEARCH_PRODUCT)}
                  onClickValue={id => this.addProduct(id)}
                  isButton
                  onClick={() => this.setState({visibleProductGroup: true})} 
                />             
              </>
            ) : null}
          </GridItem>
        </GridContainer>
        <OhTable 
        id= "stock-take-products"  
        columns={this.getColumns()}
        dataSource={dataSource}
        pagination = {false}
        emptyDescription={Constants.NO_PRODUCT}
        />
        <Modal
          className={"CustomModal1"}
          title={t(Constants.TITLE_CHOOSE_PRODUCT_GROUP)}
          visible={visibleProductGroup}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[

            <OhToolbar
              key="product-form-toolbar"
              right={[
                {
                  type: "button",
                  label: t("Tạo"),
                  onClick:() => {
                    this.addProductGroup(this.productGroupRef.state.checkedGroup);
                    this.handleCancel();
                  },
                  icon:<MdAddCircle/>,
                  simple: true,
                  typeButton:"add",
                  permission:{
                    name: Constants.PERMISSION_NAME.STOCK_CHECK,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  }
                },
                {
                  type: "button",
                  label: t("Thoát"),
                  icon: <MdCancel />,
                  onClick: () => this.handleCancel(),
                  simple: true,
                  typeButton:"exit"
                },
              ]}
            />
          ]}
          width={window.screen.width > 1000 ? "calc(100vw - 200px)" : 1000}
        >
          {visibleProductGroup ? <ProductGroup onRef={ref => (this.productGroupRef = ref)} /> : null}
        </Modal>
      </Fragment>
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
      ...extendedFormsStyle,
      ...extendedTablesStyle
    }))(FormIssue)
  )
);
