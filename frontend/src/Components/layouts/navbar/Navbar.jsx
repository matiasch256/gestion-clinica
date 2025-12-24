import { useAuth } from "../../../context/authContext";

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.jpg" alt="logo" className="logo-img" />
        </div>
        <div className="menu-line">
          <img src="/menu-line.png" alt="menu" className="menu-img" />
        </div>
        <div className="user-container">
          <img src="/user-line.png" alt="user" className="user-img" />
          <span className="user-name">{user || "User Name"}</span>
          <img src="/arrow-down-s-line.png" alt="arrow" className="arrow-img" />
        </div>
      </nav>
    </>
  );
};
