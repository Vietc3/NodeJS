import React, { Component } from "react";
import { Select, Tooltip } from "antd";
import { withTranslation } from 'react-i18next';

const { Option } = Select;

class OhMultiChoice extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      selects: defaultValue,
      selectTypes: defaultValue,
      selectNameType: [],
    };
  }

  onChange = async (value, obj) => {
    let dataSourcePType = this.props.dataSourcePType.slice()
    let valueAll, allTypes = [], selectNameType = [];

    let findAllType = value.find(item => item === "all");
    
    if (findAllType === "all") {
      dataSourcePType.forEach((item) => allTypes.push(item.id))
      valueAll = ["all"]
    } else obj.map((item,i) => selectNameType.push(item.props.children + (obj.length > (i + 1) ? ", " : "")) )

    let selectTypes = findAllType === "all" ? allTypes : value;
    let selects = findAllType === "all" ? valueAll : value;

    if(value[0] === "all" && value.length > 1)
    {
      selectTypes = value.slice(1);
      selects = value.slice(1);
    }
    
    this.setState({
      selectTypes,
      selects,
      selectNameType,
    },() => this.props.onChange(selectTypes))
  }

  getDataSource() {
    const { dataSourcePType, t } = this.props;
    let dataSource = [<Option value={"all"} key={"all"} >{t("Tất cả")}</Option>];

    if (dataSourcePType.length > 0) {
      dataSourcePType.sort((a, b) =>
        a.name ? a.name.toString().localeCompare(b.name) : ""
      ).map(data => dataSource.push(<Option value={data.id} key={data.id}>{data.name}</Option>));
    }

    return dataSource
  }

 render() {
    const { dataSourcePType, options, onChange, placeholder, disabled, ...rest } = this.props;

    let dataSource = this.getDataSource();

    return (
      <Tooltip 
      placement="rightTop" 
      title={this.state.selectNameType.length > 1 ? this.state.selectNameType : "" } 
      mouseEnterDelay={0.5}
      >
        <Select
          placeholder={placeholder}
          mode="multiple"
          optionFilterProp="children"
          onChange={(value, obj) => this.onChange(value, obj)}
          value={this.state.selects}
          maxTagTextLength={6}
          maxTagCount={1}
          getPopupContainer={trigger => trigger.parentNode}
          {...rest}
        >
          {dataSource}
        </Select>
      </Tooltip>
    );
  }
}

export default withTranslation("translations")(OhMultiChoice);
