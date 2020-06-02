import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Table, Input, Icon, Form, Empty  } from "antd";
import SweetAlert from "react-bootstrap-sweetalert";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Checkbox from '@material-ui/core/Checkbox';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import AlertSuccess from 'components/Alert/AlertSuccess.jsx';
import AlertError from 'components/Alert/AlertError.jsx';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import Button from "components/CustomButtons/Button.jsx";
import AddCustomerType from "./AddCustomerType.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import _ from 'lodash';

class CustomerType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			alert: null,
      dataSource: [],
      dataIssueStatusFilter: [],
      editCustomerType: {},
      visible: false,
      visibleView: false,
      type: null,
      searchText: {},
      searchWords: {},
      isEdit: false,
      recordEdit: [],
    };
		const { t, i18n, classes } = this.props;
    this.onCancel = this.onCancel.bind(this);
    this.dataSource_copy = [];
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }
  hideAlert = ()=>{
    if(this.state.visible)
      this.onCancel();
    this.setState({
      alert: null
    });
  }
  onClickRemove = (key, name) => {    
    const { classes, t } = this.props;
    let Customers = null;
    this.props.listCustomers.Customers.find((item)=>{
      if(item.Type === key)
      {
        Customers = item;
      }
    })
    if(Customers)
    {
      this.setState({
          alert: (
              <SweetAlert
                  showConfirm={false}
                  showCancel={false}
                  style={{ display: "block",marginLeft:0,marginTop:0,top:`${(window.innerHeight/2-85)*100/window.innerHeight}%`,left:`${(window.innerWidth/2-150)*100/window.innerWidth}%`}}
                  title={
                      <div style={{ fontSize: "18px", lineHeight: "1.5em" }}>
                              <Icon type="stop" style={{color:"#f44336"}} />
                          <span style={{color: "black", marginLeft: "10px" }}> 
                              {t("Can't remove this customer type!")}
                          </span>
                      </div>}
                  onCancel={() => this.hideAlert()}
                  onConfirm={() => this.hideAlert()}
              >
                  <div>
                      <span style={{ fontWeight: 500 }}>{t("Customer type '")}{name}'</span> 
                      <div>{t("' using by 'Customer' table")}</div>
                  </div>
               
                  <div style={{ textAlign: "center" }}>
                      <Button
                          className={this.props.classes.marginRight, "button-danger"}
                          onClick={() => this.hideAlert()}
                      >
                          {t("Cancel")}
                      </Button>
                  </div>
              </SweetAlert>
          )
      });
    }
    else
    {
      this.setState({
          alert: (
              <SweetAlert
                  showConfirm={false}
                  showCancel={false}
                  style={{ display: "block",marginLeft:0,marginTop:0,top:`${(window.innerHeight/2-85)*100/window.innerHeight}%`,left:`${(window.innerWidth/2-150)*100/window.innerWidth}%`}}
                  title={
                      <div style={{ fontSize: "18px", lineHeight: "1.5em" }}>
                          <Icon type="exclamation-circle" style={{color:"#f44336"}} />
                          <span style={{color: "black", marginLeft: "10px" }}> 
                              {t("Are you sure you want to delete") + " " + t("customer type  ") + "'" + name + "'  ?"}
                          </span>
                      </div>}
                  onCancel={() => this.hideAlert()}
                  onConfirm={() => this.hideAlert()}
              >
                  <div style={{ textAlign: "center" }}>
                      <Button
                          className={this.props.classes.marginRight,"button-success"}
                          onClick={() => {
                            this.deleteCustomerType(key);
                          }}
                      >
                          {t("Delete")}
                      </Button>
                      <Button
                          className={this.props.classes.marginRight, "button-danger"}
                          onClick={() => this.hideAlert()}
                      >
                          {t("Cancel")}
                      </Button>
                  </div>
              </SweetAlert>
          )
      });      
    }
  };

  deleteCustomerType = (key) => 
  {
    this.props.deleteCustomerType(key, (isDeleteCustomerTypeSuccess) => {
      isDeleteCustomerTypeSuccess ? this.showAlertSuccess() : this.showAlertError();
    });
  }

  showAlertSuccess = () => {
		this.setState({
			alert: <AlertSuccess />
		});
        setTimeout(this.hideAlert, 1000);
	}
	
	showAlertError = () => {
    this.setState({
      alert: <AlertError />
    });
    setTimeout(this.hideAlert, 1000);
  }

  handleAdd = (record) => {
    if(record.index !== undefined)
      delete record.index;
    this.props.updateCustomerType(record, (isUpdateCustomerTypeSuccess) => {
      isUpdateCustomerTypeSuccess ? this.showAlertSuccess() : this.showAlertError();
    });
    this.closeInputEdit();
}

  componentWillMount = () => {
    this.props.fetchCustomerTypes({ref: "CustomerType"}, null);
    this.props.fetchCustomers({ref: "Customer"}, null);
  };
  componentDidUpdate (prevProps, prevState){
    if(prevProps.listCustomerTypes.loading !== this.props.listCustomerTypes.loading){
      this.getData();
    }
  }
  getData = () => {
    let CustomerTypes = [...this.props.listCustomerTypes.CustomerTypes];
    CustomerTypes.reverse();
    let dataCustomerType = [];
    CustomerTypes.map((item, index) => {
      dataCustomerType.push( { ...item, index: index +1})
    })
    this.setState({
      dataSource: dataCustomerType
    })
    this.dataSource_copy = dataCustomerType.slice();
  }

  onCancel = () => {
    this.setState({
      visible: false,
      visibleView: false,
      type: "",
      title: ""
    });
  };

  onClickAdd = () => {
    const t = this.props.t;
    this.setState({
      editCustomerType: {},
      visible: true,
      type: "add",
      title: t("Add Customer Type")
    });
  };

  onClickEdit = e => {
    this.setState({
      isEdit: true,
      recordEdit: e,
    })
  };

  onClickEditModal = (customerTypeEdit) => {
    const t = this.props.t;
    this.setState({
      editCustomerType: customerTypeEdit,
      visible: true,
      type: "edit",
      title: t("Edit Customer Type")
    });
};

  showModalAdd = () => {
    return  <AddCustomerType
              type={this.state.type}
              visible={this.state.visible}
              title={this.state.title}
              onCancel={this.onCancel}
              data={this.state.editCustomerType}
              handleAdd = {this.handleAdd}
            ></AddCustomerType>
  }
  
  onClickView = e => {
    const t = this.props.t;
    this.setState({
      viewCustomer: e,
      visibleView: true,
      title: t("View Detail")
    });
  };
  handleSearch = (e, id) => {
		let {searchWords, searchText, dataSource} = this.state;
		searchWords[id] = searchWords[id] || '';
		searchText[id] = searchText[id] || '';
		searchWords[id] = e.target.value.toString().split(/\s/).filter(word => word);
		searchText[id] = e.target.value
		let arr = this.dataSource_copy.filter((item)=>{
			let exist = true;
			for(let i in searchText){
				
				let text = searchText[i];
				exist = exist && (text=='' ? true : (!item[i] ? false : item[i].toLowerCase().includes(text.toLowerCase())));
			}
			return exist;
		});
		
		this.setState({searchWords: searchWords, searchText: searchText, dataSource: arr});
  };
  searchValue = (id)=>{
		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Input
						ref={node => {
							this.searchInput = node;
						}}
						value={this.state.searchText[id]}
						onChange={e => {this.handleSearch(e, id)}}
						onPressEnter={e => confirm()}
						style={{ width: 188, marginBottom: 8, display: 'block' }}
					/>
				</div>
			),
			filterIcon: filtered => (
				<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
			),
			onFilterDropdownVisibleChange: visible => {
				if (visible) {
					setTimeout(() => this.searchInput.focus());
				}
			},
		}
  }

  handleInputChange = (event) => {
    this.setState ({
        recordEdit: {
            ...this.state.recordEdit,
            [event.target.name]: event.target.value,
        },
    })
}

