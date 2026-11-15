// Estado de stock de un producto. "tone" es un color de estado del tema.
export const getStockStatus = (stock, stockMinimo) => {
  if (stock <= stockMinimo) return { tone: "error", label: "Bajo" };
  if (stock <= stockMinimo * 1.1) {
    return { tone: "warning", label: "Cerca del mínimo" };
  }
  return { tone: "success", label: "OK" };
};
