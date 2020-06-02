import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux"
import TinyEditor from "components/TinyEditor/TinyEditor";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import { Upload, Icon, Tabs, Select, Spin } from "antd";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import image from "assets/img/them.png";
import _ from "lodash";
// multilingual
import { withTranslation } from "react-i18next";
import "../../../css/css.css";
import ProductTypeForm from "views/ProductType/components/ProductType/Form";
import AddProductUnit from "views/ProductUnit/AddProductUnit";
import Constants from 'variables/Constants/';
import { Redirect } from 'react-router-dom';
import productTypeService from "services/ProductTypeService";
import productService from "services/ProductService";
import customerService from "services/CustomerService";
import productUnitService from "services/ProductUnitService";
import StockService from 'services/StockService';
import ModalCreateCustomer from "./ModalCreateCustomer";
import ManufacturingFormula from "./ManufacturingFormula";
import { MdSave, MdCancel, MdCached } from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar";
import OhForm from "components/Oh/OhForm";
import ModalChangeStock from './ModalChangeStock';
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import ExtendFunction from "lib/ExtendFunction";
import vn from "assets/img/flags/VN.png";
import en from "assets/img/flags/EN.png";
import kr from "assets/img/flags/KR.png";

import Actions from "store/actions";
import Store from "store/Store";
import ManualSortFilter from "MyFunction/ManualSortFilter";
const flagImages =  { "VN": vn, "EN": en, "KR": kr};

const { TabPane } = Tabs;

