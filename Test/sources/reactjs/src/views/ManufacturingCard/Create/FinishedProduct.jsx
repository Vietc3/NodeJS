import React, { Component } from 'react';
import { connect } from "react-redux"
import { withTranslation } from "react-i18next";
import { notifyError } from "components/Oh/OhUtils";
import OhTable from 'components/Oh/OhTable';
import { Container, Row } from "react-grid-system";
import FormLabel from "@material-ui/core/FormLabel";
import OhAutoComplete from 'components/Oh/OhAutoComplete';
import OhNumberInput from 'components/Oh/OhNumberInput';
import ProductService from 'services/ProductService';
import ProductUnitService from 'services/ProductUnitService';
import Constants from 'variables/Constants/';
import ExtendFunction from "lib/ExtendFunction";
import ModalClickGroup from 'views/ProductType/components/ModalClickGroup';
import _ from "lodash";
import { MdSearch } from 'react-icons/md';
import { trans } from "lib/ExtendFunction";

class FinishedProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finishedProducts: [],
      materials: [],
      error: null,
      Products: [],
      searchedProducts: [],
      finishedProductsDatabase: [],
      newMaterials: [],
      isVisible: false,
      loadingMaterials: false,
      propMaterial: []
    };
    this.ohFormRef = null;
    this.getFormularAllProducts = _.debounce(this.getFormularAllProducts, Constants.UPDATE_TIME_OUT);
    this.editMaterials = {};
  }

  componentDidUpdate = (prevProps, prevState) => {    
    if (this.props.finishedProducts !== prevProps.finishedProducts && this.props.finishedProducts.length > 0){
      this.setState({finishedProducts: this.props.finishedProducts}, this.props.isEdit ? null : (() => this.getFormularAllProducts(this.state.finishedProducts)))
    }

    if (this.props.materials !== prevProps.materials && this.props.cardId && this.props.materials.length > 0){
      this.getEditMaterials(this.props.materials);
      this.setState({
        propMaterial: this.props.materials
      })
    }
  }

  getData = async () => {
    try {
      let getFinishedProducts = await ProductService.getProductList({
        filter: { category: 1 },
        select: ["id", "code", "name", "unitId", "createdAt"]
      });
      if (getFinishedProducts.status) {
        let products = getFinishedProducts.data;
        products.map((item) => item.quantity = 0)
        this.setState({
          finishedProductsDatabase: products,
          finishedProducts: products
        }, () => {
          this.getQuantityProducts(products, this.props.finishedProducts);
          if(this.props.isGetMaterialFormular){
            this.getFormularAllProducts(this.props.finishedProducts);
          }
        })
      }
      else throw getFinishedProducts.error;
    }
    catch (error) {
      if (typeof error === "string") notifyError(error)
    }
  }

  onClickGroupProduct = async productTypeId => {
    const {t} = this.props;
    try {
      let getFinishedProducts = await ProductService.getProductList({
        filter: { 
          type: Constants.PRODUCT_TYPES.id.merchandise,
          productTypeId,
          category: 1          
        },
        select: ["id", "code", "name", "unitId", "createdAt", "unitId.name"]
      })

      if (getFinishedProducts.status) {
        if ( getFinishedProducts.data.length > 0 ) {
          let products = getFinishedProducts.data;
          if(this.state.finishedProductsDatabase.length === 0){
            products.map((item) => item.quantity = 0);
            products = products.concat(this.state.finishedProducts)
            this.setState({
              finishedProductsDatabase: products,
              finishedProducts: products
            }, () => {
              this.getQuantityProducts(products, this.state.finishedProducts);
              this.getFormularAllProducts(this.state.finishedProducts);
            })
          }
          else{
            products.map((item) => {
              this.addProduct(item)
              return item;
            })
          }

        } else notifyError(t("Không có thành phẩm trong nhóm này"))      
      } else throw getFinishedProducts.error
    }
    catch(error){
      notifyError(t("Lấy thành phẩm theo nhóm sản phẩm bị lỗi"))
    }
  }

  addProduct = (product) => {
    let id = Number(product.id);
    let { finishedProducts } = this.state;
    let index = finishedProducts.findIndex(item => item.id === id)

    if (index === -1) {
      let newProduct = {
        ...product,
        productId: id,  
        quantity: 0,
      }
      finishedProducts.push(newProduct);
      this.setState({
        finishedProducts,
      })
    }
  }

  //hàm lấy nguyên vật liệu cho tất cả các thành phẩm (dành cho từ menu Thành phẩm chuyển sang)
  getFormularAllProducts = async (finishedProducts) => {
    let dataMaterials = [];
    let dataNewMaterials = [...this.state.newMaterials];
    let getProductUnits = await ProductUnitService.getProductUnits();
    if(finishedProducts.length > 0) {
    for (let i in finishedProducts) {
      try {
          let materialOfOneProduct = await ProductService.getProductFormula(finishedProducts[i].id);          
          //nếu có thành phẩm có nguyên vật liệu thì thêm vào danh sách
          if (materialOfOneProduct.status && materialOfOneProduct.data.length > 0) {
            let dataToAdd = [];
            materialOfOneProduct.data.forEach((item) => {
              let material = {
                code: item.materialId.code,
                name: item.materialId.name,
                quantity: item.quantity * finishedProducts[i].quantity,
                id: item.materialId.id,
                manufacturingQuantity: item.materialId.manufacturingQuantity,
              }

              getProductUnits.data.forEach(unit => {
                if (item.materialId.unitId === unit.id) {
                  material.unit = unit.name;
                  return;
                }
              })
              dataToAdd.push(material)
            });

            //nếu danh sách nguyên vật liệu ban đầu rỗng thì thêm trực tiếp các nguyên vật liệu cần
            if (dataMaterials.length === 0) {
              dataMaterials = dataToAdd;
            }
            else {

              for (let i in dataToAdd) {
                //tìm kiếm nguyên vật liệu thêm vào đã có sẵn chưa
                let foundMaterial = false;
                for (let j in dataMaterials) {
                  //nếu có rồi thì thêm số lượng
                  if (dataToAdd[i].id === dataMaterials[j].id) {
                    foundMaterial = true;
                    dataMaterials[j].quantity += dataToAdd[i].quantity;
                    break;
                  }
                }
                //nếu không tức là nguyên vật liệu mới thì thêm mới
                if (!foundMaterial) {
                  dataMaterials.push(dataToAdd[i]);
                }
              }
            }
          }
          else throw materialOfOneProduct.error;
      }
      catch (error) {
        if (typeof error === "string") notifyError(error)
      }

      if (dataNewMaterials.length > 0) {
        for(let i in dataNewMaterials){
          let foundNewMaterial = false;
          for (let j in dataMaterials) { 
            if (dataNewMaterials[i].id === dataMaterials[j].id) {
              foundNewMaterial = true;
              break;
            }
          }
          if (!foundNewMaterial) {
            dataMaterials.push(dataNewMaterials[i]);
          }
        }
      }
    }}
    else {
      dataMaterials = dataNewMaterials;
    }
    let filterFinishedProducts = this.filterZeroQuantity(finishedProducts);
    let oldMaterials = this.state.propMaterial;
    
    let newMaterials = [];
      
    //lọc nguyên vật liệu mới
    for(let oldItem of oldMaterials){
      let foundNewMaterial = dataMaterials.findIndex(item => item.id === oldItem.id);
      if(foundNewMaterial === -1){
        newMaterials.push(oldItem);
      }
    }

    dataMaterials = dataMaterials.concat(newMaterials);
    dataMaterials = this.filterZeroQuantity(dataMaterials);
    
    this.setState({
      materials: dataMaterials,
      loadingMaterials: false
    }, () => {
      this.props.onChangeLoading(false)
      this.props.onChangeMaterial(dataMaterials)
      this.props.onChangeQuantityProducts(filterFinishedProducts);

      if(!this.props.cardId)
        this.checkManufacturingQuantity();
    })
  }

  getQuantityProducts = (products, finishedProducts) => {
    if (finishedProducts) {
      for (let i in products) {
        for (let j in finishedProducts){
          if (products[i].id === finishedProducts[j].id){
              products[i].quantity = finishedProducts[j].quantity;
            break;
          }
        }
      }
    }
    this.setState({ finishedProducts: products })
  }

  getEditMaterials = (materials) => {
    this.editMaterials = {};
    materials.map(item => this.editMaterials[item.id] = parseFloat(item.quantity) || 0)
    this.setState({ materials: materials })
  }

  getColunms = () => {
    const { t, readOnly } = this.props;

    let columns = [
      {
        title: t("Mã"),
        align: "left",
        width: "20%",
        dataIndex: "code",
        key: "code",
      },
      {
        title: t("Tên sản phẩm"),
        align: "left",
        width: "43%",
        dataIndex: "name",
        key: "name",
        render: value => trans(value)
      },
      {
        title: t("ĐVT"),
        align: "left",
        width: "18%",
        dataIndex: "unitId.name",
        key: "unit",
      },
      {
        title: t("SL sản xuất"),
        align: "right",
        dataIndex: "quantity",
        width: "18%",
        type: "number",
        key: "quantity",
        render: (value, record) => {
          return <OhNumberInput
            disabled={readOnly}
            defaultValue={record.quantity}
            isNegative={false}
            onBlur= {(e) => {
              this.changeQuantityProduct(e.target.value, record.id)
            }}
            
            onKeyDown={(e) => {
              if (e.keyCode === 13){
                this.changeQuantityProduct(e.target.value, record.id)
              }
            }}
          />
        }
      },
    ];

    return columns
  }

  changeQuantityProduct = (value, id) => {
    let val = 0;
                    
    if (isNaN(ExtendFunction.UndoFormatNumber(value)) === false) {
      val = parseFloat(ExtendFunction.UndoFormatNumber(value));
    }
    if (value === "")
    val = 0;
    this.onChangeQuantityProduct(val, id)
  }

  onChangeQuantityProduct = (value, id) => {
    let { finishedProducts } = this.state;
    id = Number(id);
    let foundProduct = finishedProducts.findIndex(item => item.id === id)
    if (foundProduct !== -1) {
      finishedProducts[foundProduct].quantity = value ? parseFloat(value) : 0;
      this.setState({
        finishedProducts,
        materials: [],
        loadingMaterials: true
      }, () => {
        this.props.onChangeLoading(true)
        this.getFormularAllProducts(finishedProducts)
      })      
    }
  }

  filterZeroQuantity = (fullMaterials) => {
    let materials = [...fullMaterials]
    let deletePositions = [];
    materials.forEach((item) => {
      if (item.quantity <= 0 ) {
        let position = materials.indexOf(item);
        deletePositions.push(position)
      }
    })
    for (let i = deletePositions.length - 1; i >= 0; i--) {
      materials.splice(deletePositions[i], 1)
    }
    return materials;
  }

  checkManufacturingQuantity = () => {
    const {t} = this.props;
    let dataMaterial = [...this.state.materials];
    if (dataMaterial.length > 0) {
      dataMaterial.forEach((item) => {
        if (item.manufacturingQuantity < item.quantity) {
          this.setState({
            error: t("Tồn kho sản xuất của nguyên vật liệu không đủ để sản xuất")
          }, () => this.props.showError(this.state.error))
        }
        else {
          this.setState({
            error: null
          }, () => this.props.showError(this.state.error))
        }
      })
    }
  }

  removeMaterial = record => {
    let { materials, newMaterials, propMaterial } = this.state;
    let dataMaterials = materials.slice();
    let dataNewMaterials = newMaterials.slice();
    let dataPropMaterial = propMaterial.slice();

    let index = dataMaterials.findIndex(item => item.id === record.id);

    if (index > -1) {
      dataMaterials.splice(index, 1);
    }

    let indexNew = newMaterials.findIndex(item => item.id === record.id);

    if (indexNew > -1) {
      dataNewMaterials.splice(indexNew, 1);
    }

    let indexProp = propMaterial.findIndex(item => item.id === record.id);

    if (indexProp > -1) {
      dataNewMaterials.splice(indexProp, 1);
    }

    this.setState({
      materials: dataMaterials,
      newMaterials: dataNewMaterials,
      propMaterial: dataNewMaterials
    }, () => {
      this.props.onChangeMaterial(dataMaterials);
      if (!this.props.cardId)
        this.checkManufacturingQuantity();
    });
  };

  sendMaterial = () => {
    let materials = this.filterZeroQuantity(this.state.materials)
    this.setState({materials}, () => this.props.onChangeMaterial(materials))
  }

  getColunmMaterials = () => {
    const { t, readOnly } = this.props;

    let columns = [
      {
        title: t("Mã"),
        align: "left",
        dataIndex: "code",
        key: "code",
        width: "17%",
      },
      {
        title: t("Tên sản phẩm"),
        align: "left",
        dataIndex: "name",
        key: "name",
        width: "38%",
        render: value => trans(value)
      },
      {
        title: t("ĐVT"),
        align: "left",
        dataIndex: "unit",
        key: "unit",
        width: "13%",
      },
      {
        title: t("SL trong kho sx"),
        align: "right",
        width: "16%",
        dataIndex: "manufacturingQuantity",
        key: "manufacturingQuantity",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(value)
        }
      },
      {
        title: t("SL cần để sx"),
        align: "right",
        dataIndex: "quantity",
        width: "16%",
        type: "number",
        key: "quantity",
        render: (value, record) => {
          return <OhNumberInput
            disabled={readOnly}
            defaultValue={record.quantity}
            valueDecimal={100000}
            integer={20}
            isNegative={false}
            onChange={val => this.onChangeQuantityMaterial(val, record.id)}
            style={{ color: value > record.manufacturingQuantity + (this.editMaterials[record.id] || 0)  ? "red" : null }}
            onBlur= {() => this.sendMaterial()}
            
            onKeyDown={(e) => {
              if (e.keyCode === 13){
                this.sendMaterial();
              }
            }}
          />
        }
      },
    ];

    return columns
  }

  onChangeQuantityMaterial = (value, id) => {
    let { materials } = this.state;

    id = Number(id);

    let foundProduct = materials.findIndex(item => item.id === id)

    if (foundProduct !== -1) {
      materials[foundProduct].quantity = value;
      if (!this.props.cardId)
        this.checkManufacturingQuantity();
      this.setState({
        materials
      }, () => {
        this.props.onChangeMaterial(materials);
      })
    }
  }

  onSearchData = async value => {
    this.timeMaterial = new Date().getTime()
    let getProductList = await ProductService.getProductList({
      filter: { 
        type: Constants.PRODUCT_TYPES.id.merchandise,
        or: [{ name: { contains: value } }, { code: { contains: value } }],
        ["productstock.manufacturingQuantity"]: {'>': 0},
      },
      limit: value === "" ? 0 : Constants.LIMIT_AUTOCOMPLETE_SEARCH,
      select: ["id", "code", "name", "productstock.manufacturingQuantity", "createdAt", "unitId.name"],
      time: this.timeMaterial
    });

    if(getProductList.status) {

      if (getProductList.data.length > 0 && this.timeMaterial === getProductList.time)
        this.setState({ Products: getProductList.data });
      else this.setState({Products: []})

    }
  }

  onClickProduct = (id) => {
    id = Number(id);
    let { materials, Products, newMaterials } = this.state;
    let productFound = materials.find(item => item.id === id);
    if (productFound) {
      let index = materials.findIndex(item => item.id === productFound.id)

      if (index > -1) {
        materials[index].quantity += 1;
      }

      this.setState({
        materials,
      }, () => {
        this.checkManufacturingQuantity();
        this.props.onChangeMaterial(this.state.materials)
      })
    }
    else {
      productFound = Products.find(item => item.id === id);

      if (productFound) {
        let product = {
          key: materials.length + 1,
          id: id,
          code: productFound.code,
          name: productFound.name,
          unit: productFound.unitId.name,
          quantity: 1,
          manufacturingQuantity: productFound.manufacturingQuantity
        }

        this.setState({
          materials: [
            ...materials,
            product
          ],
          newMaterials: [
            ...newMaterials,
            product
          ],
        }, () => {
          this.checkManufacturingQuantity();
          this.props.onChangeMaterial(this.state.materials)
        })
      }
    }
  }
  
  onSearchProduct = async value => {
    this.timeProduct = new Date().getTime()
    let getProductList = await ProductService.getProductList({
      filter: {
        type: Constants.PRODUCT_TYPES.id.merchandise,
        or: [{ name: { contains: value } }, { code: { contains: value } }] ,
        category: Constants.PRODUCT_CATEGORY_TYPE.FINISHED,
        stoppedAt: 0
      }, 
      limit: value === "" ? 0 : Constants.LIMIT_AUTOCOMPLETE_SEARCH,
      select: ["id", "code", "name", "productprice.costUnitPrice", "productprice.lastImportPrice", 
      "productprice.saleUnitPrice", "productstock.stockQuantity", "productstock.manufacturingQuantity", "createdAt", "unitId.name"],
      time: this.timeProduct
    });

    if ( getProductList.status && getProductList.time === this.timeProduct) {
      this.setState({ searchedProducts: getProductList.data });
    }
  }
  
  onClickSearchedProduct = (id) => {
    id = Number(id);
    let { searchedProducts, finishedProducts } = this.state;
    let productFound = searchedProducts.find(item => item.id === id);

    if (productFound) {
      let index = finishedProducts.findIndex(item => item.id === productFound.id)

      if (index > -1) {
        this.onChangeQuantityProduct(Number(finishedProducts[index].quantity) + 1, productFound.id);
      } else{
        this.addProductToList([productFound]);
      }
    }
  }
  
  addProductToList = (products) => {
    let {finishedProducts} = this.state;
    for(let product of products) {
      let newProduct = {
        ...product,
        productId: product.id,  
        quantity: product.quantity !== undefined ? product.quantity : 1,
      }
      
      finishedProducts.push(newProduct);
    }
    
    this.setState({
      finishedProducts,
      loadingMaterials: true
    }, () => {
      this.props.onChangeLoading(true)
      this.props.onChangeQuantityProducts(this.state.finishedProducts)
      this.getFormularAllProducts(this.state.finishedProducts)
    })
  }
  
  removeProduct = record => {
    let { finishedProducts } = this.state;
    let newMaterials = finishedProducts.slice();

    let index = newMaterials.findIndex(item => item.id === record.id);

    if (index > -1) {
      newMaterials.splice(index, 1);
    }

    this.setState({
      finishedProducts: newMaterials
    }, () => {
      this.props.onChangeQuantityProducts(newMaterials);
      this.getFormularAllProducts(this.state.finishedProducts)
      if (!this.props.cardId)
        this.checkManufacturingQuantity();
    });
  };

  render() {
    const { finishedProducts, materials, Products, searchedProducts, isCancel, isEdit, loadingMaterials } = this.state;
    const { t, readOnly } = this.props;

    return (
      <Container className={"react-grid-system-container"}>
        <ModalClickGroup
          visible={this.state.isVisible}
          transferData={(isVisible, data) => {
            this.setState({ isVisible });
            this.onClickGroupProduct(data.productTypeId)
          }}
          handleCloseModal={isVisible => this.setState({ isVisible })} 
        />
        <Row className={"oh-row"}>
          <FormLabel className="ProductFormAddEdit">
            <b className="HeaderForm">{t("Thành phẩm sản xuất")}</b>
          </FormLabel>
        </Row>
        <OhAutoComplete 
          dataSelects={searchedProducts} 
          onSearchData={value => this.onSearchProduct(value)}
          placeholder={t("Tìm thành phẩm theo mã hoặc tên")}
          onClickValue={id => this.onClickSearchedProduct(id)}
          disabled={readOnly}
          isButton
          prefix={<MdSearch/>}  
          onClick={() => this.setState({isVisible: true})} 
        />
        <OhTable
          id="finished-products"
          columns={this.getColunms()}
          hasRowNumberColumn={true}
          hasRemoveColumn={(!isCancel || !isEdit)}
          onClickRemove={(value, record) => {
            this.removeProduct(record)
          }}
          dataSource={finishedProducts}
          disabled={readOnly}
          index={true}
          isBlur={true}
          emptyDescription={Constants.NO_PRODUCT}
          isNonePagination={true}
        />

        <Row className={"oh-row"}>
          <FormLabel className="ProductFormAddEdit">
            <b className="HeaderForm">{t("Nguyên vật liệu cần thiết")}</b>
          </FormLabel>
        </Row>
        <OhAutoComplete
          disabled={readOnly}
          dataSelects={Products}
          onSearchData={value => this.onSearchData(value)}
          placeholder={t("Thêm nguyên vật liệu hoặc sản phẩm theo mã hoặc tên")}
          onClickValue={id => this.onClickProduct(id)}
          autoFocus={false}
        />
        <OhTable
          loading={loadingMaterials}
          id="materials"
          columns={this.getColunmMaterials()}
          hasRowNumberColumn={true}
          hasRemoveColumn={!readOnly}
          onClickRemove={(value, record) => {
            this.removeMaterial(record)
          }}
          dataSource={materials}
          emptyDescription={Constants.NO_PRODUCT}
          isNonePagination={true}
        />
      </Container>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user
  };
})(withTranslation("translations")(FinishedProduct));