import React from "react";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
// multilingual
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import Constants from 'variables/Constants/';
import "date-fns";
import productService from 'services/ProductService';
import NotificationError from "components/Notification/NotificationError.jsx";
import { notifyError } from "components/Oh/OhUtils";
import OhAutoComplete from 'components/Oh/OhAutoComplete';
import OhTable from 'components/Oh/OhTable';
import OhNumberInput from "components/Oh/OhNumberInput.jsx";
import { trans } from "lib/ExtendFunction";

class ManufacturingFormula extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      ProductsForm: [],
    };
  }

  componentDidMount = () => {
    if(this.props.productId)
      this.getData();
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { ProductsForm } = this.props;
    
    if (this.props.productId && ProductsForm && prevProps.ProductsForm.length !== ProductsForm.length) {
      this.getData();
    }
  }


  getData = () => { 
    let { ProductsForm } = this.props;
    this.setState({
      ProductsForm: ProductsForm
    }, () => this.sendData())
  }

  onClickProduct = (id) => {
    id = Number(id);
    let { products, ProductsForm } = this.state;
    let productFound = products.find(item => item.id === id);
    let existProduct = ProductsForm.find(item => item.productId === id);
    let product = {
      productId: id,
      productCode: productFound.code,
      productName: productFound.name,
      unit: productFound.unitId.name,
      category: productFound.category,
      stockQuantity: 1,
    }
    if (existProduct) {
      this.setState({
        ProductsForm
      })
    }
    else {
      this.setState({
        ProductsForm: [
          ...ProductsForm,
          product
        ],
        products: products,
      }, () => this.sendData())
    }
  }

  error = (mess) => {
    const { t } = this.props;
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={t(mess)} />
    })
  }

  sendData = () => {
    let { ProductsForm } = this.state;
    this.props.sendProductsData(ProductsForm)
  }

  onSearchProduct = async value => {
    let { t } = this.props;
    
    let filter = this.props.productId ? 
    { type: Constants.PRODUCT_TYPES.id.merchandise, or: [{ name: { contains: value } }, { code: { contains: value } }], and: [{ id: { "!=": [this.props.productId] } }] }
    : { or: [{ name: { contains: value } }, { code: { contains: value } }] };

    let getProductList = await productService.getProductList({
      filter: filter,
      limit: value === "" ? 0 : Constants.LIMIT_AUTOCOMPLETE_SEARCH
    });

    if (getProductList.status) {
      if (getProductList.data.length > 0)
        this.setState({ products: getProductList.data });
      else notifyError(t("Không có sản phẩm nào"))
    }
  };

  removeProduct = record => {
    let { ProductsForm } = this.state;
    let newProductList = ProductsForm.slice();

    let index = newProductList.findIndex(item => item.productId === record.productId);

    if (index > -1) {
      newProductList.splice(index, 1);
    }

    this.setState({
      ProductsForm: newProductList
    }, () => this.sendData());
  };

  render() {
    const { t } = this.props;
    const { products, ProductsForm } = this.state;
    
    let columns = [
      {
        title: t("Mã"),
        dataIndex: "productCode",
        key: "productCode",
        width: "15%",
        sorter: (a, b) => a.productCode.localeCompare(b.productCode),
        sortDirections: ["descend", "ascend"],
      },
      {
        title: t("Tên"),
        dataIndex: "productName",
        key: "productName",
        width: "40%",
        sorter: (a, b) => a.productName.localeCompare(b.productName),
        sortDirections: ["descend", "ascend"],
        render: value => trans(value) 
      },
      {
        title: t("Đơn vị"),
        dataIndex: "unit",
        key: "unit",
        width: "10%",
        sorter: (a, b) => a.unit.localeCompare(b.unit),
        sortDirections: ["descend", "ascend"],
      },
      {
        title: t("Số lượng"),
        dataIndex: "stockQuantity",
        key: "stockQuantity",
        width: "15%",
        align: "right",
        sorter: (a, b) => (a.stockQuantity - b.stockQuantity),
        sortDirections: ["descend", "ascend"],
        render: (value, record) => {
          return (
             <OhNumberInput 
              defaultValue={(record || {}).stockQuantity}
              onChange={e => {
                let products = ProductsForm;
                for (let item of products) {
                  if (item.productId === record.productId) {
                    if (isNaN(ExtendFunction.UndoFormatNumber(e)) === false) {
                      let value = ExtendFunction.UndoFormatNumber(e);
                      item.stockQuantity = value;
                    }
                  }
                }
                this.setState({ProductsForm: products})
              }}
              isNegative = {false}
              isDecimal= {true}
              valueDecimal={100000}
              onBlur={ async (e) => {
                  this.sendData()
              }}
              onKeyDown= { async (e) => {
                    if (e.keyCode === 13) {
                      this.sendData()
                  }
                }}
            />
          );
        },
      },
    ];

    return (
      <>
        {this.state.br}
        {this.state.brerror}
        <OhAutoComplete 
          dataSelects={products} 
          onSearchData={value => this.onSearchProduct(value)}
          placeholder={t(Constants.PLACEHOLDER_SEARCH_PRODUCT)}
          onClickValue={value => this.onClickProduct(value)}
        />
        
        <GridContainer>
          <GridItem xs={12} >
            <OhTable
              id='formula-table'
              className="formula-table"
              columns={columns}
              dataSource={ProductsForm}
              isNonePagination={true}
              
              hasRowNumberColumn={true}
              hasRemoveColumn={true}
              onClickRemove={(value, record) => this.removeProduct(record)}
            />
          </GridItem>
        </GridContainer>
      </>
    );
  }
}

export default withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle
  }))(ManufacturingFormula)
);