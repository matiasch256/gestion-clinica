import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Form } from "./components/pages/form/Form";

import { ComprasLayout } from "./components/pages/compras/comprasLayout/ComprasLayout";
import { ComprasDashboard } from "./components/pages/compras/comprasDashboard/ComprasDashboard";
import { RegistrarCompras } from "./components/pages/compras/registrarCompras/RegistrarCompras";
import { Proveedores } from "./components/pages/Proveedores/Proveedores";

import { ProveedoresDashBoard } from "./Components/pages/Proveedores/ProveedoresDashboard";
import { Usuario } from "./components/pages/usuarios/Usuario";

import ModificarCompra from "./components/pages/compras/modificarCompra/ModificarCompra";
import ListaCompras from "./components/pages/compras/listaCompras/ListaCompras";
import DetalleCompra from "./components/pages/compras/detalleCompra/DetalleCompra";
import ComprasReportes from "./components/pages/compras/comprasReportes/ComprasReportes";
import { AuthProvider } from "./context/authContext";
import { ProductosLayout } from "./components/pages/productos/productosLayout/ProductosLayout";
import { RegistrarProducto } from "./components/pages/productos/registrarProducto/RegistrarProducto";
import { ProductosDashboard } from "./components/pages/productos/productosDashboard/ProductosDashboard";
import { ListaProductos } from "./components/pages/productos/listaProductos/ListaProductos";
import { DetalleProducto } from "./components/pages/productos/detalleProducto/DetalleProducto";
import { ModificarProducto } from "./components/pages/productos/modificarProducto/ModificarProducto";
import { ListadoCategorias } from "./components/pages/categorias/listadocategorias/ListadoCategorias";
import { RegistrarCategoria } from "./components/pages/categorias/registrarCategoria/RegistrarCategoria";
import { CategoriasLayout } from "./components/pages/categorias/categoriaslayout/categoriaslayout";
import { ActualizarCategoria } from "./components/pages/categorias/actualizarcategorias/ActualizarCategoria";
import { CategoriasDashboard } from "./components/pages/categorias/categoriasDashBoard/CategoriasDashBoard";
import { RegistrarProveedor } from "./components/pages/Proveedores/registrarproveedor/RegistrarProveedor";
import { ActualizarProveedor } from "./components/pages/Proveedores/actualizarproveedores/ActualizarProveedor";
import { ListadoProveedores } from "./components/pages/Proveedores/listaproveedores/ListadoProveedores";
import { Home } from "./components/pages/home/Home";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Form />} />

            {/* HOME */}
            <Route path="/home" element={<Home />} />

            {/* DASHBOARD */}
            {/* PROVEEDORES */}
            <Route path="/Proveedores" element={<Proveedores />}>
              <Route index element={<ProveedoresDashBoard />} />
              <Route path="registrar" element={<RegistrarProveedor />} />
              <Route path="actualizar/:id" element={<ActualizarProveedor />} />
              <Route path="consultar" element={<ListadoProveedores />} />
            </Route>

            <Route path="/usuarios" element={<Usuario />} />
            {/* COMPRAS */}
            <Route path="/compras" element={<ComprasLayout />}>
              <Route index element={<ComprasDashboard />} />
              <Route path="registrar" element={<RegistrarCompras />} />
              <Route path="modificar/:idCompra" element={<ModificarCompra />} />
              <Route path="listaCompras" element={<ListaCompras />} />
              <Route path="detalle/:idCompra" element={<DetalleCompra />} />
              <Route path="reportes" element={<ComprasReportes />} />
            </Route>
            {/* PRODUCTOS */}

            <Route path="/productos" element={<ProductosLayout />}>
              <Route index element={<ProductosDashboard />} />
              <Route path="registrar" element={<RegistrarProducto />} />
              <Route path="lista" element={<ListaProductos />} />
              <Route
                path="/productos/detalle/:id"
                element={<DetalleProducto />}
              />
              <Route
                path="/productos/modificar/:idProducto"
                element={<ModificarProducto />}
              />
              {/* CATEGORIAS */}
            </Route>
            <Route path="/categorias" element={<CategoriasLayout />}>
              <Route index element={<CategoriasDashboard />} />
              <Route path="consultar" element={<ListadoCategorias />} />
              <Route path="registrar" element={<RegistrarCategoria />} />
              <Route path="actualizar/:id" element={<ActualizarCategoria />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
