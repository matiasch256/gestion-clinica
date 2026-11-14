import { Skeleton, TableCell, TableRow } from "@mui/material";

const SkeletonRows = ({ rows = 5, columns }) =>
  Array.from({ length: rows }).map((_, row) => (
    <TableRow key={row}>
      {Array.from({ length: columns }).map((__, column) => (
        <TableCell key={column}>
          <Skeleton variant="text" width="70%" />
        </TableCell>
      ))}
    </TableRow>
  ));

export default SkeletonRows;
