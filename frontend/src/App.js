import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Help from "./pages/Help";
import UserProfile from "./pages/UserProfile";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      const rawUser = localStorage.getItem("user");
      setUser(rawUser ? JSON.parse(rawUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleTokenChange = (value) => {
    setToken(value);
    if (!value) {
      setUser(null);
    }
  };

  return (
    <Router>
      {token ? (
        <Navbar user={user} setToken={handleTokenChange} setUser={setUser} />
      ) : null}
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage setToken={handleTokenChange} setUser={setUser} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard user={user} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin"
          element={token ? <AdminPanel user={user} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/help"
          element={token ? <Help /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={token ? <UserProfile user={user} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
