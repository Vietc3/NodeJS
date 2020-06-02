import withStyles from "@material-ui/core/styles/withStyles";
import Toolbar from "@material-ui/core/Toolbar";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import PropTypes from "prop-types";
import React from "react";
import { Col, Container, Row, setConfiguration } from "react-grid-system";
import { withTranslation } from "react-i18next";
import "./css.css";
import OhButton from "./OhButton";
import OhCSVLink from "./OhCSVLink";
import OhDropdown from "./OhDropdown";

setConfiguration({ gridColumns: 100 });

const OhToolbar = props => {
  const { left, right } = props;
  let leftCol = left === undefined ? 0 : (right === undefined ? 100 : (props.leftCol === undefined ? 62 : props.leftCol));

  function generateButtons(options) {
    let { classes, t } = props;
    return options.map((item, index) => {
      if (item.type === "link") {
        return (
          <OhButton
            key={"link-" + index}
            label={item.label}
            icon={item.icon}
            color={item.color}
            onClick={item.onClick}
            linkTo={item.linkTo}
            params={item.params}
            simple={item.simple}
            permission={item.permission}
            disabled= {item.disabled}
            type={item.typeButton}
            typePrint={item.typePrint}
          />
        );
      }
      if (item.type === "button") {
        return (
          <OhButton
            key={"button-" + index}
            label={item.label}
            icon={item.icon}
            color={item.color}
            onClick={item.onClick}
            simple={item.simple}
            permission={item.permission}
            disabled= {item.disabled}
            type={item.typeButton}
            typePrint={item.typePrint}
          />
        );
      }
      if (item.type === "csvlink") {
        return (
          <OhCSVLink csvData={item.csvData} fileName={item.fileName} onClick={item.onClick}>
            <OhButton
              key={"button-" + index}
              label={item.label}
              icon={item.icon}
              color={item.color}
              simple={item.simple}
              permission={item.permission}
              disabled= {item.disabled}
              type={item.typeButton}
              typePrint={item.typePrint}
            />
          </OhCSVLink>
        );
      }
      if (item.type === "list") {
        return (
          <OhDropdown
            key={"dropdown-" + index}
            className={[classes.marginRight, "button-success"].join(" ")}
            hoverColor="info"
            buttonText={
              <>
                {item.icon} {typeof item.label === 'string' ? t(item.label) : item.label}
              </>
            }
            buttonProps={{
              color: "success"
            }}
            backgroundColor="success"
            dropPlacement={item.dropPlacement}
            simple={item.simple}
            color={item.color}
            permission={item.permission}
            disabled= {item.disabled}
            type={item.typeButton}
            typePrint={item.typePrint}
            dropdownList={item.listDropdown.map(i => {
              let elm = (
                <div onClick={i.type === "csvlink" ? null : i.onClick} style={{ ...i.style, color: i.color }} className={i.className || 'li-drop-down'}>
                  {i.icon} {t(i.title)}
                </div>
              );

              if (i.type === "csvlink") {
                return (
                  <OhCSVLink csvData={i.csvData} fileName={i.fileName} onClick={i.onClick}>
                    {elm}
                  </OhCSVLink>
                );
              }
              return elm;
            })}
          />
        );
      }
      if (item.type === "custom") {
        return item.component;
      }

      return null;
    });
  }
  return (
    <Toolbar>
      <Container className={"react-grid-system-container"}>
        <Row>
          {left && <Col xs={leftCol}>{generateButtons(left)}</Col>}
          {right && <Col xs={100 - leftCol} style={{ textAlign: "end" }}>
            {generateButtons(right)}
          </Col>}
        </Row>
      </Container>
    </Toolbar>
  );
};

OhToolbar.propTypes = {
  left: PropTypes.array,
  right: PropTypes.array
};

export default withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle,
    ...extendedTablesStyle,
    ...buttonsStyle
  }))(OhToolbar)
);
