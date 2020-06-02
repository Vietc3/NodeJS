import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withTranslation, } from 'react-i18next';
import withStyles from "@material-ui/core/styles/withStyles"
import CardBody from "components/Card/CardBody.jsx";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import Constants from 'variables/Constants/';
import { Tabs, Popover, Tooltip } from 'antd';
import OhTable from "components/Oh/OhTable";
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import AlertQuestion from 'components/Alert/AlertQuestion';
import ExtendFunction, { trans } from "lib/ExtendFunction";
import OhAutoComplete from "components/Oh/OhAutoComplete";
import productService from 'services/ProductService';
import DiscountPriceForm from './DiscountPriceForm';
import TextField from '@material-ui/core/TextField';
import OhSelectMaterial from 'components/Oh/OhSelectMaterial.jsx';
import _ from "lodash";
import { element } from "prop-types";

const { TabPane } = Tabs;
class TableSales extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.onRef) this.props.onRef(this);
    this.dataSales = localStorage.getItem("sales-counter") || "";
    this.isJson = JSON.isJson(this.dataSales);
    this.dataCustomers = this.isJson ? JSON.parse(this.dataSales) : {};
    if (Object.keys(this.dataCustomers).length > 0) {
      let key = 1;

      this.dataCustomers.panes.forEach(item => {
        item.title = `Hóa đơn ${key}`
        item.key = key.toString();
        key += 1;
      })
      this.dataCustomers.TabIndex = this.dataCustomers.panes.length + 1;
    }
    this.newTabIndex = this.dataCustomers.TabIndex || 2;
    const panes = [
      {
        title: 'Hóa đơn 1',
        content: [],
        key: '1',
      },
    ];
    this.state = {
      numberLength: 1,
      ProductsForm: {},
      products: [],
      dataProducts: [],
      activeKey: this.dataCustomers.panes ? this.dataCustomers.panes[0].key : panes[0].key,
      panes: this.dataCustomers.panes || panes,
      alert: null,
      isVisible: false,

    };
    this.count = 1;

  }

  componentDidMount = async() => {
    let onRef = this.autoRef.ref;
    this.setData();

    document.addEventListener("keydown", (event) => {
      if (event.code === 'F3') {
        event.preventDefault();
        onRef.focus();
        onRef.props.onSelect();
      }
    }, false); 
  }

  setData = async() =>{
    let { panes } = this.state;
    let { stockList } = this.props;
    let stock_List = Object.keys(stockList);

    let objKeys = {};

    _.forEach(panes, item =>{
      let dataSource = item.content || [];

      if (dataSource.length){
        _.forEach(dataSource, ele =>{
          if (objKeys[ele.productId] !== ele.productId){
            objKeys[ele.productId] = ele.productId;

          }
        })
      }

    })

    let getProductList = await productService.getProductList({
      filter: { id:{ in: Object.values(objKeys) }, stoppedAt: 0, deletedAt: 0 }
    });

    if (getProductList.status) {
      let dataProduct = {};
      _.forEach(getProductList.data, item=>{
        dataProduct[item.id] = {...item}
        
      })
      let arrRemoveProduct = [];
      _.forEach(panes, ele =>{
        let dataSource = ele.content || [];        
  
        if (dataSource.length){
          
          _.forEach(dataSource, element =>{
            if ( element!== undefined) {

              let discount = element.discount ? Number(element.discount) : 0;
              let sellPrice = element.sellPrice ? Number(element.sellPrice) : 0;
              let item = dataProduct[element.productId];
              element.total = item.saleUnitPrice            
              element.discount = sellPrice === 0 ? 0 : element.unitPrice ? (((discount/ element.unitPrice) )* item.saleUnitPrice) : discount
              element.sellPrice = sellPrice === 0 ? 0 : element.unitPrice ? discount < sellPrice ? (item.saleUnitPrice -((discount / element.unitPrice) )* item.saleUnitPrice)  : item.saleUnitPrice +(((Math.abs(discount) /element.unitPrice) )* item.saleUnitPrice) : sellPrice
              element.maxDiscount= item.maxDiscount
              element.costUnitPrice = item.costUnitPrice
              element.finalAmount = sellPrice * Number(element.quantity)
              let checkStock =  stockList[element.stockId].deletedAt !== 0;

              if (checkStock) {
                arrRemoveProduct.push({...element, keyPane: ele.key})
              } else {
                element.stockQuantity = stockList[element.stockId] && item[stockList[element.stockId].stockColumnName] ? item[stockList[element.stockId].stockColumnName] : 0;
              }

              stock_List.map(stock => {
                let check_stock =  stockList[stock] && stockList[stock].deletedAt === 0;

                if (check_stock){
                  element[stock] = stockList[stock] && item[stockList[stock].stockColumnName] ? item[stockList[stock].stockColumnName] : 0;
                } else {
                  delete  element[stock];
                }
              }) 

              element.productId = element.productId;
              element.key = this.count;
              element.index = this.count;
              this.count += 1;
                  
            }
          })
        }
        
      })
      if (arrRemoveProduct.length) this.removeProducts(arrRemoveProduct)
      this.setState({
        panes
      },()=>this.getTotalAmount(this.state.activeKey))
    }

  }

  onChangeTab = activeKey => {
    this.setState({ activeKey }, () => {
      this.setData();     
    });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  getTotalAmount = (key) => {

    let total = 0;
    let { panes } = this.state;
    let indexPane = panes.findIndex(item => item.key === key);
    let dataProduct = panes[indexPane].content;

    dataProduct.map(item => total += item.finalAmount);
    if (total < 0) total = 0;
    this.setState({
      totalAmount: total,
    }, () => this.props.onChangProduct(dataProduct.length, this.state.totalAmount, key, panes, this.newTabIndex))
  }
  
  getTableSales = (key) => {
    let { panes } = this.state;
    let { t, readOnly, stockList } = this.props; 
    let listStock = ExtendFunction.getSelectStockList(stockList, []);


    let indexPane = panes.findIndex(item => item.key === key);

    let dataSource = [];

    if (indexPane !== -1) {
      dataSource = panes[indexPane].content
    }

    let numberWidth = document.getElementsByClassName("number-width");

    for( let i = 0; i < numberWidth.length; i++){
      numberWidth[i].style.width = this.state.numberLength < 10 ? (this.state.numberLength * 12 + 'px') : (100+'px')
      numberWidth[i].style.minWidth = (50+'px')
    }
        
    let columns = [
      {
        title: t("Mã"),
        dataIndex: "productCode",
        key: "productCode",
        width: "14%",
        align: "left",
      },
      {
        title: t("Tên"),
        dataIndex: "productName",
        key: "productName",
        align: "left",
        render: value => trans(value)
      },
      {
        title: t("Kho"),
        dataIndex: "store",
        key: "store",
        width: "14%",
        align: "left",
        render: (value, record, index) => {  
          if (record.type === Constants.PRODUCT_TYPES.id.merchandise){
            let data = panes[indexPane].content[index]; 
            if (data && data.stockDelete && data.stockDelete === true ) {
              return (<Tooltip 
                placement="leftTop" 
                title={ stockList[data.stockId].name || ""} 
                mouseEnterDelay={0.5}
                ><span className="ellipsis-not-span">{stockList[data.stockId].name}</span></Tooltip>) 
            } else {            
            return (
              <OhSelectMaterial 
                options = {listStock}
                onChange = {(value) => {
                  data.stockQuantity = record[value];
                  data.stockId = Number(value);
                  this.setState({
                    panes
                  },()=> this.getTotalAmount(key))
                }}
                value={data.stockId}
              />
            );
            }
          } 
        }
      },
      {
        title: t("Số lượng"),
        dataIndex: "quantity",
        key: "quantity",
        align: 'right',
        width: "12%",
        render: (value, record, index) => {
          let item = panes[indexPane].content[index];
          let sellPrice = Number(item.unitPrice - (item.discount ? item.discount : 0));
          let stockQuantity = record.stockQuantity;          
          
          if(value.toString().length > this.state.numberLength) this.setState({numberLength: value.toString().length})
          
          return (
            <Tooltip placement="left"
              title={(value > stockQuantity && record.type === Constants.PRODUCT_TYPES.id.merchandise) ? t("Số lượng tồn kho (hiện tại {{stockQuantity}}) không đủ để bán", { stockQuantity: stockQuantity }) : ""}
            >
              <TextField
                style={{ marginTop: record.discount ? -14 : null }}
                type="number"
                value={((value && value < 1) ? 0 : value) || 0}
                InputProps={{
                  readOnly: false,
                  inputProps: {
                    className: "number-width",
                    style: { textAlign: "right", cursor: "pointer", color: (value > stockQuantity &&  record.type === Constants.PRODUCT_TYPES.id.merchandise) ? "red" : "" }
                  },
                  onChange: e => {
                    let val = e.target.value;

                    if (isNaN(ExtendFunction.UndoFormatNumber(val)) === false) {
                      let value = parseInt(ExtendFunction.UndoFormatNumber(val));

                      item.quantity = value;
                      item.finalAmount = ((value * sellPrice < 0) ? 0 : (value * sellPrice))
                    }
                    if (val === "") {
                      item.quantity = '';
                      item.finalAmount = 0;
                    }
                    this.setState({
                      panes,
                    }
                      , () => this.getTotalAmount(key)
                    )
                  },
                  onKeyDown: async (e) => {
                    if (e.keyCode === 13 && (e.target.value === "" || e.target.value <= "0")) {
                      this.removePane(record);
                    }
                  },
                  onBlur: async (e) => {
                    if (e.target.value === "" || e.target.value <= "0") {
                      this.removePane(record);
                    }
                  },
                }}
              />
            </Tooltip>
          );
        },
      },
      {
        title: t("Giá bán"),
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: "13%",
        align: "right",
        render: (value, record, index) => {
          let product = panes[indexPane].content[index];
          let oldFinalAmount = product.quantity * product.unitPrice;
          
          return (
            <Popover
              trigger="click"
              placement="bottomRight"
              getPopupContainer={() => document.getElementById(`sales-counter-${key}`)}
              content={
                <DiscountPriceForm
                  onChange={(formData) => {
                    let item = panes[indexPane].content[index];
                    item.discount = formData.unitPrice - formData.sellPrice;
                    item.finalAmount = formData.sellPrice * item.quantity;
                    item.sellPrice = formData.sellPrice;
                    
                    this.setState({
                      panes
                    }
                      , () => this.getTotalAmount(key)
                    )
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
                  value={ExtendFunction.FormatNumber(Math.round(product.sellPrice || (product.unitPrice - product.discount))) || 0}
                  InputProps={{
                    readOnly: true,
                    inputProps: {
                      style: { textAlign: "right", cursor: "pointer" }
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
        width: "15%",
        align: 'right',
        render: value => {
          return ExtendFunction.FormatNumber(Math.round(value && value > 0 ? value : 0 || 0));
        },
      },
    ];

    if(listStock.length <= 1){
      columns.splice(2,1);
    }

    return (
      <div >
        <OhTable
          id={`sales-counter-${key}`}
          y={320}
          columns={columns}
          dataSource={dataSource}
          emptyDescription={Constants.NO_PRODUCT}
          isNonePagination={true}
          hasRemoveColumn={(value, record)=>{
            return !(
                ( readOnly )
              )
          }}
          onClickRemove={(value, record) => {
            this.removePane(record)
          }}
        />
      </div>
    )
  }

  removePane = record => {

    let { panes, activeKey } = this.state;
    let newPanes = panes.slice();

    let index = newPanes.findIndex(item => item.key === activeKey);

    if (index > -1) {
      let indexProduct = newPanes[index].content.findIndex(item => item.index === record.index)

      newPanes[index].content.splice(indexProduct, 1);

      this.setState({
        panes: newPanes
      }, () => this.getTotalAmount(activeKey))
    }

  };

  removeProducts = arr => {

    let { panes, activeKey } = this.state;
    let newPanes = panes.slice();

    _.map(arr, item => {
      let index = newPanes.findIndex(elem => elem.key === item.keyPane);

      if (index > -1) {
        let indexProduct = newPanes[index].content.findIndex(ele => ele.index === item.index);
        newPanes[index].content.splice(indexProduct, 1);
      }

      return;
    })    

    this.setState({
      panes: newPanes
    }, () => this.getTotalAmount(activeKey))
  };

  add = () => {
    let { panes } = this.state;
    let { t } = this.props;
    let activeKey = `${this.newTabIndex++}`;

    if (panes.length === 10) {
      notifyError(t("Chỉ tối đa 10 hóa đơn"));
      this.newTabIndex--;
      return;
    } else {
      panes.push({ title: 'Hóa đơn' + `${" " + activeKey}`, content: [], key: activeKey });
      this.setState({ panes, activeKey }, () => this.getTotalAmount(activeKey));
    }
  };

  hideAlert = () => {
    this.setState({ alert: null })
  }

  remove = (targetKey) => {
    let { t } = this.props;
    let { panes } = this.state;
    let flag = false;

    let index = panes.findIndex(item => item.key === targetKey);

    if (panes[index] && panes[index].content.length === 0) flag = true;

    if (flag) {
      this.deleteSumit(targetKey);

    } else {
      this.setState({
        alert: (
          <AlertQuestion
            messege={`Bạn chắc chắn muốn xóa hóa đơn`}
            name={`${targetKey}`}
            hideAlert={this.hideAlert}
            action={(e) => {
              this.hideAlert()
              this.deleteSumit(targetKey);
            }}
            buttonOk={t("Đồng ý")}
          />
        )
      })
    }
  }

  deleteSumit = (targetKey, keyDeleteInvoice ) => {
    let { activeKey } = this.state;
    let { t } = this.props;
    let lastIndex;

    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    const panes = this.state.panes.filter(pane => pane.key !== targetKey);

    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }

    this.setState({ panes, activeKey }, () => {
      if (this.state.panes.length === 0) {
        this.add();
      } else {
        this.getTotalAmount(activeKey);
      }

      this.props.deleteInvoice(targetKey)
      this.setData();
      notifySuccess( keyDeleteInvoice ? null : t("Xóa thành công hóa đơn {{targetKey}}", { targetKey: targetKey }))
    });
  };

  onKeyInput = async (event) => { 
    const { t } = this.props
    if (event.target.value && event.keyCode === 13) {
      if(this.state.dataProducts.length === 0) {
      let getProductList = await productService.getProductList({
        filter: { stoppedAt: 0, or: [{ code: event.target.value }, { barCode: event.target.value }] }      
      })

      if (getProductList.status) {
        this.setState({
          dataProducts: getProductList.data
        }, () => {
          if (getProductList.data.length === 1) { 
            this.autoRef.ref.props.onSelect(getProductList.data[0].id) 
          } 
          else if (getProductList.data.length > 1) {
            this.autoRef.ref.props.onSelect()
            this.chooseProduct(getProductList.data)
          }
          else {
            notifyError(t("Sản phẩm không tồn tại hoặc đã ngừng kinh doanh"));
            this.autoRef.ref.props.onSelect()
          }
        }) 
      }
       else notifyError(getProductList.error)
    }     
    }
  }


  onSearchProduct = async value => {
    let getProductList = await productService.getProductList({
      filter: { or: [{ name: { contains: value } }, { code: { contains: value } }], stoppedAt: 0, deletedAt: 0 },
      limit: value === "" ? 0 : Constants.LIMIT_AUTOCOMPLETE_SEARCH
    });

    if (getProductList.status) {
      if (getProductList.data.length > 0)
        this.setState({ dataProducts: getProductList.data });
      else
        this.setState({ dataProducts: [] });
    }
  }

  chooseProduct(products) {
    let { panes, activeKey } = this.state;
    const { stockList } = this.props;
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
    let newProduct = {};

    products.forEach(item => {
      
      this.uniqueId += 1;

      let newProduct = {
        id: 'new_' + this.uniqueId,
        productId: item.id,
        key: this.count,
        index: this.count,
        productCode: item.code,
        productName: item.name,
        unit: item.unitId.name,
        stockQuantity: item[stockList[stockIdFirst].stockColumnName] || 0,
        stockId: Number(stockIdFirst),
        quantity: 1,
        unitPrice: item.lastImportPrice,
        finalAmount: item.lastImportPrice,
        sellPrice: item.lastImportPrice,
        discount: 0,
        maxDiscount: item.maxDiscount,
        costUnitPrice: item.costUnitPrice,
        total: item.lastImportPrice,

        }
        stock_List.map(stock => {
            newProduct[stock] = item[stockList[stock].stockColumnName] || 0 ;
        }) 
      })

      let index = panes.findIndex(item => item.key === activeKey);
      if (index !== -1) {

        panes[index].content = [
          ...panes[index].content,
          newProduct
        ]
        this.count += 1;
        this.setState({
          panes,
          dataProducts:[]
        }, () => {           
          this.getTotalAmount(activeKey)})
      } 
  }

  onClickProduct = (id, record) => {
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

    id = Number(id);
    let { dataProducts, panes, activeKey } = this.state;

    let productFound = record ? record : dataProducts.find(item => item.id === id);
    
    if (productFound) {
      let product = {
        productId: id ? id : productFound.key,
        key: this.count,
        index: this.count,
        productCode: productFound.code,
        productName: productFound.name,
        quantity: 1,
        discount: 0,
        stockQuantity: productFound[stockList[stockIdFirst].stockColumnName] || 0,
        stockId: Number(stockIdFirst),
        finalAmount: productFound.saleUnitPrice,
        unitPrice: productFound.saleUnitPrice,
        total: productFound.saleUnitPrice,
        maxDiscount: productFound.maxDiscount,
        sellPrice: productFound.saleUnitPrice,
        costUnitPrice: productFound.costUnitPrice,
        type: productFound.type,
        unit: productFound.unitId ? productFound.unitId.name : productFound.unit
      }
      stock_List.map(stock => {
          product[stock] = productFound[stockList[stock].stockColumnName] || 0 ;
      }) 

      let index = panes.findIndex(item => item.key === activeKey);

      if (index !== -1) {

        panes[index].content = [
          ...panes[index].content,
          product
        ]
        this.count += 1;
        this.setState({
          panes,
          dataProducts:[]
        }, () => {           
          this.getTotalAmount(activeKey)})
      }
    }
  }

  render() {
    let { t } = this.props;
    
    return (
      <Fragment>
        {this.state.alert}
        <CardBody className={"table-sales"} >
          <Tabs
            tabPosition={"top"}
            defaultActiveKey={"1"}
            onChange={this.onChangeTab}
            className={""}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onEdit}

          >
            {this.state.panes.map(pane => {
              let title = pane.title.split(" ");

              return (
                <TabPane tab={t(title[0] + ` ${title[1]}`) + ` ${title[2]}`} key={pane.key} closable={pane.closable}>
                  {this.getTableSales(pane.key)}
                </TabPane>
              )
            }
            )}
          </Tabs>
          <span className="ohsearch-table-sales">
            <OhAutoComplete
              dataSelects={this.state.dataProducts}
              onSearchData={value => this.onSearchProduct(value)}
              placeholder={t(Constants.PLACEHOLDER_SEARCH_PRODUCT)}
              onClickValue={id => this.onClickProduct(id)}
              placeholder={t("Tìm tên sản phẩm") + " (F3)"}
              onClick={() => this.setState({ isVisible: true })}
              onRef={ref => this.autoRef = ref}
              onKeyPress={e => this.onKeyInput(e)}
            />
          </span>
        </CardBody>
      </Fragment>
    );
  }
}

export default (
  connect(function (state) {
    return {
      currentUser: state.userReducer.currentUser,
      stockList: state.stockListReducer.stockList
    };
  })
)(withTranslation("translations")

  (withStyles((theme) => ({
    ...extendedTablesStyle,
    ...buttonsStyle
  }))(TableSales)));;
