import { Icon, Input, Popover } from "antd";
import "date-fns";
import _ from "lodash";
import React, { Component } from "react";
import { Col, Container, Row, setConfiguration } from "react-grid-system";
import Constants from "variables/Constants/";
import "./css.css";
import OhDateTimePicker from "./OhDateTimePicker";
import OhInput from "./OhInput";
import OhNumberInput from "./OhNumberInput";
import OhRangeInput from "./OhRangeInput";
import OhSelect from "./OhSelect";
import OhTag from "./OhTag";
import OhButton from "./OhButton";
import ExtendFunction from "lib/ExtendFunction";
import { GoSettings } from "react-icons/go";
import Store from "store/Store";
import { connect } from "react-redux";
import searchFilterAction from "store/actions/searchFilterAction";
import { withTranslation } from "react-i18next";
import { MdSearch } from 'react-icons/md';

setConfiguration({ containerWidths: [540, 750, 960, 1500], gridColumns: 100 });

class OhSearchFilter extends Component {
  constructor(props) {
    super(props);

    let { defaultShowAll, filterFields, id, searchFilterReducer } = this.props;
    let {filterValue, manualFilterValue, tags, backupDefaultValue} = searchFilterReducer[id] || {};

    this.fieldOptions = {}
    let selectedFields = [];
    selectedFields = (filterFields || []).map(item => {
      this.fieldOptions[item.field] = item;
      return item.field;
    });

    this.state = {
      filterValue: filterValue || {},
      manualFilterValue: manualFilterValue || {},
      tags: tags || {},
      selectedFields: defaultShowAll ? selectedFields : (Object.keys(tags || {}) || []),
      visible: false
    };
    
    this.filterFieldId = {};    
    this.filterValue = this.state.filterValue;
    this.manualFilterValue = this.state.manualFilterValue;
    this.tags = this.state.tags;  
    this.backupDefaultValue = backupDefaultValue || {};
    
    this.sendChange = _.debounce(this.sendChange, Constants.UPDATE_TIME_OUT);
    this.sendChange();
  }

  generateOptionType = item => {
    let {t} = this.props;
    this.filterFieldId[item.field] = (this.filterFieldId[item.field] || 0) + 1;
    item.id = item.field;
    
    if (item.type === "date") {
      if (item.options) item.id = item.field + "_" + this.filterFieldId[item.field];
      return (
        <OhDateTimePicker
          placeholder={t(item.placeholder)}
          defaultValue={this.backupDefaultValue[item.field] || item.defaultValue}
          onChange={(start, end, text) =>
            this.onChange(
              {
                [item.field]: {
                  ">=": start.format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
                  "<=": end.format(Constants.DATABASE_DATE_TIME_FORMAT_STRING)
                }
              },
              {
                [item.field]: text
              },
              item,
              [start, end]
            )
          }
        />
      );
    }
    if (item.type === "select") {
      return (
        <OhSelect
          placeholder={t(item.placeholder)}
          onChange={(value, record) =>
            this.onChange({ 
                [item.field]: value 
              }, 
              { 
                [item.field]: record.title
              }, 
              item,
              value
            )
          }
          defaultValue={this.backupDefaultValue[item.field] || item.defaultValue}
          options={item.options}
        />
      );
    }
    if (item.type === "input-range") {
      return (
        <OhRangeInput
          placeholder={t(item.placeholder)}
          defaultValue={this.backupDefaultValue[item.field] || item.defaultValue}
          onChange={({ from, to }) =>
            this.onChange(
              { [item.field]: item.isManualFilter && from && to ? { and: [{ ">=": from } , { "<=": to }] } : _.extend({}, from ? { ">=": from } : {}, to ? { "<=": to } : {}) },
              { [item.field]: (from ? ExtendFunction.FormatNumber(from) : "_") + " - " + (to ? ExtendFunction.FormatNumber(to) : "_") },
              item,
              { from, to }
            )
          }
        />
      );
    }
    if (item.type === "input-number") {
      return (
        <OhNumberInput
          placeholder={t(item.placeholder)}
          defaultValue={this.backupDefaultValue[item.field] || item.defaultValue}
          onChange={value =>
            this.onChange(
              { [item.field]: value },
              { [item.field]: value && value.toString().length ? <>= {value}</> : null },
              item,
              value
            )
          }
        />
      );
    }
    if (item.type === "input-text") {
      return (
        <OhInput
          type={"text"}
          placeholder={t(item.placeholder)}
          defaultValue={this.backupDefaultValue[item.field] || item.defaultValue}
          onChange={value =>
            this.onChange(
              { [item.field]: { contains: value } },
              { [item.field]: value && value.length ? <>'{value}'</> : null },
              item,
              value
            )
          }
        />
      );
    }
  };

  generateFilterContent = () => {
    let { selectedFields } = this.state;
    let { t } = this.props;
    let availableFields = Object.keys(this.fieldOptions).filter(item => {
      return !selectedFields.find(i => i === item);
    });
    return (
      <div
        ref={node => {
          this.node = node;
        }}
      >
        <Container className={"react-grid-system-container"} style={{ paddingTop: 10 }}>
          {selectedFields.map((item, index) => {
            return (
              <Row key={"filter-" + index} className={'oh-row'}>
                <Col className={"field-col"}>
                  <OhSelect
                    placeholder={t(item.placeholder)}
                    onChange={(value, record) => this.onChangeField(index, item, value)}
                    defaultValue={item}
                    options={[{ value: item, title: this.fieldOptions[item].title }].concat(
                      availableFields.map(i => ({ value: i, title: t(this.fieldOptions[i].title) }))
                    )}
                  />
                </Col>
                <Col>{this.generateOptionType(this.fieldOptions[item])}</Col>
                <Col className={"remove-col"}>
                  <Icon
                    onClick={() => this.onRemoveField(index)}
                    className={"remove"}
                    type="delete"
                    style={{ alignSelf: "center", color: "red" }}
                  />
                </Col>
              </Row>
            );
          })}
          <Row className={'oh-row'}>
            <Col className={"field-col"}>
              <OhSelect
                onChange={value => {
                  let newSelectedFields = this.state.selectedFields.slice();
                  newSelectedFields.push(value);

                  this.setState({ selectedFields: newSelectedFields });
                }}
                value={0}
                options={[{ value: 0, title: t("Chọn điều kiện lọc") }].concat(
                  availableFields.map(i => ({ value: i, title: t(this.fieldOptions[i].title) }))
                )}
              />
            </Col>
            <Col />
            <Col />
          </Row>
        </Container>
      </div>
    );
  };