const propTypes = {
  type: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.object,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  updateProduct: PropTypes.func
};

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ProductFormula: [],
      visible: false,
      title: "Add Product",
      Product: {maxDiscount: 100, type: Constants.PRODUCT_TYPES.id.merchandise},
      Products: [],
      status: false,
      previewVisible: false,
      previewImage: "",
      fileList: [],
      MessageError: "",
      dataSourcePType: this.props.productTypes && this.props.productTypes.length ? this.props.productTypes : [],
      dataSourcePUnit: this.props.productUnits && this.props.productUnits.length ? this.props.productUnits : [],
      dataSourceCustomer: this.props.suppliers && this.props.suppliers.length ? this.props.suppliers : [],
      dataSourcePStock: [],
      visibleAddProductUnit: false,
      visibleAddCustomer: false,
      visibleAddProductType: false,
      checkedBoxProduct: false,
      Image: image,
      removeImages: [],
      isSubmit: false,
      activeKey: "1",
      visibleChangeStock: false,
      changedRecord: {},
      isEdit: false,
      language: this.props.languageCurrent,
      loading: false
    };
  }

  handleChange = ({ fileList }) => {
    for (let i in fileList) {
      if (fileList[i].type.indexOf("image/") === -1) {
        fileList.splice(i, 1);
      }
    }

    if (fileList.length > 5) fileList.splice(5, fileList.length);
    this.setState({ fileList });
  };

  componentDidMount = () => {
    let stockId = this.props.location && this.props.location.state && this.props.location.state.stockId || null;    
    this.getData(null,stockId);
  };

  async setData(productTypes, customers, productUnits) {
    if (productTypes && productTypes.length) {
      Store.dispatch(Actions.changeProductTypeList(ManualSortFilter.sortArrayObject(productTypes, "name", "asc")))
    }

    if (productUnits && productUnits.length) {
      Store.dispatch(Actions.changeProductUnitList(ManualSortFilter.sortArrayObject(productUnits, "name", "asc")))
    }

    if (customers && customers.length) {
      Store.dispatch(Actions.changeSupplierList(ManualSortFilter.sortArrayObject(customers, "name", "asc")))
    }

    this.setState({
      loading: false,
      dataSourcePType: productTypes || [],
      dataSourceCustomer: customers || [],
      dataSourcePUnit: productUnits || [],
    });
  }

  async getData(productId, stockId) {
    let { t } = this.props;
    productId = productId || (this.props.match.params || {}).productId;
    if (productId){
      this.setState({
        loading: true
      });
    }
    let [getProductTypes, getSuppliers, getProductUnits, getProduct, getProductImages, productFormula] = await Promise.all([
      productTypeService.getProductTypes(),
      customerService.getSuppliers({ isBranch: true }),
      productUnitService.getProductUnits(),

    ].concat(productId ? [
      productService.getProduct(productId),
      productService.getProductImages({ids: [productId]}),
      productService.getProductFormula(productId)
    ] : []));


    if (getProduct && getProductImages) {
      this.changeProductProps(getProduct, getProductImages, stockId);
    }
    if (productFormula) {
      this.getDataManufacturing(productFormula);
    }
    
    if (getProductTypes.status && getSuppliers.status && getProductUnits.status){
      this.setData(getProductTypes.data, getSuppliers.data, getProductUnits.data);

    } else {
      notifyError(t(getProductTypes.message) || (t(getSuppliers.message) || t(getProductUnits.message)))
      this.setState({
        loading: false
      });
    }
  }

  changeProductProps = (getProduct, getProductImages, stockId) => {
    let { stockList } = this.props;
    let stockIdFirst;
    let stock_Lists = Object.keys(stockList);
    let stock_List = [];
    
    let checkStockId = false;

    if (stock_Lists.length){
      stock_Lists.map(stock => {
        let check_Stock =  stockList[stock] && stockList[stock].deletedAt === 0;
        if (check_Stock){
          stock_List.push(stock) ;
        }
      })
  
      stockIdFirst = stock_List[0];
    }

    let stockListKeys = stock_List.map( key =>{
      return Number(key);
    });
     
    if(!getProduct.status) {
      notifyError(getProduct.error);
    } else{
      
      let images = [];
      if (getProductImages.status) {
        if ( getProductImages.data.length > 0 ) {
          for (let i = 0; i < getProductImages.data.length; i++) {
            let temp = {};

            temp.uid = getProductImages.data[i].id;
            temp.name = getProductImages.data[i].id + ".jpg";
            temp.status = "done";
            temp.url = getProductImages.data[i].file;
            temp.type = "image/jpeg";
            images.push(temp);
          }
        }
      }
      
      if (stockId){
        checkStockId = _.includes(stockListKeys, stockId);
      }

      let stockId_new = 0;
      let stockQuantityCurrent = 0;     

      if (checkStockId){
        let checkStock =  stockList[stockId] && stockList[stockId].deletedAt === 0;

          if (!checkStock){
            stockQuantityCurrent = 0;           
          } else {
            stockQuantityCurrent = getProduct.data[stockList[stockId].stockColumnName] || 0;
          }

          stockId_new = stockId;

      } else {
        stockId_new = stockIdFirst;
        stockQuantityCurrent = getProduct.data[stockList[stockIdFirst].stockColumnName] || 0;

      }

      this.setState({
        Product: {
          ...getProduct.data,
          name: ExtendFunction.languageName(getProduct.data.name),
          unitId: getProduct.data.unitId.id,
          unitName: getProduct.data.unitId.name,
          stockId: Number (stockId_new),
          stockQuantityCurrent: stockQuantityCurrent
        },
        MessageError: "",
        isEdit: true,
        fileList: images
      });
    }
  }

  changeProductStock(stockId){
    let { Product } = this.state;
    let { stockList } = this.props;
    return Product ? { name: stockList[stockId].stockColumnName, value: Product[stockList[stockId].stockColumnName] } : {}
  }

  getDataManufacturing = async (productFormula) => {
    if(!productFormula.status) {
      notifyError(productFormula.error);
    } else{
      let data = productFormula.data;
      let materialsId = [];
      data.map(item => materialsId.push(item.materialId.id))

      let products = await productService.getProductList({ filter: {id: {in: materialsId}} });
      let productInfo = [];

      data.forEach(elem => {
        products.data.forEach( (item, index) => {
          if(elem.materialId.id === item.id){
            productInfo.push({
              productId: item.id,
              productCode: item.code,
              productName: item.name,
              unit: item.unitId.name,
              category: item.category,
              stockQuantity: elem.quantity,
            })
          }
        })
      })

      this.setState({ ProductFormula: productInfo })
    }
  }


  handleSubmit = async e => {
    e.preventDefault();
    let ProductFormula = this.state.ProductFormula;    
    let { t, stockList } = this.props;
    let checkStock = false;

    if ( ((this.ohFormRef && this.ohFormRef.allValid()) || (this.ohFormRefStock && this.ohFormRefStock.allValid())) && this.state.Product) {
      if (this.state.Product.stockId){
        checkStock =  stockList[this.state.Product.stockId] && stockList[this.state.Product.stockId].deletedAt !== 0;
      }

      if (checkStock) {
        notifyError(t("Kho đã bị xóa xin chọn kho khác"))
        return;
      } else if (this.state.Product.name.length > 125 || (this.state.Product.code && this.state.Product.code.length > 125)) {
        notifyError(t("Tên và mã sản phẩm không được dài hơn 125 ký tự"));
        return;
      } else if (ProductFormula && ProductFormula.some(item => item.stockQuantity === "" || item.stockQuantity <= 0)){
        notifyError(t("Vui lòng chọn số lượng"));
      }else{
        this.setState({ isSubmit: true });
        this.updateProduct(this.state.Product);
      }
    }
  }

  updateProduct = async item => {
    delete item.key;
    delete item.ProductUnit;
    delete item.ProductTypeName;
    delete item.ManufacturerName;
    
    let { t } = this.props;
    let path = this.props.location.pathname.split("/");
    let pathtoken = path[path.length - 1];
    let dataEdit = pathtoken !== "add-product" ? pathtoken : undefined;

    let productData = _.pickBy(
      _.pick(item, [
        "id",
        "name",
        "productTypeId",
        "description",
        "customerId",
        "unitId",
        "costUnitPrice",
        "saleUnitPrice",
        "quantity",
        "stockMin",
        "category",
        "maxDiscount",
        "barCode",
        "objName",
        "stockId",
        "type"
      ]),
      value => value !== null
    );
    productData.costUnitPrice = parseFloat(productData.costUnitPrice) || 0;
    productData.saleUnitPrice = parseFloat(productData.saleUnitPrice) || 0;
    productData.quantity = parseFloat(item.stockQuantityCurrent) || 0;
    productData.maxDiscount = parseFloat(productData.maxDiscount) || 0;
    productData.code = item.code ? item.code : undefined;

    if ( !this.props.match.params.productId ){
      let nameProduct = productData.name[this.props.languageCurrent];
      productData.name = {...ExtendFunction.languageName(nameProduct), ...productData.name}
    }

    productData.name = JSON.stringify(productData.name);
    try {
      let saveProduct = await productService.saveProduct(productData);

      if (saveProduct.status) {

        if ((!this.state.isEdit && this.state.ProductFormula.length) || this.state.isEdit) {
          let data = { id: saveProduct.data.id, materials: this.state.ProductFormula };
          if(productData.type === Constants.PRODUCT_TYPES.id.merchandise)
            await productService.saveProductFormula(data);
        }

        if (this.state.fileList.length > 0) {
          let updateFile = await productService.saveImage({ image: this.state.fileList, productId: saveProduct.data.id });
          if (updateFile.status) {
            let fileList = this.state.fileList;

            for (let item of fileList ) {
              if (item.thumbUrl) {
                item.url = item.thumbUrl;
                item.status = "done";
                delete item.originFileObj
              } 
              delete item.thumbUrl
            }

            this.setState({
              fileList
            });
          }
        }
        if (this.state.removeImages.length > 0) {
          let removeImg = await productService.deleteImage({ image: this.state.removeImages });

          if (removeImg.status)
            this.setState({
              removeImages: []
            })
        }
        
        let dataProducts = await productService.getProductList({ filter: { id: saveProduct.data.id }});

        if (dataProducts.status) {
          let data = dataProducts.data.concat(this.props.productList);
          data = _.uniqBy(data, "id")
          Store.dispatch(Actions.changeProductList(ManualSortFilter.sortArrayObject(data, "updatedAt", "desc")));
        }
        dataEdit ? this.success(t("Cập nhật sản phẩm thành công")) : this.success(t("Tạo sản phẩm thành công"))
      } else {
        this.setState({isSubmit: false})
        notifyError(saveProduct.message);
      }
    }
    catch(error) {
      this.setState({isSubmit: false})
      
      if ( typeof error === "string" ) notifyError(error);
    }
	}

  success = (mess) => {
    notifySuccess(mess);
    this.setState({
      redirect: <Redirect to={Constants.PRODUCT_PATH} />,
    });
  };

  showModalAddProductUnit = () => {
    this.setState({
      visibleAddProductUnit: true
    });
  };

  showModalAddProductType = () => {
    this.setState({
      visibleAddProductType: true
    });
  };

  showModalAddCustomer = type => {
    this.setState({
      visibleAddCustomer: true,
      typeCustomer: type
    });
  };

  removeImage = image => {
    if (image.url) {
      let { removeImages } = this.state;

      removeImages.push(image.uid);
      this.setState({ removeImages });
    }
  };

  onChange = (obj, listStock) => {
    let { language, isEdit } = this.state;
    let languagecurrent =  (this.props.Language_Product >= Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY) ? language : this.props.languageCurrent;
    
    if(this.state.Product.stockId !== obj.stockId && isEdit)
      obj.stockQuantityCurrent = this.changeProductStock(obj.stockId).value;

    if(listStock.length === 1)
      obj.stockId = listStock[0].value;

    if ( obj["saleUnitPrice"] === "" || !obj["saleUnitPrice"] )
      obj["saleUnitPrice"] = 0
    if ( obj["stockQuantityCurrent"] === "" || !obj["stockQuantityCurrent"] )
      obj["stockQuantityCurrent"] = 0
    if ( obj["costUnitPrice"] === "" || !obj["costUnitPrice"] )
      obj["costUnitPrice"] = 0
    if ( obj["maxDiscount"] === "" || !obj["maxDiscount"] )
      obj["maxDiscount"] = 0
    
    if ( obj["stockMin"] === "" || !obj["stockMin"] )
      obj["stockMin"] = 0
    
    let Product = {
      ...this.state.Product,
      ...obj,
      name: {
        ...this.state.Product.name,
        [languagecurrent]: obj.name,
      }
      
    };

    this.setState({ Product});
  };

  downloadImage = file => {
    let pageImage = new Image();

    pageImage.src = file.url;

    pageImage.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = pageImage.naturalWidth;
      canvas.height= pageImage.naturalHeight;
  
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(pageImage, 0, 0);
      saveScreenshot(canvas);
    }

    function saveScreenshot(canvas) {
      let fileName = "image"
      const link = document.createElement('a');
      link.download = fileName + '.png';

      canvas.toBlob(function(blob) {
        link.href = URL.createObjectURL(blob);
        link.click();
      });
    }
  }

  onTab = (key) =>{
      this.setState({
        activeKey: key
      })
  }

  openChangeStockModal = (record) => {
    this.setState({
      visibleChangeStock: true,
      changedRecord: record
    })
  }

  
  handleChangeLanguage = (e) =>{
    this.setState({
      language: e.key
    })
  }

  render() {
    const { t , permissionsUser, Language_Product, languageCurrent,stockList} = this.props;
    const { Product, isSubmit, isEdit, language } = this.state;
    let type_permission = Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY;
    let NAME_FLAG = Constants.NAME_FLAG;
    let dataSourcePType = [];
    let nameProduct = (Language_Product >= type_permission) ? language : languageCurrent;
    let nameLanguage = (Product && Product.name) ? Product.name[nameProduct] : '';
    let listStock = ExtendFunction.getSelectStockList(stockList, []);
    
    if (this.state.dataSourcePType.length > 0) {
      this.state.dataSourcePType
        .sort((a, b) => (a.name ? a.name.toString().localeCompare(b.name) : ""))
        .map(data => dataSourcePType.push({ value: data.id, title: data.name }));
    }

    let dataSourceManufacturer = [];
    if (this.state.dataSourceCustomer.length > 0) {
      this.state.dataSourceCustomer
        .sort((a, b) => (a.name ? a.name.toString().localeCompare(b.name) : ""))
        .map(data => dataSourceManufacturer.push({ value: data.id, title: data.name, code : data.code }));
    }
    let dataSourcePUnit = [];
    if (this.state.dataSourcePUnit.length > 0) {
      this.state.dataSourcePUnit
        .sort((a, b) => (a.name ? a.name.toString().localeCompare(b.name) : ""))
        .map(data => dataSourcePUnit.push({ value: data.id, title: data.name }));
    }

    const buttonStyle = {
      width: "30px",
      height: "30px",
      paddingBottom: "2px",
      bottom: "4px",
      paddingRight: "0px",
      paddingLeft: "1px"
    };

    const { fileList } = this.state;
    const addType = <ButtonTheme
          size="sm"
          style={buttonStyle}
          color="default"
          onClick={() => this.showModalAddProductType("ProductTypeName")}
          title={t("Tạo nhóm sản phẩm")}
        >
          <Icon type="plus" style={{ margin: "0px 0px 3px 3px" }} />
        </ButtonTheme>

    const addUnit = <ButtonTheme
          size="sm"
          style={buttonStyle}
          color="default"
          onClick={() => this.showModalAddProductUnit()}
          title={t("Tạo đơn vị tính")}
        >
          <Icon type="plus" style={{ margin: "0px 0px 3px 3px" }} />
        </ButtonTheme>

    const addCustomer = <ButtonTheme
        size="sm"
        style={buttonStyle}
        color="default"
        onClick={() => this.showModalAddCustomer("3")}
        title={t("Tạo nhà cung cấp")}
      >
        <Icon type="plus" style={{ margin: "0px 0px 3px 3px" }} />
      </ButtonTheme>
    const column1 = [
      {
        name: "name",
        label: t("Tên"),
        ohtype: "input",
        validation: language === languageCurrent ? "required": null,
        message: language === languageCurrent ? t("Vui lòng điền tên sản phẩm") : t("Vui lòng điền tên sản phẩm theo ngôn ngữ hiện tại của hệ thống"),
        helpText: t("Tên sản phẩm tương ứng mã sản phẩm"),
        autoFocus: true
      },
      {
        name: "code",
        label: t("Mã sản phẩm"),
        ohtype: "input",
        placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
        helpText: t("Mã hàng hóa là thông tin duy nhất")
      },
      {
        name: "type",
        label: t("Loại"),
        ohtype: "select",
        helpText: t("Loại hàng hóa cho sản phẩm"),
        options: Constants.PRODUCT_TYPES.arr.map(item => ({value: item.id, title: t(item.name), data: item})),
        format: value => Constants.PRODUCT_TYPES.name[value],
        disabled: isEdit
      },
      {
        name: "productTypeId",
        label: t("Nhóm"),
        ohtype: "select",
        validation: "required",
        options: dataSourcePType,
        message: t("Vui lòng chọn nhóm sản phẩm"),
        button: addType,
        placeholder: t("Chọn một nhóm sản phẩm"),
        helpText: t("Nhóm sản phẩm cho sản phẩm")
      },
      {
        name: "customerId",
        label: t("Nhà cung cấp"),
        ohtype: Product.type === Constants.PRODUCT_TYPES.id.merchandise ? "select" : null,
        options: dataSourceManufacturer,
        button: addCustomer,
        placeholder: t("Chọn một nhà cung cấp"),
        helpText: t("Nhà cung cấp cho sản phẩm")
      },
      {
        name: "barCode",
        label: t("Mã vạch"),
        ohtype: Product.type === Constants.PRODUCT_TYPES.id.merchandise ? "input" : null,
        placeholder: t("Vui lòng nhập hoặc scan mã vạch"),
        helpText: t("Mã vạch của sản phẩm")
      },
    ];

    const column2 = [
      {
        name: "unitId",
        label: t("ĐVT"),
        ohtype: "select",
        validation: "required",
        message: t("Vui lòng chọn đơn vị tính"),
        button: addUnit,
        options: dataSourcePUnit,
        placeholder: t("Chọn một đơn vị tính"),
        helpText: t("Đơn vị tính cho sản phẩm")
      },
      Product.type === Constants.PRODUCT_TYPES.id.merchandise ?
      {
        name: "costUnitPrice",
        label: t("Giá vốn"),
        ohtype: "input-number",
        isDecimal: false,
        isNegative: false,
        disabled: isEdit,
        helpText: t("Giá vốn dùng để tính lợi nhuận cho sản phẩm (sẽ tự động thay đổi khi nhập hàng)")
      } : {},
      {
        name: "saleUnitPrice",
        label: t("Giá bán"),
        ohtype: "input-number",
        isDecimal: false,
        isNegative: false,
        helpText: t("Giá bán cho sản phẩm")
      },
      listStock.length > 1 && Product.type === Constants.PRODUCT_TYPES.id.merchandise ?
      {
        customType: {
          render: <OhForm
          key = {"ohform-select-stock"}
          title={t("")}
          totalColumns={2}
          defaultFormData={{...Product, name: nameLanguage }}
          onRef={ref => (this.ohFormRefStock = ref)}
          labelRow={41.5}
          style={{width: '100.6%'}}
          columns={[
              [{
                name: "stockId",
                label: t("Kho"),
                ohtype: "select",
                validation: "required",
                options: listStock,
                message: t("Vui lòng chọn kho"),
                placeholder: t("Chọn một kho"),
                style: {width: '120%'},
                className: "product-form",
                tooltipClassName: "stock-tooltip"
              }],
              [{
                name: "stockQuantityCurrent",
                label: t("Tồn kho"),
                ohtype: "input-number",
                isNegative: false,
                helpText: t("Số lượng tồn kho của sản phẩm"),
                style: window.matchMedia("(max-width: 575)").matches ? {float: 'right'} : null,
              }]
          ]}
          onChange={value => {
            this.onChange(value, listStock);
          }}
          validator={this.validator}
        />
        }
      } :
      {
        name: "stockQuantityCurrent",
        label: t("Tồn kho"),
        ohtype: Product.type === Constants.PRODUCT_TYPES.id.merchandise ? "input-number": null,
        isNegative: false,
        helpText: t("Số lượng tồn kho của sản phẩm"),
      },
      {
        name: "stockMin",
        label: t("TK tối thiểu"),
        ohtype: Product.type === Constants.PRODUCT_TYPES.id.merchandise ? "input-number": null,
        isNegative: false,
        helpText: t("Số lượng tồn kho tối thiểu")
      },
      {
        name: "maxDiscount",
        label: t("Chiết khấu tối đa"),
        ohtype: "input-number",
        helpText: t("Tính theo phần trăm"),
        max: Constants.NUMBER_LENGTH.PERCENT
      }
    ];

    const columns = [column1, column2];

    const uploadButton = (
      <div>
        <div style={{ display: "block", fontSize: "smaller" }}>
          <Icon type="plus" />
          {t("Thêm ảnh")}
        </div>
      </div>
    );
    const props = {
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }));
        return false;
      },
      fileList
    };

    return (
      <div style={{ marginTop: 20 }}>
        {this.state.notification}
        {this.state.redirect}

        <ProductTypeForm
          type={"add"}
          visible={this.state.visibleAddProductType}
          title={t("Thêm nhóm sản phẩm")}
          onChangeVisible={(visible, productTypeId) => {
            this.setState({
              visibleAddProductType: visible
            })

            if (productTypeId) {
              this.setState({
                Product: {
                  ...Product,
                  productTypeId: productTypeId.id
                },
                dataSourcePType: [...this.state.dataSourcePType, productTypeId ]
              })
            }
          }}
        />
        <AddProductUnit
          type={"add"}
          visible={this.state.visibleAddProductUnit}
          title={t('Tạo đơn vị tính')}
          onChangeVisible={(visible, productUnit) => {
            this.setState({
              visibleAddProductUnit: visible
            })

            if (productUnit) {
              this.setState({
                Product: {
                  ...Product,
                  unitId: productUnit.id
                },
                dataSourcePUnit: [...this.state.dataSourcePUnit, productUnit]
              })
            }
          }}
        />
        <ModalCreateCustomer
          type={"add"}
          visible={this.state.visibleAddCustomer}
          title={t('Tạo nhà cung cấp')}
          customerType = {Constants.CUSTOMER_TYPE.TYPE_SUPPLIER}
          onChangeVisible={(visible, customer) => {
            this.setState({
              visibleAddCustomer: visible
            });
            if (customer) {
              this.setState(
                {
                  Product: {
                    ...Product,
                    customerId: customer.id
                  },
                  dataSourceCustomer: [...this.state.dataSourceCustomer, customer]
                });
            }
          }}
        />
      {
        this.state.visibleChangeStock ?
          <ModalChangeStock
            visibleChangeStock = {this.state.visibleChangeStock}
            changedRecord = {this.state.changedRecord}
            onChangeVisible = {(visible) => {
              this.setState({
                visibleChangeStock: visible
              }, () =>  this.getData(this.state.changedRecord.id, this.state.Product.stockId))
            }}
          /> : null
      }

        <Card>
          <CardBody>
          <Spin spinning={this.state.loading}>

            <GridContainer>

              <GridItem xs={12} sm={12} md={12} lg={12}>
              
                <CardBody>
                  <Tabs onTabClick={(key)=> this.onTab(key)} activeKey = {this.state.activeKey} >
                    <TabPane tab={t("Thông tin")} key="1">
                      <OhForm
                        title={t("")}
                        totalColumns={2}
                        defaultFormData={{...Product, name: nameLanguage }}
                        onRef={ref => (this.ohFormRef = ref)}
                        columns={columns}
                        onChange={value => {
                          this.onChange(value, listStock);
                        }}
                        validator={this.validator}
                      />

                      <GridContainer xs={12} sm={12} style={{ marginTop: "-30px", bottom: 0, padding: 0 }}>
                        <GridItem xs={12} sm={11}>
                          <GridContainer xs={12} sm={12}>
                            <GridItem xs={2}></GridItem>
                            <GridItem xs={10}>
                              <Upload
                                {...props}
                                listType="picture-card"
                                onChange={this.handleChange}
                                multiple={true}
                                accept=".jpg,.jpeg,.png,.svg,.svgz,.gif"
                                onRemove={this.removeImage}
                                onDownload={file => this.downloadImage(file)}
                              >
                                {fileList.length >= 5 ? null : uploadButton}
                              </Upload>
                            </GridItem>
                            {this.state.MessageError ? (
                              <GridItem xs={12} sm={12} md={12} lg={12}>
                                <div
                                  className="ant-form-explain"
                                  style={{
                                    color: "red",
                                    fontSize: "11px",
                                    textAlign: "center"
                                  }}
                                >
                                  {this.state.MessageError}
                                </div>
                              </GridItem>
                            ) : null}
                          </GridContainer>
                        </GridItem>
                      </GridContainer>
                    </TabPane>
                    <TabPane tab={t("Mô tả")} key="2">
                      <GridContainer style={{ marginLeft: "12px", width: "98%", marginBottom: "10px" }}>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <TinyEditor
                            content={Product.description ? Product.description : ""}
                            height={window.innerHeight < 900 ? "calc(100vh - 70vh)" : null}
                            id="task_editor"
                            onEditorChange={content => this.setState({ Product: { ...Product, description: content } })}
                          />
                        </GridItem>
                      </GridContainer>
                    </TabPane>
                    { parseInt(this.props.Manufacture) === Constants.MANUFACTURE_OPTIONS.ON 
                    && (permissionsUser.manufacture_product >= type_permission ||  permissionsUser.manufacture_ware_house >= type_permission || permissionsUser.manufacture_card >= type_permission)
                    && Product.type === Constants.PRODUCT_TYPES.id.merchandise ? 
                    <TabPane tab={t("Định mức nguyên vật liệu")} key="3">
                      <GridContainer style={{ marginLeft: "10px", width: "98%", marginBottom: "10px" }}>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <ManufacturingFormula
                            productId={Product.id}
                            ProductsForm = {this.state.ProductFormula}
                            sendProductsData={ProductsForm => {
                              this.setState({ ProductFormula: ProductsForm });
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </TabPane> : null }
                    
                  </Tabs>
                  {Language_Product >= type_permission ? 
                    <Select
                    labelInValue
                    className="select-change-language"
                    value={{key: language}}
                    onChange={this.handleChangeLanguage}
                  >
                    {
                      NAME_FLAG.map(item => (
                        <Select.Option key = {item.key} value={item.key} style={{display: item.key !== language ? undefined : "none" }}>
                          <img
                           src={flagImages[item.key.toUpperCase()]}
                           style={{ width: 30, height: 20, marginRight: '10px' }}
                          />
                        </Select.Option>
                      ))
                    }
                  </Select>: null }
                </CardBody>
              </GridItem>
            </GridContainer>
            <div style={{ marginTop: "-40px", marginRight: "30px",textAlign: "right" }}>
              <OhToolbar
                right={[
                  {
                    type: "button",
                    label: t("Lưu"),
                    onClick: e => this.handleSubmit(e),
                    icon: <MdSave/>,
                    simple: true,
                    disabled: isSubmit,
                    typeButton: "add",
                    permission: {
                      name: Constants.PERMISSION_NAME.PRODUCT,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }
                  },
                  {
                    type: (this.state.activeKey === "3" || !isEdit) ? null :"button",
                    label: t("Chuyển đổi"),
                    onClick: () => this.openChangeStockModal(Product),
                    icon: <MdCached/>,
                    simple: true,
                    typeButton: "add",
                    permission: {
                      name: Constants.PERMISSION_NAME.PRODUCT,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }
                  },
                  {
                    type: "link",
                    label: t("Thoát"),
                    linkTo: "/admin/product/",
                    icon: <MdCancel />,
                    typeButton: "exit",
                    simple: true,
                  }
                ]}
              />
            </div>
            </Spin>
          </CardBody>
        </Card>
      </div>
    );
  }
}

ProductForm.propTypes = propTypes;

export default connect(state => {
  return {
    permissionsUser: state.userReducer.currentUser.permissions,
    Language_Product: state.reducer_user.Language_Product,
    languageCurrent: state.languageReducer.language,
    Manufacture: state.reducer_user.Manufacture,
    branchId: state.branchReducer.branchId,
    stockList: state.stockListReducer.stockList,
    productTypes: state.productTypeReducer.productTypes,
    productUnits: state.productUnitReducer.productUnits,
    suppliers: state.supplierListReducer.suppliers,
    productList: state.productListReducer.products
  };
}) (withTranslation("translations")(ProductForm));