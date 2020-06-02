
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";

import paginationStyle from "assets/jss/material-dashboard-pro-react/components/paginationStyle.jsx";

function Pagination({ ...props }) {
  const { classes, pages, color, style } = props;
  return (
    <ul className={classes.pagination} style={style}>
      {pages?
      pages.map((prop, key) => {
        const paginationLink = cx({
          [classes.paginationLink]: true,
          [classes[color]]: prop.active,
          [classes.disabled]: prop.disabled
        });
      
        return (
          <li className={classes.paginationItem} key={key}>
            {prop.component?prop.component:prop.onClick !== undefined ? (
              <Button onClick={prop.onClick} className={paginationLink} style={prop.style}>
                {prop.text}
              </Button>
            ) : (
              <Button
                onClick={() => alert("you've clicked " + prop.text)}
                className={paginationLink}
								style={prop.style}
              >
                {prop.text}
              </Button>
            )}
          </li>
        );
      }):null}
    </ul>
  );
}

Pagination.defaultProps = {
  color: "primary"
};

export default withStyles(paginationStyle)(Pagination);
