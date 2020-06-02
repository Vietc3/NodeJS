import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import { withTranslation } from 'react-i18next';
import FinishedEstimatesService from 'services/FinishedEstimatesService.js';
import ExtendFunction, { trans } from 'lib/ExtendFunction.js';
import { notifyError } from 'components/Oh/OhUtils.js';
import OhTable from 'components/Oh/OhTable.jsx';



class InforEstimatesReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id || JSON.stringify(this.props.selectStockId) !== JSON.stringify(prevProps.selectStockId)) {
      this.getData();
    }
  }

  componentWillMount() {
    this.getData();
  }

  async getData(){
    const { stock_lists, selectStockId, t } = this.props;
      
    let stocks = [];

    if (stock_lists.length) {
      stock_lists.map( item => stocks.push(item.id));
    }

    const query = {
      stockId: selectStockId.length === 0 ? stocks : selectStockId,
      id: this.props.id
    };

    let getExpandFinishedEstimates = await FinishedEstimatesService.getExpandFinishedEstimatesDate(query);

    if (getExpandFinishedEstimates.status) {
        this.setState({
            data: getExpandFinishedEstimates.data,
        })
    } else notifyError(t("Lỗi xử lý dữ liệu"))
  }

  render() {
    const { t } = this.props;
    const { data } = this.state;
      
    let columns1 = [
      {
        title: t('Mã'),
        align: 'left',
        width: '16%',
        dataIndex: 'code',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.code.localeCompare(b.code),
        key: "code",
        render: (value) => value
      },
      {
        title: t("NVL"),
        align: 'left',
        width: '40%',
        dataIndex: 'name',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) =>  trans(a.name, true).localeCompare(trans(b.name, true)),
        render: (value, record) => trans(value)

      },
      {
        title: t("ĐVT"),
        align: 'left',
        width: '12%',
        dataIndex: 'unitName',
        sorter: (a, b) =>  a.unitName.localeCompare(b.unitName),
        sortDirections: ["descend", "ascend"],
      },
      {
        title: t("Định mức sx"),
        align: 'right',
        width: 120,
        dataIndex: 'quantity',
        key: "quantity",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.quantity - b.quantity),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: t("Tồn kho"),
        align: 'right',
        width: 120,
        dataIndex: 'stockQuantity',
        key: "stockQuantity",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.stockQuantity - b.stockQuantity),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: t("Tồn kho sx"),
        align: 'right',
        width: 120,
        dataIndex: 'manufacturingQuantity',
        key: "manufacturingQuantity",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.manufacturingQuantity - b.manufacturingQuantity),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
    ];


    return (
      <div>
        <Fragment>
            <OhTable
                id={"finished-estimates-report-nvl" + this.props.id}
                columns={columns1}
                dataSource={data || []}
                isNonePagination={true} 
                isExpandable={false}
                hasCheckbox={false} 
                scrollToFirstRowOnChange={false}
            /> 
        </Fragment>
      </div>
    );
  }
}

InforEstimatesReport.propTypes = {
    classes: PropTypes.object.isRequired
  };
  
  export default (
    connect(function (state) {
      return {
        stockList: state.stockListReducer.stockList
      };
    })
  ) (
    withTranslation("translations")(
      withStyles(theme => ({
        ...regularFormsStyle
      }))(InforEstimatesReport)
    )
  );
  