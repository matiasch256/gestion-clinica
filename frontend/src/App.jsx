import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import MainLayout from "./components/common/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { RoleBasedRoute } from "./components/common/RoleBasedRoute";
import { homeMenuItems } from "./components/pages/home/homeMenuItems";
import { Form } from "./components/pages/form/Form";
import { Home } from "./components/pages/home/Home";
import { Unauthorized } from "./components/pages/Unauthorized";
import { Usuario } from "./components/pages/usuarios/Usuario";
import { ComprasDashboard } from "./components/pages/compras/comprasDashboard/ComprasDashboard";
import { RegistrarCompras } from "./components/pages/compras/registrarCompras/RegistrarCompras";
import ModificarCompra from "./components/pages/compras/modificarCompra/ModificarCompra";
import ListaCompras from "./components/pages/compras/listaCompras/ListaCompras";
import DetalleCompra from "./components/pages/compras/detalleCompra/DetalleCompra";
import ComprasReportes from "./components/pages/compras/comprasReportes/ComprasReportes";
import { RegistrarProducto } from "./components/pages/productos/registrarProducto/RegistrarProducto";
import { ProductosDashboard } from "./components/pages/productos/productosDashboard/ProductosDashboard";
import { ListaProductos } from "./components/pages/productos/listaProductos/ListaProductos";
import { DetalleProducto } from "./components/pages/productos/detalleProducto/DetalleProducto";
import { ModificarProducto } from "./components/pages/productos/modificarProducto/ModificarProducto";
import { ListadoCategorias } from "./components/pages/categorias/listadocategorias/ListadoCategorias";
import { RegistrarCategoria } from "./components/pages/categorias/registrarCategoria/RegistrarCategoria";
import { ActualizarCategoria } from "./components/pages/categorias/actualizarcategorias/ActualizarCategoria";
import { CategoriasDashboard } from "./components/pages/categorias/categoriasDashBoard/CategoriasDashBoard";
import { ProveedoresDashBoard } from "./components/pages/Proveedores/ProveedoresDashboard";
import { RegistrarProveedor } from "./components/pages/Proveedores/registrarproveedor/RegistrarProveedor";
import { ActualizarProveedor } from "./components/pages/Proveedores/actualizarproveedores/ActualizarProveedor";
import { ListadoProveedores } from "./components/pages/Proveedores/listaproveedores/ListadoProveedores";
import RegistrarTurno from "./components/pages/Turnos/RegistrarTurno";
import ListaTurnos from "./components/pages/Turnos/ListaTurnos";
import { HistorialTurnosPaciente } from "./components/pages/Turnos/HistorialTurnosPaciente";
import DetalleTurno from "./components/pages/Turnos/DetalleTurno";
import { ListadoPacientes } from "./components/pages/pacientes/ListadoPacientes";
import { RegistrarPaciente } from "./components/pages/pacientes/RegistrarPaciente";
import { DetallePaciente } from "./components/pages/pacientes/DetallePaciente";
import { RegistrarFactura } from "./components/pages/facturas/RegistrarFactura";
import { ListadoFacturas } from "./components/pages/facturas/ListadoFacturas";
import { DetalleFactura } from "./components/pages/facturas/DetalleFactura";
import { ReporteStockCritico } from "./components/pages/reportes/ReporteStockCritico";
import { ReporteAusentismo } from "./components/pages/reportes/ReporteAusentismo";
import { ReporteRentabilidad } from "./components/pages/reportes/ReporteRentabilidad";
import { ReporteStockCategoria } from "./components/pages/reportes/ReporteStockCategoria";
import { ROLES } from "./utils/roles";

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleBasedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.RECEPCION, ROLES.DEPOSITO]}
              />
            }
          >
            <Route element={<MainLayout menuItems={homeMenuItems} />}>
              <Route path="/home" element={<Home />} />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route element={<MainLayout menuItems={homeMenuItems} />}>
              <Route path="/compras" element={<ComprasDashboard />} />
              <Route path="/compras/registrar" element={<RegistrarCompras />} />
              <Route
                path="/compras/modificar/:idCompra"
                element={<ModificarCompra />}
              />
              <Route path="/compras/listaCompras" element={<ListaCompras />} />
              <Route
                path="/compras/detalle/:idCompra"
                element={<DetalleCompra />}
              />
              <Route path="/compras/reportes" element={<ComprasReportes />} />

              <Route path="/proveedores" element={<ProveedoresDashBoard />} />
              <Route
                path="/proveedores/registrar"
                element={<RegistrarProveedor />}
              />
              <Route
                path="/proveedores/actualizar/:id"
                element={<ActualizarProveedor />}
              />
              <Route
                path="/proveedores/consultar"
                element={<ListadoProveedores />}
              />

              <Route
                path="/reportes/ausentismo"
                element={<ReporteAusentismo />}
              />
              <Route
                path="/reportes/rentabilidad"
                element={<ReporteRentabilidad />}
              />
            </Route>
            <Route path="/usuarios" element={<Usuario />} />
          </Route>

          <Route
            element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.DEPOSITO]} />
            }
          >
            <Route element={<MainLayout menuItems={homeMenuItems} />}>
              <Route path="/productos" element={<ProductosDashboard />} />
              <Route
                path="/productos/registrar"
                element={<RegistrarProducto />}
              />
              <Route path="/productos/lista" element={<ListaProductos />} />
              <Route
                path="/productos/detalle/:id"
                element={<DetalleProducto />}
              />
              <Route
                path="/productos/modificar/:idProducto"
                element={<ModificarProducto />}
              />

              <Route path="/categorias" element={<CategoriasDashboard />} />
              <Route
                path="/categorias/consultar"
                element={<ListadoCategorias />}
              />
              <Route
                path="/categorias/registrar"
                element={<RegistrarCategoria />}
              />
              <Route
                path="/categorias/actualizar/:id"
                element={<ActualizarCategoria />}
              />

              <Route path="/reportes/stock" element={<ReporteStockCritico />} />
              <Route
                path="/reportes/stock-categoria"
                element={<ReporteStockCategoria />}
              />
            </Route>
          </Route>

          <Route
            element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPCION]} />
            }
          >
            <Route element={<MainLayout menuItems={homeMenuItems} />}>
              <Route path="/turnos/registrar" element={<RegistrarTurno />} />
              <Route path="/turnos/ListaTurnos" element={<ListaTurnos />} />
              <Route
                path="/turnos/modificar/:turnoId"
                element={<RegistrarTurno />}
              />
              <Route
                path="/turnos/detalle/:turnoId"
                element={<DetalleTurno />}
              />
              <Route
                path="/turnos/historial"
                element={<HistorialTurnosPaciente />}
              />

              <Route
                path="/pacientes/consultar"
                element={<ListadoPacientes />}
              />
              <Route
                path="/pacientes/registrar"
                element={<RegistrarPaciente />}
              />
              <Route
                path="/pacientes/modificar/:id"
                element={<RegistrarPaciente />}
              />
              <Route
                path="/pacientes/detalle/:id"
                element={<DetallePaciente />}
              />

              <Route
                path="/facturacion/consultar"
                element={<ListadoFacturas />}
              />
              <Route
                path="/facturacion/registrar"
                element={<RegistrarFactura />}
              />
              <Route
                path="/facturacion/detalle/:facturaId"
                element={<DetalleFactura />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
