import React, { Component } from 'react';
import ProductList from './../../components/ProductList/ProductList';
import ProductItem from './../../components/ProductItem/ProductItem';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from "./../../components/Pagination";

import { actFetchProductsRequest, actDeleteProductRequest } from './../../actions/index';


class ProductListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalRecords: "",
            totalPages: "",
            pageLimit: "",
            currentPage: "",
            startIndex: "",
            endIndex: ""
        }
    }





    componentDidMount() {

        this.setState({
            totalRecords: this.props.products.length
        });
        this.props.fetchAllProducts();

        // callApi('products','GET',null).then(res =>{console.log(res);
        //         this.setState({
        //             products: res.data
        //         })
        //     })





        // axios({
        //     method: 'GET',
        //     url: 'http://localhost:3000/products',
        //     data: null
        //     })
        //     .then(res =>{console.log(res);
        //         this.setState({
        //             products: res.data
        //         })
        //     })
        //     .catch(err=>{
        //         console.log(err);

        //     })



    }


    onChangePage = data => {
        this.setState({
            pageLimit: data.pageLimit,
            totalPages: data.totalPages,
            currentPage: data.page,
            startIndex: data.startIndex,
            endIndex: data.endIndex
        });
    };


    showProducts = products => {
        var result = null;
        if (products.length > 0) {
            result = products.map((product, index) => {
                return <ProductItem key={index} product={product} index={index} onDelete={this.onDelete} />;
            });
        }
        return result;
    };

    onDelete = (id) => {
        this.props.onDeleteProduct(id);
    }

    render() {

        var { products } = this.props;
        // var products=[];

        var {
            totalPages,
            currentPage,
            pageLimit,
            startIndex,
            endIndex
        } = this.state;
        var rowsPerPage = [];

        rowsPerPage = products.slice(startIndex, endIndex + 1);
        console.log(products.length)
        return (
            <div>
                <div className="col-xs-3 d-flex">
                    <div >Hiển thị số sản phẩm / trang</div>
                    <select
                   className="form-control"
                  value={pageLimit}
                  onChange={e =>
                    this.setState({ pageLimit: parseInt(e.target.value) })
                  }
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                </div>

                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <Link to="/product/add" className="btn btn-info mb-10"  style={{marginTop:10}} >
                        Thêm Sản Phẩm
                </Link>


                    <ProductList>
                        {/* {this.showProducts(products)} */}
                        {this.showProducts(rowsPerPage)}
                    </ProductList>
                    <div className="box_pagination">

                        <div className="row">
                            <div className="col-xs-12 box_pagination_info text-right">
                                <p>
                                    {products.length} Sản phẩm | Trang {currentPage}/{totalPages}
                                </p>
                            </div>
                            <div className="col-xs-12 text-center">
                                <Pagination
                                    totalRecords={products.length}
                                    pageLimit={pageLimit || 5}
                                    initialPage={1}
                                    pagesToShow={6}
                                    onChangePage={this.onChangePage}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                </div>
        );
    }

                    //     showProducts(products) {
                    //         var result = null;
                    //         if (products.length > 0) {
                    //             result = products.map((product, index) => {
                    //                 return (
                    //                     <ProductItem
                    //                         key={index}
                    //                         product={product}
                    //                         index={index}
                    //                         onDelete={this.onDelete}
                    //                     />
                    //                 );
                    //             });
                    //         }
                    //         return result;
                    //     }

                    }

const mapStateToProps = state => {
    return {
                    products: state.products
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
                    fetchAllProducts: () => {
                    dispatch(actFetchProductsRequest());
        },
        onDeleteProduct: (id) => {
                    dispatch(actDeleteProductRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage);
