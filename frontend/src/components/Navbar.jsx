import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../assets/styles/Navbar.css";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">❤️</div>
        <span className="navbar-title">HeartBuddy</span>
      </div>

      <div className="navbar-right">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
