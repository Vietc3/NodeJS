import React, { Component } from 'react';
// import Pagination from "react-js-pagination";t


class ProductList extends Component {
    



    //   componentDidMount() {
    //     // this.props.fetchAllProducts();
    //     // this.setState({
    //     //   totalRecords: this.props.children.length
    //     // });
    //     console.log(this.props.children);
        
    //   }
   




    render() {

        console.log(this.props.children);
        
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3 className="panel-title">Danh Sách Sản Phẩm</h3>
                </div>
                <div className="panel-body">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ProductList;
