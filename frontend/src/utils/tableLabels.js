// Textos en español para <TablePagination>. Uso: {...paginationLabels}
export const paginationLabels = {
  labelRowsPerPage: "Filas por página:",
  labelDisplayedRows: ({ from, to, count }) =>
    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
};

export const countLabel = (count, singular, plural) =>
  `${count} ${count === 1 ? singular : plural}`;
