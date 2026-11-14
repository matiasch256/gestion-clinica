import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const ActionButton = ({
  title,
  onClick,
  hoverColor = "primary.main",
  disabled,
  children,
}) => (
  <Tooltip title={title}>
    <span>
      <IconButton
        size="small"
        aria-label={title}
        onClick={onClick}
        disabled={disabled}
        sx={{ color: "text.secondary", "&:hover": { color: hoverColor } }}
      >
        {children}
      </IconButton>
    </span>
  </Tooltip>
);

// Acciones por fila, iguales en todos los listados. Son neutras en reposo
// y toman color al pasar el cursor: eliminar es la única en rojo.
const RowActions = ({
  onView,
  onEdit,
  onDelete,
  deleteLabel = "Eliminar",
  deleteDisabled = false,
  children,
}) => (
  <Box sx={{ display: "inline-flex", gap: 0.5 }}>
    {onView && (
      <ActionButton title="Ver detalle" onClick={onView}>
        <VisibilityOutlinedIcon fontSize="small" />
      </ActionButton>
    )}
    {onEdit && (
      <ActionButton title="Editar" onClick={onEdit}>
        <EditOutlinedIcon fontSize="small" />
      </ActionButton>
    )}
    {children}
    {onDelete && (
      <ActionButton
        title={deleteLabel}
        onClick={onDelete}
        disabled={deleteDisabled}
        hoverColor="error.main"
      >
        <DeleteOutlineIcon fontSize="small" />
      </ActionButton>
    )}
  </Box>
);

export default RowActions;
