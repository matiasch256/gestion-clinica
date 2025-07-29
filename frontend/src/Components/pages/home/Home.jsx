import { Navbar } from "../../layouts/navbar/Navbar";
import "./Home.css";
import { Link } from "react-router-dom"; // Outlet is not directly used here but good to keep if you have nested routes

export const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1 className="home-title">Bienvenido a la Gestión de Inventario</h1>
        <p className="home-subtitle">Selecciona un módulo para comenzar:</p>

        <div className="modules-grid">
          {/* Módulo de Compras */}
          <Link to="/compras" className="module-card">
            <div className="module-icon">🛒</div> {/* Ícono de compra */}
            <h2 className="module-title">Compras</h2>
            <p className="module-description">
              Gestiona tus órdenes de compra y recibos de mercancía.
            </p>
          </Link>

          {/* Módulo de Proveedores */}
          <Link to="/proveedores" className="module-card">
            <div className="module-icon">🚚</div> {/* Ícono de proveedor */}
            <h2 className="module-title">Proveedores</h2>
            <p className="module-description">
              Administra la información de tus proveedores.
            </p>
          </Link>

          {/* Módulo de Productos */}
          <Link to="/productos" className="module-card">
            <div className="module-icon">📦</div> {/* Ícono de producto */}
            <h2 className="module-title">Productos</h2>
            <p className="module-description">
              Controla tu catálogo de productos y existencias.
            </p>
          </Link>

          {/* Módulo de Categorías */}
          <Link to="/categorias" className="module-card">
            <div className="module-icon">🗂️</div> {/* Ícono de categoría */}
            <h2 className="module-title">Categorías</h2>
            <p className="module-description">
              Organiza tus productos por categorías.
            </p>
          </Link>
        </div>
      </div>
      {/* <Outlet /> if you have nested routes that should render here */}
    </>
  );
};
