import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import 'date-fns';
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { List, Checkbox  } from 'antd';
import { FaBars } from "react-icons/fa";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,

  // // change background colour if dragging
  // background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  // padding: grid,
  // width: 250
});

class DragList extends Component {
  constructor(props) {
    super(props);
    let checkedList = {};
    let datasource = this.props.viewColumns || this.props.datasource || [];
    datasource.map(item => checkedList[item.dataIndex] = item.visible !== false)
    this.state = {
      datasource,
      isDefault: false,
      checkedList
    };
    this.defaultCheckedList = {};
    this.defaultDatasource = this.props.datasource.map(item => {
      this.defaultCheckedList[item.dataIndex] = item.visible !== false;
      return item;
    });
    
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const datasource = reorder(
      this.state.datasource,
      result.source.index,
      result.destination.index
    );

    this.setState({
      datasource
    }, () => this.sendChange());
  }
  
  sendChange = () => {
    if(this.props.onChange) this.props.onChange(this.state.isDefault ? this.props.datasource : this.state.datasource.map(item => ({...item, visible: this.state.checkedList[item.dataIndex]})))
  }

  onChange = obj => {
    this.setState({
      checkedList: {
        ...this.state.checkedList,
        ...obj
      },
    }, () => this.sendChange());
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    let {isDefault} = this.state;
    let {t} = this.props;
    let datasource = isDefault ? this.defaultDatasource : this.state.datasource;
    let checkedList = isDefault ? this.defaultCheckedList : this.state.checkedList;
    return (
      <>
        <List.Item
          className={"draglist-item"}
        >
          <Checkbox
            onChange={(e) => {this.setState({isDefault: e.target.checked}, () => this.sendChange())}}
            checked={isDefault}
          >
            {t("Quay về mặc định")}
          </Checkbox>
        </List.Item>
        <div
          style={{maxHeight: (window.innerHeight) *80/100 - 80, overflowY: "auto"}}
        >
          <DragDropContext onDragEnd={isDefault ? null : this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  
                  {(datasource).map((item, index) => (
                    <Draggable key={item.dataIndex} draggableId={item.dataIndex} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <List.Item
                            actions={[<FaBars style={{fontSize: "20px", color: "black", marginBottom: 0}}/>]}
                            className={"draglist-item"}
                          >
                            <Checkbox
                              onChange={isDefault ? null : (e) => {this.onChange({[item.dataIndex]: e.target.checked})}}
                              checked={checkedList[item.dataIndex]}
                            >
                              {t(item.title)}
                            </Checkbox>
                          </List.Item>
                          
                        </div>
                      )}
                    </Draggable>
                    
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </>
    );
  }
}


export default (withTranslation("translations")
(
  withStyles(theme => ({
    ...regularFormsStyle
  }))(DragList)
));
