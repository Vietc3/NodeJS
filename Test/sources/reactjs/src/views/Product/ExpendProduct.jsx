import React, { Component } from 'react';
import { Tabs } from "antd";
import { withTranslation } from "react-i18next";
import TinyView from "components/TinyEditor/TinyView";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CardBody from "components/Card/CardBody.jsx";
import image from "assets/img/no-image-product.png";
import ExtendFunction from "lib/ExtendFunction";
import { trans } from "lib/ExtendFunction";
import "../css/css.css";
import productService from 'services/ProductService';
import StockService from 'services/StockService';
import OhToolbar from "components/Oh/OhToolbar";
import { MdDelete, MdBorderColor, MdCheck, MdLock, MdCached } from "react-icons/md";
import Constants from "variables/Constants/";
import OhTable from "components/Oh/OhTable";
import { notifyError } from 'components/Oh/OhUtils';
import Carousel, { Modal, ModalGateway } from "react-images";
import _ from 'lodash';

const { TabPane } = Tabs;

class ExpendProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullStockList: {},
      data: this.props.data || {},
      loading: false,
      imageProduct: image,
      valueIsStop: 0,
      imageNew: null,
      arrImage: [],
      isViewImage: false,
      photoIndex: 0,
      subDataSource: []
    }
  }

  componentWillMount() {
    this.getData(this.props.data, this.props.id)
  }

  componentDidUpdate(prevProps, prevState) {
    if ((Object.keys(this.props.data).length && JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data))) {
      this.setState({
        data: this.props.data
      }) 
      this.getData(this.props.data, this.props.id)     
    }
  }

  getData = async (data, id) => {
    this.setState({
      loading: true
    })

    let [ImageProducts, getBranchProduct, getStockList] = await Promise.all([
      productService.getProductImages({ ids: [id] }),
      productService.getBranchProducts(id),
      StockService.getStockList({ filter: { deletedAt: 0 } }),
    ]);

    if (getBranchProduct.status) {
      data.branchProduct = getBranchProduct.data;
    }
    else notifyError(getBranchProduct.message);

    if (ImageProducts.status) {
      let arrImage = [];

      for (let item of ImageProducts.data) {
        arrImage.push(item.file)
      }

      data.fileStorage = arrImage;
    } else notifyError(ImageProducts.message)

    let fullStockList = {};

    if (getStockList.status) {
      getStockList.data.map(item => {
        fullStockList[item.branchId.id] = fullStockList[item.branchId.id] || {};
        fullStockList[item.branchId.id][item.stockColumnIndex] = item
      });
    } else notifyError(getStockList.message)

    let subDataSource = [];

    if (data.name.length) {
      let dataBranch = data.branchProduct || [];
      for (let item of dataBranch) {
        let quantity = _.sum(Object.values(_.pick(Constants.STOCK_QUANTITY_LIST, Object.keys(fullStockList[item.branchId]))).map(i => item[i]));
        let count = 0;
        let arrFullStockList = Object.values(fullStockList[item.branchId]).sort((a, b) => a.name.localeCompare(b.name));
        for (let stock of arrFullStockList) {
          let record = {
            stockName: stock.name,
            quantity: item[Constants.STOCK_QUANTITY_LIST[stock.stockColumnIndex]],
          }
          if (count === 0) {
            count += 1;
            record = _.extend(record, {
              branchName: item.branchName,
              totalQuantity: quantity,
              stoppedAt: item.stoppedAt,
              rowSpan: arrFullStockList.length
            })
          }
          subDataSource.push(record);
        }
      }
    }

    this.setState({ data, fullStockList, loading: false, subDataSource })
  }

  setImage() {
    let arr = [];
    this.state.arrImage.forEach(item => (arr.push({ src: item, alt: "..." })))
    return arr;
  }

  viewImage = (image) => {
    this.setState({
      isViewImage: true,
      arrImage: image,
      photoIndex: 0
    })
  }

  showImage = (image) => {
    let dataImage = [];
    for (let i in image) {

      dataImage.push(
        <>
          <div style={{ maxWidth: "55px", maxHeight: "50px" }} align="center">
            <span style={{ marginLeft: 150 }} onClick={() => this.setState({ imageNew: image[i] })}>
              <img alt="Product"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  display: "block",
                  margin: "auto",
                  height: "50px",
                  width: "50px",
                  opacity: 0.8,
                }} src={image[i]} />
            </span>
          </div>
        </>
      );

    }
    return dataImage;
  }

  render() {
    let { data, isViewImage, arrImage, valueIsStop, subDataSource } = this.state;
    let { t } = this.props;
    
    const styleProduct = {
      Title: {
        textAlign: "left",
        color: "#357CD9",
        marginTop: "15px",
        marginLeft: "30px",
      },
      Span: {
        fontSize: 12,
        color: "#000000",
        maxWidth: "99%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "inline-block",

      },
      Hr: {
        margin: "10px 0px"
      },
      Hr_1: {
        marginTop: "0px",
        marginBottom: "10px"
      },
      Image: {
        maxWidth: "100%",
        display: "block",
        margin: "auto",
        maxHeight: "180px",
        overflowY: "visible",
      },
      Image_2: {
        maxWidth: "100%",
        maxHeight: "100%",
        display: "block",
        margin: "auto",
        height: "50px",
        width: "60px"

      },
    }

    let getTonColumns = [
      {
        title: t("Chi nhánh"),
        dataIndex: "branchName",
        width: "25%",
        key: "branchName",
        align: "left",
        render: (value, record, index) => {
          let obj = {
            children: <span style={{ fontWeight: 700 }}>{value}</span>,
            props: {}
          }
          obj.props.rowSpan = record.rowSpan || 0
          return obj;
        }
      },
      {
        title: t("Kho"),
        dataIndex: "stockName",
        key: "stockName",
        width: "20%",
      },
      {
        title: t("Tồn kho"),
        dataIndex: "quantity",
        key: "quantity",
        align: "right",
        render: (value, record) => {
          return <span style={{ fontWeight: 700 }}>{ExtendFunction.FormatNumber(value)}</span>
        }
      },
      {
        title: t("Tổng tồn kho"),
        dataIndex: 'totalQuantity',
        key: "totalQuantity",
        align: "right",
        render: (value, record, index) => {
          let obj = {
            children: <span style={{ fontWeight: 700 }}>{ExtendFunction.FormatNumber(value)}</span>,
            props: {}
          }
          obj.props.rowSpan = record.rowSpan || 0
          return obj;
        }
      },
      {
        title: t("Trạng thái sản phẩm"),
        dataIndex: "code",
        key: "code",
        width: "30%",
        align: "left",
        render: (value, record, index) => {
          let obj = {
            children: <span style={{ fontWeight: 700 }}>{record.stoppedAt === undefined ? '' : (record.stoppedAt > 0 ? t("Ngừng kinh doanh") : t("Đang kinh doanh"))}</span>,
            props: {}
          }
          obj.props.rowSpan = record.rowSpan || 0
          return obj;
        }
      }
    ];

    return (
      <div>
        <Tabs key={"tab_" + data.id} type="line" style={{ color: "black" }}>
          <TabPane tab={t("Thông tin")} key="1" style={{ backgroundColor: "#FFFFFF", marginLeft: "0px"}}>

            <div key={"div_" + data.id}>
              <h4 style={styleProduct.Title}><b style={{ fontWeight: "bold" }}>{trans(data.name)}</b></h4>
              <GridContainer xs={12} sm={12} style={{ marginTop: '-25px' }}>
                <GridItem xs={12} sm={5}>
                  <GridContainer style={{ maxWidth: "600px" }}>
                    <GridItem xs={12} style={{ marginLeft: 20 }}>
                      {data.fileStorage && data.fileStorage.length > 0 ?
                        <span onClick={() => this.viewImage(data.fileStorage)} style={{ cursor: "pointer" }}>
                          <img alt="Product"
                            style={styleProduct.Image}
                            src={(data.fileStorage.includes(this.state.imageNew) ? this.state.imageNew : data.fileStorage[0])}
                          /></span> :
                        <img alt="Product"
                          style={styleProduct.Image}
                          src={this.state.imageProduct}
                        />}
                    </GridItem>

                  </GridContainer>
                  <GridContainer style={{ marginLeft: 10, cursor: "pointer" }}>
                    {data.fileStorage.length > 0 ?
                      this.showImage(data.fileStorage)
                      : <img alt="Product"
                        style={styleProduct.Image_2}
                        src={this.state.imageProduct}

                      />}
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  <GridContainer>
                    <GridItem xs={12}>
                      {<span style={styleProduct.Span}>{t("Mã sản phẩm")}:
                        <b title={data.code} style={{ fontWeight: "bold", marginLeft: 25, fontSize: 13 }}>{data.code ? data.code : ""}</b>
                      </span>}<hr style={styleProduct.Hr} />
                      {<span style={styleProduct.Span}>{t("Loại hàng hóa")}:
                        <b title={Constants.PRODUCT_TYPES.name[data.type]} style={{ marginLeft: 25, fontSize: 13 }}>{data.type ? Constants.PRODUCT_TYPES.name[data.type] : ""}</b>
                      </span>}<hr style={styleProduct.Hr} />
                      {<span style={styleProduct.Span}>{t("Nhóm sản phẩm")}:
                        <b title={data.productTypeId ? data.productTypeId.name : ""} style={{ marginLeft: 8, fontSize: 13 }}>{data.productTypeId ? data.productTypeId.name : ""}</b>
                      </span>}<hr style={styleProduct.Hr} />
                      {data.type === Constants.PRODUCT_TYPES.id.merchandise ? 
                      <>
                        {<span style={styleProduct.Span}>{t("Nhà cung cấp")}:
                          <b title={data.customerId_name ? data.customerId_name : ""} style={{ marginLeft: 28, fontSize: 13 }}>{data.customerId_name ? data.customerId_name : ""}</b>
                        </span>}<hr style={styleProduct.Hr} />
                      </>
                      : null }
                      {<span style={styleProduct.Span}>{t("Giá bán")}:
                        <b style={{ marginLeft: 60, fontSize: 13 }}>{data.saleUnitPrice ? ExtendFunction.FormatNumber(data.saleUnitPrice) : 0}</b>
                      </span>}<hr style={styleProduct.Hr} />
                      {data.type === Constants.PRODUCT_TYPES.id.merchandise ? 
                      <span style={styleProduct.Span}>{t("Giá vốn")}:
                        <b style={{ marginLeft: 60, fontSize: 13 }}>
                          {data.costUnitPrice ? ExtendFunction.FormatNumber(data.costUnitPrice) : 0}</b>
                      </span>: null}
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <GridContainer xs={12} sm={12}>
                    <GridItem xs={12} sm={12} >
                      <span style={styleProduct.Span}>{t("Mô tả")}{" "}</span>
                      <hr style={styleProduct.Hr} />
                      {data.description ?
                        <div style={{ marginTop: "10px" }}>
                          <TinyView
                            content={data.description}
                            height={150}
                            width="100%"
                            id={"task_editor_" + data.id}
                          /></div> : null}

                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </div>

            <div align="right" style={{ marginRight: "20px", marginBottom: "10px" }}>
              <OhToolbar
                right={[
                  {
                    type: "link",
                    linkTo: "/admin/edit-product/" + data.id,
                    params: { data: { data }, valueIsStop: { valueIsStop } },
                    label: t("Cập nhật"),
                    icon: <MdBorderColor />,
                    simple: true,
                    typeButton: "add",
                    permission: {
                      name: Constants.PERMISSION_NAME.PRODUCT,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    },
                  },
                  data.stoppedAt ?
                    {
                      type: "button",
                      label: t("Cho phép kinh doanh"),
                      onClick: () => this.props.onChangeStatus(data, { isStop: 0 }, "Bạn có chắc chắn muốn kinh doanh trở lại "),
                      icon: <MdCheck />,
                      simple: true,
                      typeButton: "add",
                      permission: {
                        name: Constants.PERMISSION_NAME.PRODUCT,
                        type: Constants.PERMISSION_TYPE.TYPE_ALL
                      },
                    }
                    :
                    {
                      type: "button",
                      label: t("Ngừng kinh doanh"),
                      onClick: () => this.props.onChangeStatus(data, { isStop: 1 }, "Bạn có chắc chắn muốn ngừng kinh doanh "),
                      icon: <MdLock />,
                      simple: true,
                      typeButton: "add",
                      permission: {
                        name: Constants.PERMISSION_NAME.PRODUCT,
                        type: Constants.PERMISSION_TYPE.TYPE_ALL
                      },
                    },
                  {
                    type: "button",
                    label: t("Xóa"),
                    onClick: () => this.props.onChangeStatus(data, { isDelete: 1 }, "Bạn có chắc chắn muốn xóa "),
                    icon: <MdDelete />,
                    simple: true,
                    typeButton: "delete",
                    permission: {
                      name: Constants.PERMISSION_NAME.PRODUCT,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    },
                  },
                  {
                    type: "button",
                    label: t("Chuyển đổi"),
                    onClick: () => this.props.openChangeStockModal(data),
                    icon: <MdCached />,
                    simple: true,
                    typeButton: "add",
                    permission: {
                      name: Constants.PERMISSION_NAME.PRODUCT,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    },
                  }
                ]}
              />
            </div>
          </TabPane>
          {data.type === Constants.PRODUCT_TYPES.id.merchandise ? 
            <TabPane tab={t("Tồn kho")} key="2" style={{ backgroundColor: "#FFFFFF", marginLeft: "0px", marginTop: "8px" }}>
              <CardBody>
                <OhTable
                  columns={getTonColumns}
                  dataSource={subDataSource}
                  isNonePagination={true}
                  id="product-expend-table"
                  bordered={true}
                />
              </CardBody>
            </TabPane>
          : null}
        </Tabs>
        {isViewImage && arrImage ?
          <ModalGateway>
            {isViewImage ? (
              <Modal onClose={() => this.setState({ isViewImage: false })}>
                <Carousel
                  style={{ zIndex: 1000 }}
                  views={this.setImage()}
                />
              </Modal>
            ) : null}
          </ModalGateway>
          : null}
      </div>
    );
  }
}

export default withTranslation("translations")(ExpendProduct);