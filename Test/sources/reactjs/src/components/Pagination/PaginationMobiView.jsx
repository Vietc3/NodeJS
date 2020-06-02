import React from 'react';

import { Select } from 'antd';
import PropTypes from 'prop-types';
import GridItem from 'components/Grid/GridItem';
import GridContainer from "components/Grid/GridContainer.jsx";
import { withTranslation } from 'react-i18next'

const propTypes = {
    items: PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number,
    refresh: PropTypes.bool
}

const defaultProps = {
    initialPage: 1,
}

const { Option } = Select;

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pager: {}, pageSize:0, pageLengthMenu:[ 5, 10, 20, 40, 50], changePage:false };
    }

    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.items && this.props.items.length) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
        if (this.props.refresh === true) {
            this.setPage(this.props.initialPage);
            this.props.onRefresh(false);
        }
        if (this.state.changePage)
        {
            this.setPage(this.props.initialPage);
            this.setState({changePage:false})
        }
    }

    setPage(page) {
        var { items } = this.props;
        var pageSize=this.state.pageSize;
        var pager = this.state.pager;

        if(items.length)
            pager = this.getPager(items.length, page, pageSize);
        
        if (page < 1 || page > pager.totalPages) {
            return;
        }
        // get new pager object for specified page
        // pager = this.getPager(items.length, page, pageSize);

        // get new page of items from items array
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);        

        // update state
        this.setState({ pager: pager });

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }
    handleChangePage=(pgSize)=> {
        // console.log(`selected ${pgSize}`);
        this.setState({
            pageSize:pgSize,
            changePage:true
        });
        // this.props.pageSize(pageSize);
      }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 5;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 3) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 2) {
                startPage = 1;
                endPage = 3;
            } else if (currentPage + 1 >= totalPages) {
                startPage = totalPages - 2;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            // pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        const { t } = this.props;
        var pager = this.state.pager;

        return (
                <GridContainer justify = "center" >
                    <GridItem sm={6} md={6} style={{margin: "0px 0px 0px -10px", paddingRight:"-10px" }} >
                        <ul className="pagination" style={{ float:"right", textAlign:"right"}}>
                            <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                                <a onClick={() => this.setPage(1)}>{"<<"}</a>
                            </li>
                            <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                                <a onClick={() => this.setPage(pager.currentPage - 1)}>{"<"}</a>
                            </li>
                            {pager.pages ? pager.pages.map((page, index) =>
                                <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                                    <a onClick={() => this.setPage(page)}>{page}</a>
                                </li>
                            ) : null }
                            <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                                <a onClick={() => this.setPage(pager.currentPage + 1)}>{">"}</a>
                            </li>
                            <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                                <a onClick={() => this.setPage(pager.totalPages)}>{">>"}</a>
                            </li>
                         </ul>
                    </GridItem>
                    <GridItem style={{float:"left", width:"110px",  margin: "-6px 0px 0px -20px"}} >
                        <Select defaultValue="5/Page" onChange={this.handleChangePage}>
                                    {this.state.pageLengthMenu.map((item, index) => <Option value={item}>{item}{t("/Page")}</Option>)}
                        </Select>
                    </GridItem>
                </GridContainer>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default withTranslation("translations")(Pagination);
