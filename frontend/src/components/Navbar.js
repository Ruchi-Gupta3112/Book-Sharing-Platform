import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setToken, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div>
        <p className="nav-eyebrow">Read, lend, and discover together</p>
        <h1>BookCircle</h1>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/admin">Admin Panel</Link>
        <Link to="/help">Help</Link>
        <Link to="/profile">My Profile</Link>
        <span className="nav-user">{user?.name || "Reader"}</span>
        <span className="nav-logout" onClick={handleLogout}>
          Logout
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
