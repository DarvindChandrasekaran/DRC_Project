import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    padding: 5,
  },
  [`&.${tableCellClasses.head}`]: {
    border: 0,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "& td, & th": {
    border: 0,
  },
}));

const headerColumn = [
  { id: "trans-number", label: "#", Width: 10 },
  { id: "coin-name", label: "Name", minWidth: 10 },
  {
    id: "date-purchase",
    label: "Date Purchase",
    minWidth: 10,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "transaction-type",
    label: "Type",
    minWidth: 10,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "coin-quantity",
    label: "Quantity",
    minWidth: 10,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "coin-price",
    label: "Price",
    minWidth: 0,
    align: "left",
    format: (value) => value.toFixed(2),
  },

  {
    id: "total-price",
    label: "Total",
    minWidth: 0,
    align: "left",
    format: (value) => value.toFixed(2),
  },
];

export default function CustomizedTables(props) {
  const { theme } = props;
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 1,
          scrollbarWidth: "none" /* Firefox */,
          "&::-webkit-scrollbar": {
            display: "none" /* Chrome */,
          },
          "@media (max-width: 768px)": {
            maxHeight: "150px",
          },
        }}
      >
        <Table
          stickyHeader
          sx={{
            width: "100%",
            "& .MuiTableCell-root": {
              fontSize: 12,
              border: 0,
            },
            "@media (max-width: 410px)": {
              "& .MuiTableCell-root": {
                fontSize: 10,
                p: 0.3,
              },
            },
          }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              {headerColumn.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  sx={{ fontWeight: "bold", padding: 0.5 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.transData.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell className="table-cell" align="left">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell className="table-cell" align="left">
                  {row.currency}
                </StyledTableCell>
                <StyledTableCell
                  className="table-cell"
                  sx={{ width: "fit-content" }}
                  align="left"
                >
                  {row.transaction_time}
                </StyledTableCell>
                <StyledTableCell className="table-cell" align="left">
                  {row.transaction_type}
                </StyledTableCell>
                <StyledTableCell className="table-cell" align="left">
                  {row.quantity}
                </StyledTableCell>
                <StyledTableCell className="table-cell" align="left">
                  {row.current_price}
                </StyledTableCell>
                <StyledTableCell className="table-cell" align="left">
                  {Number.parseFloat(row.current_price * row.quantity).toFixed(
                    10
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