  onToggle = () => {
    if (!this.state.visible) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ visible: !this.state.visible });
  };

  onChange = (obj, tag, item, backupDefaultValue) => {
    item = item || {};
    if (!item.isManualFilter) {
      this.filterValue = {
        ...this.filterValue,
        ...obj
      };
    } else {
      this.manualFilterValue = {
        ...this.manualFilterValue,
        ...obj
      };
    }

    if(backupDefaultValue !== undefined && item.field) {
      this.backupDefaultValue[item.field] = backupDefaultValue;
    }

    if(tag) {
      this.tags = {
        ...this.tags,
        ...tag
      };
    }
    
    this.sendChange();
  };

  sendChange = () => {
    this.setState(
      {
        filterValue: this.filterValue,
        manualFilterValue: this.manualFilterValue,
        tags: this.tags
      },
      () => {
        this.changeStateRedux();
        this.props.onFilter(this.state.filterValue, this.state.manualFilterValue);
      }
    );
  };
  
  changeStateRedux = () => {
    Store.dispatch(searchFilterAction.changeSearchFilter(this.props.id, {
      filterValue: this.state.filterValue,
      manualFilterValue: this.state.manualFilterValue,
      tags: this.state.tags,
      backupDefaultValue: this.backupDefaultValue
    }))
  }

  handleOutsideClick = e => {
    // ignore clicks on the component itself
    if (e.path.some(item => (item.className ? item.className.toString().includes("ant-popover") : false)) 
      || e.path.some(item => (item.className ? item.className.toString().includes("daterangepicker") : false))
      || e.target.localName === "li") {
      return;
    }

    this.onToggle();
  };

  onChangeField = (index, field, newField) => {
    let { selectedFields } = this.state;
    let newSelectedFields = selectedFields.slice();
    newSelectedFields.splice(index, 1, newField);
    delete this.filterValue[field];
    delete this.manualFilterValue[field];
    delete this.tags[field];
    delete this.backupDefaultValue[field];
    
    this.changeStateRedux();

    this.setState({ selectedFields: newSelectedFields, filterValue: this.filterValue, tags: this.tags, manualFilterValue: this.manualFilterValue });
  };

  onRemoveField = index => {
    let { selectedFields } = this.state;
    delete this.filterValue[selectedFields[index]];
    delete this.manualFilterValue[selectedFields[index]];
    delete this.tags[selectedFields[index]];
    delete this.backupDefaultValue[selectedFields[index]];
    let newSelectedFields = selectedFields.slice();
    newSelectedFields.splice(index, 1);
    
    this.changeStateRedux();

    this.setState({ selectedFields: newSelectedFields, filterValue: this.filterValue, tags: this.tags, manualFilterValue: this.manualFilterValue }, () =>
      this.sendChange()
    );
  };

  render() {
    const { header, title, searchInput, filterFields, tagTitle, id, t } = this.props;
    const { visible, tags, selectedFields } = this.state;
    let {backupDefaultValue} = this.props.searchFilterReducer[id] || {};
    this.fieldOptions = {};    
    (filterFields || []).map(item => this.fieldOptions[item.field] = item)

    return (
      <Container className={"react-grid-search-system-container"} id={id}>        
          <Row>
          {this.props.filterFields ? 
            <Col className={"filter oh-col"}>
              <Popover
                visible={visible}
                placement="bottomLeft"
                title={header || t("Hiển thị theo:")}
                content={this.generateFilterContent()}
                trigger="click"
                zIndex={1050}
              >
                  <OhButton onClick={() => this.onToggle()} style={{ width: "100%" }} type="add" icon={<GoSettings />} >
                    {title || t("Bộ lọc")}
                </OhButton>
              </Popover>
            </Col>
            : null }
          {this.props.searchInput ?
          <Col className={"oh-col"}>
            <Input
              defaultValue={(backupDefaultValue || {})['search-input']}
              placeholder={t(searchInput.placeholder)}
              onChange={e => {
                let obj = { or: [] };
                searchInput.fields.map(item => obj.or.push({ [item]: { contains: e.target.value } }));
                this.onChange(obj, null, {field: 'search-input'}, e.target.value);
              }}
              prefix={<MdSearch/>}              
            />
          </Col> : null}
        </Row>        
        <Row style={{ padding: "10px" }}>
          {tagTitle}
          {selectedFields.map(
            (item, index) =>
              tags[item] && <OhTag key={"tag-" + item} onClose={() => this.onRemoveField(index)} title={<>{this.fieldOptions[item].title}: {tags[item]}</>} onClick={() => this.onToggle()}/>
          )}
        </Row>
      </Container>
    );
  }
}

export default connect(function (state) {
  return {
    searchFilterReducer: state.searchFilterReducer
  };
})(withTranslation("translations")(OhSearchFilter))
