import "./Navbar.css";
import { useAuth } from "../../../context/authContext"; // Importa el hook useAuth

export const Navbar = () => {
  const { user } = useAuth(); // Obtiene el estado del usuario del contexto

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src="/barrancas-logo.png" alt="logo" className="logo-img" />
        </div>
        <div className="menu-line">
          <img src="/menu-line.png" alt="menu" className="menu-img" />
        </div>
        <div className="user-container">
          <img src="/user-line.png" alt="user" className="user-img" />
          <span className="user-name">{user || "User Name"}</span>
          {/* <span className="user-name">User Name</span> */}
          <img src="/arrow-down-s-line.png" alt="arrow" className="arrow-img" />
        </div>
      </nav>
    </>
  );
};
