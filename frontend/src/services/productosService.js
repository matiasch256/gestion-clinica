const API_URL = "http://localhost:3000/api/productos";

export const getProductos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener productos");
  return response.json();
};

export const deleteProducto = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar producto");
  return response.json();
};
