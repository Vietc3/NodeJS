import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withTranslation, } from 'react-i18next';
import withStyles from "@material-ui/core/styles/withStyles"
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import { Card, List, Col, Row, Modal, Tree, Empty, Tooltip, Spin } from 'antd';
import { AiFillFilter } from "react-icons/ai";
import moment from "moment";
import productService from 'services/ProductService';
import salesCounterService from 'services/SalesCounterService';
import ExtendFunction, { trans } from "lib/ExtendFunction";
import image from "assets/img/no-image-product.png";
import productTypeService from "services/ProductTypeService";
import { notifyError } from "components/Oh/OhUtils";
import Constants from 'variables/Constants/';
import CardBody from "components/Card/CardBody";
import { MdCancel } from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar";

class ListProduct extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.onRef) this.props.onRef(this);
    this.dataSales = localStorage.getItem("sales-counter") || "";
    this.isJson = JSON.isJson(this.dataSales);
    this.dataCustomers = this.isJson ? JSON.parse(this.dataSales) : {};

    this.filters = {};
    this.state = {
      dataSource: [],
      visible: false,
      loading: false,
      objCheckKeys: this.dataCustomers.objCheckKeys || {
        dataFilter: ['top-product', 'product-recently'],
        productType: [],
        topProduct: 1,
        productRecently: 1,
      },
      expandedKeys: ["product-type"],
      autoExpandParent: true,
      ProductTypeList: [],
      arrCheckBox: []
    };

  }

  componentDidMount = () => {
    this.getTypeProduct();
    this.getData();
  }

  setData(products) {
    let dataSource = products || [];
    let arrId = [];
    if (dataSource.length > 0) {
      dataSource.map(data => {
        data.key = data.productId;
        data.customerId = data.customerId ? (data.customerId) : null;
        data.fileStorage = []
        arrId.push(data.id || data.productId)

        return data;

      });
      
      this.setState({
        loading: false,
        dataSource: dataSource,
      }, () => {
        this.getImageProduct(arrId);
      });
    }
    else
      this.setState({
        loading: false,
        dataSource: [],
      })
  }

  async getImageProduct(arrId) {
    
    let { dataSource } = this.state;
    let ImageProducts = await productService.getProductImages({ ids: arrId })

    if (ImageProducts.status) {

      ImageProducts.data.forEach(item => {
        
        for (let ele of dataSource) {

          if ( (ele.productId || ele.id ) === item.productId) {
            let arrImg = ele.fileStorage ? ele.fileStorage : [];
            
            arrImg.push(item.file)
            ele.fileStorage = arrImg;
            
            break;
          }
        }
      })
    }

    this.setState({ dataSource })
  }

  async getData() {
    this.setState({
      loading: true
    })
    let { objCheckKeys } = this.state;

    let start = moment().subtract(1, 'month').startOf('day');
    let end = moment().endOf('day');
    let { filter } = this.filters;

    filter = {
      ...filter,
      createdAt: { "<=": parseInt(end.format(Constants.DATABASE_DATE_TIME_FORMAT_STRING)), ">=": parseInt(start.format(Constants.DATABASE_DATE_TIME_FORMAT_STRING)) }
    }

    const query = {
      filter: filter || {},
      startDate: parseInt(start.format(Constants.DATABASE_DATE_TIME_FORMAT_STRING)),
      endDate: parseInt(end.format(Constants.DATABASE_DATE_TIME_FORMAT_STRING)),
      objData: objCheckKeys,
      stockId: Object.keys(this.props.stockList)
    };

    let getProductList = await salesCounterService.getSalesCounterData(query)

    if (getProductList.status){
      this.props.onChangDataProduct(objCheckKeys);
      this.setData(getProductList.data);
      
    }
    else notifyError(getProductList.error)
  }

  getProductList = () => {
    let { dataSource } = this.state;
    let { t } = this.props;
    
    dataSource.forEach((item, index) => {
      let a = document.getElementById(`span_${index}`);
      let b = document.getElementById(`p_${index}`);

      let widthspan =  a ? a.offsetWidth : 0;
      let widthp =  b ? b.offsetWidth : 0;

      item.tooltip = (widthp < widthspan) ? true : false;
    })
  
    return (
      <List
        key={"list-product-sales"}
        className="list-product"
        dataSource={dataSource}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t(Constants.NO_PRODUCT)} /> }}
        renderItem={(item, index) => (
          <Col span={4}>
            <Card
              hoverable
              onClick={() => {
                this.props.onClickProduct(item);
                this.props.onChangDataProduct(this.state.objCheckKeys)
              }}
              style={{ width: "100%" }}
              cover={<img alt="example" className="img-list-product" src={item.fileStorage.length > 0 ? item.fileStorage[0] : image} />}
            >
              <p className="product-name">{trans(item.name)} </p>
              <p className="product-price-quantity" id={"p_"+index}>
              {item.type ===  Constants.PRODUCT_TYPES.id.merchandise ? 
              <Tooltip getPopupContainer={trigger => trigger.parentNode} placement="bottom" mouseEnterDelay={0.5} title={item.tooltip ? ExtendFunction.FormatNumber(Math.round(item.saleUnitPrice)) + `${t("/SL") + ":"}` + ExtendFunction.FormatNumber(Math.round(item.sumQuantity)) : ""}><span id={"span_"+index}>{ExtendFunction.FormatNumber(Math.round(item.saleUnitPrice)) + `${t("/SL") + ":"}` + ExtendFunction.FormatNumber(Math.round(item.sumQuantity))}</span></Tooltip>
              : <Tooltip getPopupContainer={trigger => trigger.parentNode} placement="bottom" mouseEnterDelay={0.5} title={item.tooltip ? ExtendFunction.FormatNumber(Math.round(item.saleUnitPrice)) + `${t("/SL") + ":"}` + ExtendFunction.FormatNumber(Math.round(item.sumQuantity)) : ""}><span id={"span_"+index}>{ExtendFunction.FormatNumber(Math.round(item.saleUnitPrice)) }</span></Tooltip> }
              </p>
            </Card>
          </Col>
        )}>
      </List>
    )
  }

  onCancel = () => {
    this.setState({
      visible: false,
      expandedKeys: ["product-type"],
    })
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  };

  onCheckProduct = (e)=> {
    this.setState({
      arrCheckBox: [
        ...e
      ]
    })
  }

  onCheck = checkedKeys => {
    if (!checkedKeys.length){
      notifyError("Vui lòng chọn ít nhất một nhóm");
      return;
    } else {
      let top = (checkedKeys.indexOf("top-product") !== -1) ? 1 : 0;
      let recently = (checkedKeys.indexOf("product-recently") !== -1) ? 1 : 0;
      let arrProductType = checkedKeys.filter(item => item !== "top-product" && item !== "product-recently" && item !== "product-type");

      this.setState({
        objCheckKeys: {
          dataFilter: checkedKeys,
          productType: arrProductType,
          topProduct: top,
          productRecently: recently,
        }
      }, () => {
        this.getData();
        this.onCancel();
      })
    }
  };

  getTypeProduct = async () => {

    let getProductTypes = await productTypeService.getProductTypes();

    if (getProductTypes.status) {
      
      this.setState({
        ProductTypeList: getProductTypes.data
      });
    } else notifyError(getProductTypes.error)
  }

  getTreeData = () => {
    let { ProductTypeList } = this.state;
    let data = [];

    if (ProductTypeList.length > 0) {
      ProductTypeList.forEach(item => {
        data.push({ title: <span className="ellipsis-not-span-products" title={item.name} >{item.name} </span>, key: item.id })
      })
    }
    return data;
  }

  render() {
    let { t } = this.props;
    let height = window.innerHeight;

    const treeData = [
      {
        title: t('Top sản phẩm bán chạy'),
        key: 'top-product',
      },
      {
        title: t('Sản phẩm bán gần đây'),
        key: 'product-recently',
      },
      {
        title: t('Nhóm sản phẩm'),
        key: 'product-type',
        className: "product-type-list",
        children: this.getTreeData()
      },
    ];

    return (
      <Fragment>
        <CardBody>
        <Modal
          title={t("Lọc sản phẩm")}
          visible={this.state.visible}
          className={"modal-product-sales"}
          maskClosable={false}
          onCancel={this.onCancel}
          footer={[
            <OhToolbar
                key ={"filter-product"}
                right={[
                  {
                    type: "button",
                    label: t("Lọc"),
                    onClick: () => this.onCheck(this.state.arrCheckBox),
                    icon: <AiFillFilter/>,
                    simple: true,
                    typeButton: "add",
                    permission: {
                      name: Constants.PERMISSION_NAME.SALES_COUNTER,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }
                  },
                  {
                    type: "link",
                    label: t("Thoát"),
                    onClick: () => this.onCancel() ,
                    icon: <MdCancel />,
                    typeButton: "exit",
                    simple: true
                  }
                ]}
              />
          ]}
          zIndex={1050}
          width={660}
          style ={{ top: height >= 800 ? "" : 25 }}

        >
          <Tree
            checkable
            multiple
            checkedKeys={this.state.arrCheckBox}
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            onCheck={(e)=>this.onCheckProduct(e)}
            onSelect={(e)=>this.onCheckProduct(e)}
            treeData={treeData}
            selectedKeys={this.state.arrCheckBox}
            selectable
          />
        </Modal>
        <Spin spinning={this.state.loading}>
        <div className="site-card-wrapper">
          <p
            className="filter-product"
            onClick={() => this.setState({ visible: true , arrCheckBox : this.state.objCheckKeys.dataFilter})}>
            <AiFillFilter />&nbsp;
            {t("Lọc sản phẩm")}
          </p>
          <div className="site-card-wrapper-1">
            <Row gutter={20} style={{
              height: height >= 800 ? "calc(85vh - 390px)" : "320px",
              overflow: "auto",
              minWidth: "700px",
              width: "100%"
            }}>
              {this.getProductList()}
            </Row>
          </div>
        </div>
        </Spin>
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
  }))(ListProduct)));;