handleCheckboxChange = (event, record) => {
  let isCheck = event.target.checked ? 1 : 0;
  const { classes, t, } = this.props;
  this.setState({
      alert: (
          <SweetAlert
              showConfirm={false}
              showCancel={false}
              style={{ display: "block",marginLeft:0,marginTop:0,top:`${(window.innerHeight/2-85)*100/window.innerHeight}%`,left:`${(window.innerWidth/2-150)*100/window.innerWidth}%`}}
              title={
                  <div style={{ fontSize: "18px", lineHeight: "1.5em" }}>
                      <Icon type="exclamation-circle" style={{color:"#f44336"}} />
                      <span style={{color: "black", marginLeft: "10px" }}> 
                          {t("Are you sure you want to change fix this customer type?")}
                      </span>
                  </div>}
              onCancel={() => this.hideAlert()}
              onConfirm={() => this.hideAlert()}
          >
              <div style={{ textAlign: "center" }}>
                  <Button
                      className={this.props.classes.marginRight,"button-success"}
                      onClick={() => {
                          this.hideAlert();
                          this.changeStateCheckbox(isCheck, record);
                      }}
                  >
                      {t("Change")}
                  </Button>
                  <Button
                      className={this.props.classes.marginRight, "button-danger"}
                      onClick={() => this.hideAlert()}
                  >
                      {t("Cancel")}
                  </Button>
              </div>
          </SweetAlert>
      )
  });
}

