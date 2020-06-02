import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";

const OhTableHeader = props => {
  const { columns, hasCheckbox, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, classes } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {hasCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "Select all" }}
            />
          </TableCell>
        )}
        {columns.map((column, index) => (
          <TableCell
            key={index}
            align={column.align || "left"}
            padding="default"
            sortDirection={orderBy === column.path ? order : false}
            className={classes.header}
          >
            {column.sortable === false ? (
              column.header
            ) : (
              <TableSortLabel
                active={orderBy === column.path}
                direction={order}
                onClick={createSortHandler(column.path)}
              >
                {column.header}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default OhTableHeader;
