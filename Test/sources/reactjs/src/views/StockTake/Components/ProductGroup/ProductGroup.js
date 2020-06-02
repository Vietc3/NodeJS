import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import { connect } from "react-redux";
import {
  Input as InputAnt,
  List,
  Checkbox
} from "antd";
// multilingual
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import Constants from "variables/Constants/";

import productTypeService from "services/ProductTypeService";
import _ from 'lodash';
import AlertQuestion from "components/Alert/AlertQuestion";

const { Search } = InputAnt;

class FormIssue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedGroup: {},
      searchValue: "",
      productTypes: [],
      alert:null
    };

    this.props.onRef(this);
  }

  componentWillUnmount = () => {
    if (this.getProductType) this.getProductType.off();
  };

  componentDidMount = () => {
    this.getData();
  };

  getData = async () => {
    // Actions.loading.on();
    let getProductTypes = await productTypeService.getProductTypes();

    this.setState({ productTypes: getProductTypes.data });
    // Actions.loading.off();
  };

  onClickProductType = async (id, item, options) => {
    let { checkedGroup } = this.state;
    let { t } = this.props;

    this.setState({
      alert: (
        <AlertQuestion
          action={ () => {
            if (checkedGroup[id]) checkedGroup = {};
            else {
              options.map(item => (checkedGroup[item.id] = item));
              checkedGroup[id] = item;
              this.hideAlert()
            }
            this.setState({
              checkedGroup: checkedGroup
            });
          }}
          hideAlert={() => this.hideAlert()}
          messege={t("Bạn có chắc chắn muốn chọn tất cả các nhóm hàng này?")}
          buttonOk={t('Đồng ý')}
        />
      )
    })
  };
  hideAlert = () => {
    this.setState({
      alert: null,
      checkedGroup:{}
    });
  };
  onChange = (item, options) => {
    let { checkedGroup, productTypes } = this.state;
    let id = item.id;
    
    if (id === "all" && !checkedGroup[id]) {
      this.onClickProductType(id, item, options);
      
    } else if (id === "all") {
      if (checkedGroup[id]) checkedGroup = {};
      else {
        productTypes.map(item => (checkedGroup[item.id] = item));
        checkedGroup[id] = item;
      }
    }
    else {
      if (checkedGroup[id]) delete checkedGroup[id];
      else checkedGroup[id] = item;
      delete checkedGroup["all"];
    }

    this.setState({
      checkedGroup: checkedGroup
    });
  };

  render() {
    const { t } = this.props;
    const { checkedGroup, searchValue, productTypes } = this.state;
    let searchOptions = productTypes.filter(item =>
      ExtendFunction.removeSign(item.name)
        .toLowerCase()
        .includes(ExtendFunction.removeSign(searchValue).toLowerCase())
    )
    let allItem = { id: "all", name: t(Constants.TITLE_SELECT_ALL), productsCount: _.sumBy(searchOptions, (item) => item.productsCount) };  
    let options = [allItem].concat(searchOptions);
    if ( Object.keys(checkedGroup).length === productTypes.length && !checkedGroup.all && productTypes.length > 0 ) {
      checkedGroup.all = allItem;
    }
    return (
      <GridContainer style={{marginTop: "20px"}}>
        {this.state.alert}
        <GridItem xs={12} >
          <Search
            placeholder={t(Constants.PLACEGOLDER_SEARCH_PRODUCT_GROUP)}
            onChange={e => {
              let checkedGroup_copy = JSON.parse(JSON.stringify(checkedGroup))

              if (e.target.value !== searchValue && e.target.value === "" && checkedGroup["all"]) {
                delete checkedGroup_copy["all"]
              }

              this.setState({ 
                searchValue: e.target.value,
                checkedGroup: checkedGroup_copy
              })
          }}
          />
        </GridItem>
        <GridItem xs={12}>
          <List
            style={{
              overflowY: "auto",
              height: "calc(85vh - 235px)",
            }}
            itemLayout="horizontal"
            dataSource={options}
            renderItem={item => (
              <List.Item className={"ProductGroup-ListItem"} onClick={() => this.onChange(item, options)}>
                <List.Item.Meta
                  title={
                    <>
                      <Checkbox
                        indeterminate={item.id === "all" && !_.isEmpty(checkedGroup) && !checkedGroup[item.id]}
                        key={item.id}
                        checked={checkedGroup[item.id] ? true : false}
                        onChange={() => {}}
                      ></Checkbox>
                      <span style={{ paddingLeft: 20 }}>{item.name + ' ('+ t("countProduct", {count: item.productsCount }) + ' )'}</span>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default connect(function(state) {
  return {};
})(
  withTranslation("translations")(
    withStyles({
      ...extendedFormsStyle,
      ...extendedTablesStyle
    })(FormIssue)
  )
);
