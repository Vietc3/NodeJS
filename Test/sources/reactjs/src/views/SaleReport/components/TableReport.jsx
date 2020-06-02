
import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import "date-fns";
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import OhTable from 'components/Oh/OhTable';
import ExtendFunction from "lib/ExtendFunction";
import Constants from "variables/Constants/";
import { trans } from "lib/ExtendFunction";


class TableReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSaleReport: [],
      brerror: null
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.data.length !== prevProps.data.length || JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data) ) {
      this.setData();
    }

    if (prevProps.options !== this.props.options) {
      this.setOption(this.props.options)
    }
  };

  setOption(options) {
    this.setState({options})
  }

  componentDidMount = () => {
    if ( this.props.data && this.props.data.length > 0 ) {
        this.setData();
    }
    if (this.props.options) this.setOption(this.props.options)
  };
  error = mess => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    });
  };

  setData = () => {
    let dataSource = this.props.data || [{}];
    this.setState({
      dataSaleReport: dataSource,
    });
    
  };

  render() {
    const { t } = this.props;
    const {  dataSaleReport, options  } = this.state;    

    let columns = [
     
        options === Constants.OPTIONS_SALE_REPORT.USER ?
       {
          title: t("Nhân viên"),
          dataIndex: "name",
          key: "name",
          width: "23%",
          align: "left",
          sorter: false,
          render: value => value ? value : "" ,
        } : options === Constants.OPTIONS_SALE_REPORT.CUSTOMER ?
        {
        title: t("Khách hàng"),
        dataIndex: "name",
        key: "name",
        width: "23%",
        align: "left",
        sorter: false,
        render: value => value ? value : "" ,
        } :
      {
        title: options === Constants.OPTIONS_SALE_REPORT.HOUR ? t("Giờ") :  options === Constants.OPTIONS_SALE_REPORT.DAY ? t("Ngày") :  options === Constants.OPTIONS_SALE_REPORT.MONTH ? t("Tháng") : t("Năm"),
        dataIndex: "time",
        key: "time",
        width: "23%",
        align: "left",
        sorter: false,
        render: value => {
          let split = options === Constants.OPTIONS_SALE_REPORT.HOUR ? value.split(" ") : null;
          if (split) {
            return <div className="ellipsis-not-span">
                    <span>{split[0] + ":00"}</span><br /> 
                    <span>{split[1]}</span>
                  </div>
          }
          else
            return (
              <div className="ellipsis-not-span">
                { value }
              </div>
            );
        }
      },
      {
        title: t("Đơn hàng"),
        dataIndex: "count",
        key: "count",
        width: "12%",
        align: "right",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },

      {
        title: t("Tiền hàng"),
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: "14%",
        align: "right",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Chiết khấu"),
        dataIndex: "discountAmount",
        key: "discountAmount",
        width: "12%",
        align: "right",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span" >
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Thuế"),
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: "12%",
        align: "right",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Trả hàng"),
        dataIndex: "returnAmount",
        key: "returnAmount",
        width: "12%",
        align: "right",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Doanh thu"),
        dataIndex: "finalAmount",
        key: "finalAmount",
        width: "15%",
        align: "right",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span" >
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Lợi nhuận"),
        dataIndex: "profitAmount",
        key: "profitAmount",
        width: "15%",
        align: "right",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span" >
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      }
    ];

    let columnProducts = [
     
      {
        title: t("Sản phẩm"),
        dataIndex: "productName",
        key: "productName",
        align: "left",
        width: "20%",
        sorter: false,
        render: value => trans(value) 
      },
      {
        title: t("Sl bán ra"),
        dataIndex: "quantity",
        key: "quantity",
        align: "right",
        sorter: false,
        width: "10%",
      },

      {
        title: t("Tiền hàng"),
        dataIndex: "totalAmount",
        key: "totalAmount",
        align: "right",
        width: "10%",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Chiết khấu"),
        dataIndex: "discountAmount",
        key: "discountAmount",
        align: "right",
        width: "10%",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Thuế"),
        dataIndex: "taxAmount",
        key: "taxAmount",
        align: "right",
        width: "10%",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Sl trả lại"),
        dataIndex: "returnQuantity",
        key: "returnQuantity",
        align: "right",
        width: "10%",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Tiền trả hàng"),
        dataIndex: "returnAmount",
        key: "returnAmount",
        align: "right",
        width: "10%",
        sorter: false,
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Doanh thu"),
        dataIndex: "finalAmount",
        key: "finalAmount",
        align: "right",
        width: "10%",
        sorter: false,
        render: (value,record)=> {
          return (
            <div className="ellipsis-not-span">
                {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Lợi nhuận"),
        dataIndex: "profitAmount",
        key: "profitAmount",
        align: "right",
        width: "10%",
        sorter: false,
        render: (value,record)=> {
          return (
            <div className="ellipsis-not-span">
                {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      }
      
    ];

    return (
      <>
        {this.state.brerror}
        <GridContainer style={{ width: "100%", margin: 0 }}>
          <GridItem xs={12}><p>
          {dataSaleReport.length > 500 ?
              <GridItem >
                <GridContainer justify="flex-end">
                  <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                    <b className='HeaderForm'>{t("Hiển thị 1–500 của 500+ kết quả. Để thu hẹp kết quả, bạn hãy chỉnh sửa phạm vi thời gian hoặc chọn Xuất báo cáo để xem đầy đủ")}</b>
                  </FormLabel>
                </GridContainer>
              </GridItem>
              :
              <GridContainer justify="flex-end">                
                  <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                    <b className='HeaderForm'>{t("Tổng {{type}}", {type: t("Doanh thu").toLowerCase()})}: {this.props.total ? ExtendFunction.FormatNumber(this.props.total): 0}</b>
                  </FormLabel> 
                <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                    <b className='HeaderForm'>{t("Tổng {{type}}", {type: t("Lợi nhuận").toLowerCase()})}: {this.props.totalProfit ? ExtendFunction.FormatNumber(this.props.totalProfit): 0}</b>
                  </FormLabel>
              </GridContainer>
            }</p>
            <OhTable
                id= "sale-report"
                columns={this.props.options === Constants.OPTIONS_SALE_REPORT.PRODUCT ? columnProducts : columns}
                dataSource={dataSaleReport.length > 500 ? dataSaleReport.slice(0,500) : dataSaleReport}
                isNonePagination={true}
              />
          </GridItem>
        </GridContainer>
    </>
    );
  }
}

export default connect()(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(TableReport)
  )
);
