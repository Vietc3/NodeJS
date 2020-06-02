import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import { withTranslation } from "react-i18next";
// css
import Constants from 'variables/Constants/';
import { Redirect } from 'react-router-dom';
import moment from "moment";
import ManufacturingCardService from 'services/ManufacturingCardService';
import PDFImport from './components/PDFOrder';
import ExcelImport from './components/ExcelOrder';
import OhToolbar from "components/Oh/OhToolbar";
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import OhTable from "components/Oh/OhTable";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import { notifyError } from "components/Oh/OhUtils";
import ExtendFunction from "lib/ExtendFunction";
import { connect } from "react-redux";
import _ from 'lodash';
class ManufacturingCardList extends React.Component {
  constructor(props) {
    super(props);
    this.defaultFilterFormData = {
      fromAmount: '0',
      toAmount: '1000000000',
      fromDate: moment().subtract(30, 'day').startOf('day'),
      toDate: moment().endOf('day'),
    }
    this.state = {
      selectedRowKeys: [],
      expandedRowKeys: [],
      manufacturingCards: [],
      alert: null,
      br: null,
      brerror: null,
      filterFormData: { ...this.defaultFilterFormData },
    }
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  getData = async () => {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    const query = {
      filter: filter || {},
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let getManufacturingCards = await ManufacturingCardService.getManufacturingCards(query);
    if (getManufacturingCards.status)
      this.setData(getManufacturingCards.data, getManufacturingCards.count)
    else notifyError(getManufacturingCards.error)
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }

  setData = (dataManufacturingCards, totalManufacturingCards) => {
    dataManufacturingCards.map(item => item.key = item.id)

    this.setState({
      manufacturingCards: dataManufacturingCards,
      totalManufacturingCards
    })
  }

  getColums = () => {
    const { t } = this.props;
    let columns = [
      {
        title: t("Mã phiếu"),
        align: "left",
        dataIndex: "code",
        key: "code",
        width: "20%",
        sorter: (a, b) => a.code.localeCompare(b.code),
        onSort: (a, b) => a.code.localeCompare(b.code),
      },
      {
        title: t("Thời gian"),
        align: "left",
        dataIndex: "createdAt",
        key: "createdAt",
        width: "20%",
        sorter: (a, b) => a.createdAt - b.createdAt,
        onSort: (a, b) => a.createdAt - b.createdAt,
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t("Ghi chú"),
        align: "left",
        dataIndex: "notes",
        width: "40%",
        sorter: (a, b) => a.notes.localeCompare(b.notes),
        onSort: (a, b) => a.notes.localeCompare(b.notes),
        key: "notes",
      },
      {
        title: t("Trạng thái"),
        align: "left",
        dataIndex: "status",
        key: "status",
        width: "20%",
        sorter: (a, b) => a.status - b.status,
        onSort: (a, b) => a.status - b.status,
        render: value => <span style={{ color: value === Constants.MANUFACTURE_CARD_STATUS.CANCELLED ? 'red' : 'none' }}>{t(Constants.MANUFACTURING_STATUS[value])}</span>
      }
    ];
    return columns
  }

  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
    });
  };

  exportPDF =  async() => {
    let { t, nameBranch } = this.props;
    let dataExport = await this.getDataExport();
    PDFImport.productPDF(dataExport, t , nameBranch);
  }

  exportExcel =  async() => {
    let { t } = this.props;
    let dataExport = await this.getDataExport();
    ExtendFunction.exportToCSV(ExcelImport.getTableExcel(dataExport, t), t("DanhSachPhieuSanXuat"));
  }

  getDataExport = async () => {
    let { selectedRowKeys } = this.state;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataManufacturingCard = await ManufacturingCardService.getManufacturingCards(query)

    if ( dataManufacturingCard.status ) 
      return dataManufacturingCard.data;
    else notifyError(dataManufacturingCard.error)
  }

  render() {
    let columns = this.getColums();
    const { t } = this.props
    const { manufacturingCards, totalManufacturingCards } = this.state;

    return (
      <Fragment>
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        {this.state.alert}
        <Card>
          <CardBody>
            <OhToolbar
              left={[
                {
                  type: "list",
                  label: "Xuất file",
                  icon: <MdVerticalAlignBottom />,
                  typeButton: "export",
                  permission: {
                    name: Constants.PERMISSION_NAME.MANUFACTURE_CARD,
                    type: Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY
                  },
                  listDropdown: [
                    {
                      title: "Excel",
                      type: "button",
                      onClick: () => this.exportExcel(),
                      icon: <AiOutlineFileExcel className="icon-export" />,
                      color: Constants.COLOR_SUCCESS
                    },
                    {
                      title: "PDF",
                      onClick: () => this.exportPDF(),
                      icon: <AiOutlineFilePdf className="icon-export" />,
                      color: Constants.COLOR_DANGER
                    }
                  ],
                  dropPlacement: "bottom-start",
                  simple: true
                }
              ]}
              right={[
                {
                  type: "link",
                  linkTo: Constants.ADMIN_LINK + Constants.ADD_MANUFACTURING_CARD,
                  label: t("Tạo phiếu sản xuất"),
                  icon: <MdAddCircle />,
                  simple: true,
                  typeButton: "add",
                  permission: {
                    name: Constants.PERMISSION_NAME.MANUFACTURE_CARD,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },

              ]}
            />
            <OhSearchFilter
                id={"manufacting-cards-table"}
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                {
                  type: "input-text",
                  title: t("Mã phiếu SX"),
                  field: "code",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Mã phiếu SX").toLowerCase()})
                },
                { type: "date", 
                  title: t("Ngày tạo"), 
                  field: "createdAt" 
                },
                {
                  type: "select",
                  title: t("Trạng thái"),
                  field: "status",
                  options: Constants.OPTIONS_MANUFACTURING_STATUS.map((item) => ({...item, title: t(item.title)}))
                },
                
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["code"],
                placeholder: t("Tìm theo mã phiếu")
              }}
            />
            <OhTable
              onRef={ref => (this.tableRef = ref)}
              onChange={(tableState, isManualSort) => {
                this.onChange({
                  ...tableState,
                  isManualSort
                });
              }}
              columns={columns}
              dataSource={manufacturingCards}
              total={totalManufacturingCards}
              hasCheckbox={true}
              id={"manufacting-cards-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => {
                this.setState({
                  redirect: (this.props.currentUser.permissions.manufacture_card < Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY
                    ) ? null : (
                    <Redirect
                      to={{
                        pathname: Constants.ADMIN_LINK + Constants.EDIT_MANUFACTURING_CARD + "/" + record.id
                      }}
                    />
                  )
                });
              }}
            />
          </CardBody>
        </Card>
      </Fragment>
    )
  }
}

ManufacturingCardList.propTypes = {
  classes: PropTypes.object
};

export default connect(function (state) {
  return {
    currentUser: state.userReducer.currentUser,
    nameBranch: state.branchReducer.nameBranch,
  };
})(withTranslation("translations")(
    withStyles(theme => ({
      ...extendedTablesStyle,
      ...buttonsStyle
    }))(ManufacturingCardList)
  )
);