import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  TextField,
  InputAdornment,
  Button,
  Stack,
} from "@mui/material";

import { icons } from "../../../utils/icons";

export const GenericTable = ({
  columns,
  data = [],
  actions,
  title,
  searchPlaceholder = "Buscar...",
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.id];
      return (
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300, bgcolor: "background.paper" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  {icons.search}
                </Box>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1}>
          {actions?.onExportExcel && (
            <Button
              variant="outlined"
              color="success"
              startIcon={icons.excel}
              onClick={actions.onExportExcel}
              disabled={filteredData.length === 0}
            >
              Excel
            </Button>
          )}

          {actions?.onExportPDF && (
            <Button
              variant="outlined"
              color="error"
              startIcon={icons.pdf}
              onClick={actions.onExportPDF}
              disabled={filteredData.length === 0}
            >
              PDF
            </Button>
          )}

          {actions?.onAdd && (
            <Button
              variant="contained"
              startIcon={icons.add}
              onClick={actions.onAdd}
              sx={{ fontWeight: "bold", textTransform: "none", px: 3, ml: 1 }}
            >
              Nuevo
            </Button>
          )}
        </Stack>
      </Box>
      <TableContainer
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{
                    color: "primary.contrastText",
                    fontWeight: "bold",
                    py: 2,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              {(actions?.onEdit || actions?.onDelete || actions?.onView) && (
                <TableCell
                  sx={{
                    color: "primary.contrastText",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={index} hover>
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      {col.render ? col.render(row) : row[col.id]}
                    </TableCell>
                  ))}

                  {(actions?.onEdit ||
                    actions?.onDelete ||
                    actions?.onView) && (
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        {actions.onView && (
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => actions.onView(row)}
                          >
                            {icons.view}
                          </IconButton>
                        )}
                        {actions.onEdit && (
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => actions.onEdit(row)}
                          >
                            {icons.edit}
                          </IconButton>
                        )}
                        {actions.onDelete && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => actions.onDelete(row)}
                          >
                            {icons.delete}
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas:"
      />
    </Paper>
  );
};
