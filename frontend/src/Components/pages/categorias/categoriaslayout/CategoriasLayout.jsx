import "./CategoriasLayout.css";
import { Link, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "../../../layouts/navbar/Navbar";

export const CategoriasLayout = () => {
  return (
    <>
      <Navbar />
      <div className="compras-wrapper">
        <aside className="sidebar">
          <h2>Módulo Categorias</h2>
          <ul>
            <li>
              <Link to="/home">
                <button>Home</button>
              </Link>
            </li>
            <li>
              <Link to="/categorias">
                <button>Dashboard</button>
              </Link>
            </li>
            <li>
              <Link to="/categorias/registrar">
                <button>Registrar categoria</button>
              </Link>
            </li>
            <li>
              <Link to="/categorias/consultar">
                <button>Modificar categoria</button>
              </Link>
            </li>

            {/* <li>
              <Link to="/compras">
                <button>Compras</button>
              </Link>
            </li>
            <li>
              <Link to="/Proveedores">
                <button>Proveedores</button>
              </Link>
            </li> */}
          </ul>
        </aside>

        <main className="compras-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};
