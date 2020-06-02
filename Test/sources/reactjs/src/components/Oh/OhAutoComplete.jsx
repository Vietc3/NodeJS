import React, { PureComponent } from 'react';
import { AutoComplete, Input, Select, Button, Icon } from "antd";
import ExtendFunction from "lib/ExtendFunction";
import { Container } from "react-grid-system";
import { trans } from "lib/ExtendFunction";
import { MdSearch } from 'react-icons/md';

const { Option } = Select;

class OhAutoComplete extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      value: ""
    };
    if (this.props.onRef) this.props.onRef(this)
  }
  renderOptions = item => {
    return (
      <Option key={item.id} text={trans(item.name, true)}>
        <div className="global-search-item">
          <span className="global-search-item-desc" title={ item.name.length > 95 ? trans(item.name,true):""}>{trans(item.name)}</span>
          <span className="global-search-item-count">{item.code}</span>
        </div>
      </Option>
    );
  };

  onSearchData = ExtendFunction.debounce(async value => {
    this.props.onSearchData(value)
  }, 500);

  render() {
    let { onClickValue, disabled, placeholder, dataSelects, onClick, isButton, onKeyPress, autoFocus } = this.props;

    return (
      <Container id="autocompleteItem" className="AutoCompleted-container">
        <AutoComplete
          className="global-search"
          size="large"
          dataSource={dataSelects.map(this.renderOptions)}
          value= {this.state.value}
          onSelect={value => {
            onClickValue(value);
            this.setState({ value: "" })
          }}
          onSearch={this.onSearchData}
          onChange={value=>this.setState({value})}
          disabled={disabled}
          placeholder={placeholder}
          optionLabelProp="text"
          getPopupContainer={() => document.getElementById('autocompleteItem')}
          onInputKeyDown={onKeyPress}
          ref={ref => this.ref = ref }
          autoFocus={autoFocus || autoFocus === undefined ? true : false}
        >
          <Input prefix={<MdSearch/>} />
        </AutoComplete>
        { isButton ?
          <Button
            className="search-btn"
            style={{ position: "absolute", border: "unset", backgroundColor: "unset", zIndex: 1, right: 0 }}
            size="large"
            onClick={onClick}
          >
            <Icon type="unordered-list" />
          </Button>
          : null }
      </Container>
    );
  }
}

export default OhAutoComplete;