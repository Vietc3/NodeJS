import React, { Component } from 'react';
import ProductList from './../../components/ProductList/ProductList';
import ProductItem from './../../components/ProductItem/ProductItem';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actFetchProductsRequest, actDeleteProductRequest } from './../../actions/index';
import callApi from './../../utils/apiCaller';
class ProductListPage extends Component {

constructor(props){
    super(props);
    this.state={
        products: []
    }
}


    componentDidMount() {
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

    onDelete = (id) => {
        this.props.onDeleteProduct(id);
    }

    render() {

        var { products } = this.props;
        // var products=[];
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Link to="/product/add" className="btn btn-info mb-10">
                    Thêm Sản Phẩm
                </Link>
                <ProductList>
                    {this.showProducts(products)}
                </ProductList>
            </div>
        );
    }

    showProducts(products) {
        var result = null;
        if (products.length > 0) {
            result = products.map((product, index) => {
                return (
                    <ProductItem
                        key={index}
                        product={product}
                        index={index}
                        onDelete={this.onDelete}
                    />
                );
            });
        }
        return result;
    }

}

const mapStateToProps = state => {
    return {
        products: state.products
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllProducts : () => {
            dispatch(actFetchProductsRequest());
        },
        onDeleteProduct : (id) => {
            dispatch(actDeleteProductRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage);