changeStateCheckbox = (isCheck, record) => {
  this.setState ({
      recordEdit: {
          ...record,
          Fix: isCheck,
      },
  },
  () => this.handleAdd(this.state.recordEdit))
}

closeInputEdit = () => {
    this.setState({
        isEdit: false,
    });
}

saveEdit = () => {
    
    const { classes, t } = this.props;
    let recordEdit = this.state.recordEdit;
    if(recordEdit.Name !== '')
    {
      this.setState({
        recordEdit: {
            ...recordEdit,
            Fix : recordEdit.Fix ? 1 : 0,
        }
      }, ()=>{
          this.handleAdd(this.state.recordEdit);
      })
    }
    else
    {
        this.setState({
            alert: (
                <SweetAlert
                  showConfirm={false}
                  showCancel={false}
                  style={{ display: "block",marginLeft:0,marginTop:0,top:`${(window.innerHeight/2-85)*100/window.innerHeight}%`,left:`${(window.innerWidth/2-150)*100/window.innerWidth}%`}}
                  title={
                      <div style={{ fontSize: "18px", lineHeight: "1.5em" }}>
                          <Icon type="exclamation-circle" style={{color:"#f44336"}} />
                          <span style={{color: "black", marginLeft: "10px" }}> 
                              {t("Please enter all field")}
                          </span>
                      </div>}
                  onCancel={() => this.hideAlert()}
                  onConfirm={() => this.hideAlert()}
              >
                  <div style={{ textAlign: "center" }}>
                      <Button
                          className={this.props.classes.marginRight, "button-danger"}
                          onClick={() => this.hideAlert()}
                      >
                          {t("Cancel")}
                      </Button>
                  </div>
              </SweetAlert>
            )
        });
    }
}
  
  render() {
    const userFunction = this.props.User_Function;
    const { classes, t } = this.props;
    
    let columns = [
      {
        title: t("#"),
        dataIndex: "index",
        key: "index",
        width: 50,
			},
      {
        title: t("Name"),
        dataIndex: "Name",
        key: "Name",
        width: 200,
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        sortDirections: ['descend', 'ascend'],
        render: (value, record, index) => {
          return (
            this.state.isEdit && this.state.recordEdit.ID === record.ID ?
            <Form.Item style={{ margin: 0 }}>
                <Input
                    name = "Name"
                    value = {this.state.recordEdit.Name}
                    ref={node => (this.input = node)} 
                    onChange = {(e) => e.target.value.length < 30 ? this.handleInputChange(e) : null}
                    onPressEnter={(event) => this.saveEdit( event)} 
                />
            </Form.Item>
            : 
            <div className="ellipsis-not-span" onClick = {() => !record.Fix ? this.onClickEdit(record) : null}>{value}</div> 
          );
      },
				...this.searchValue('Name')
      },
      {
        title: t("Fix"),
        dataIndex: "Fix" ,
        key: "Fix" ,
        width: 150,
        sorter: (a, b) => a.Fix - b.Fix ,
				sortDirections: ['descend', 'ascend'],
        align: "center",
        render: (id, record, index) => {
          // console.log(record.Fix);
          return (
            <div>
               <Checkbox
                    name = "Fix"
                    checked={this.state.recordEdit.ID === record.ID ? this.state.recordEdit.Fix : record.Fix}
                    color="primary"
                    onChange = {(event) => this.handleCheckboxChange(event, record)}
                    disabled = {record.Fix}
                />
            </div>
          );
        }
      },
      {
        width: 150,
        title: t(""),
        key: "operation",
        align:"center",
        dataIndex: "userid",
        render: (id, record, index) => {
          let classes = this.props.classes;
          return (
            <div key={"action_" + index}>
              {this.state.isEdit ? null :
                <Fragment>
                  <ButtonTheme
                    className = {"button-info"}
                    title={t("Edit")}
                    size="sm"
                    style={{ padding: "6px", paddingLeft: "9px",width:"30px" }}
                    onClick={() => this.onClickEdit(record)}
                    disabled = { ! userFunction.edit_customer_type || record.Fix}
                  >
                    <Edit />
                  </ButtonTheme>

                  <ButtonTheme
                    className = {"button-danger"}
                    title={t("Remove")}
                    size="sm"
                    style={{ padding: "6px", paddingLeft: "9px",width:"30px" }}
                    onClick={() => this.onClickRemove(record.ID, record.Name)}
                    disabled = { ! userFunction.delete_customer_type || record.Fix}
                  >
                    <Delete />
                  </ButtonTheme>
                </Fragment>
              }
              {this.state.isEdit && this.state.recordEdit.ID === record.ID ?
                <Fragment>
                    <ButtonTheme
                        className = {"button-success"}
                        title={t("Save")}
                        size="sm"
                        style={{ padding: "6px", paddingLeft: "9px",width:"30px" }}
                        onClick={() => this.saveEdit()}
                    >
                        <SaveIcon className={classes.icon}/>
                    </ButtonTheme>
                
                    <ButtonTheme
                        className = {"button-danger"}
                        title={t("Cancel")}
                        size="sm"
                        style={{ padding: "6px", paddingLeft: "9px",width:"30px" }}
                        onClick={() => this.closeInputEdit()}
                    >
                        <CancelIcon className={classes.icon}/>
                    </ButtonTheme>
                </Fragment>
              : null }
            </div>
          );
        }
      }
    ];
    return (
      <Fragment>
        {this.state.notification}
        {this.state.alert}
        {this.state.visible ? this.showModalAdd() :  null}
          <Card>
            <CardHeader color="primary" icon>
              <GridContainer justify = "flex-end">
                  <GridItem >
                      <Button
                        justify="center"
                        color="info"
                        className={classes.marginRight, "button-success"}
                        onClick={this.onClickAdd}
                        disabled = { ! userFunction.add_customer_type }
                      >
                        {t("Add Customer Type")}
                      </Button>
                  </GridItem>
              </GridContainer>
            </CardHeader>
            <CardBody>
              <Table
                size={window.innerWidth <= 1300 ? " small": "default "}
                columns={columns}
                scroll= {{y: window.innerHeight - 320}}
                rowKey="uid"
                dataSource={this.state.dataSource}
                onChange={this.handleChange}
                pagination={{
                  showSizeChanger: true,
                  defaultPageSize: 10,
                  pageSizeOptions: ["5", "10", "20", "40"],
                  size: "normal"
                }}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  description={t("Không có dữ liệu")} /> }}
              />
            </CardBody>
          </Card>
      </Fragment>
    );
  }
}

CustomerType.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(CustomerType)
  )
);
