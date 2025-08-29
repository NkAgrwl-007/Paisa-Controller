import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Navbar = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsPanelOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Paisa Controller</h2>
        </div>
        <ul className="navbar-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/budgets">Budgets</Link></li>
          <li><Link to="/savings">Savings</Link></li>
          <li><Link to="/reports">Reports</Link></li>
        </ul>
        {user && (
          <div className="user-profile" onClick={() => setIsPanelOpen(!isPanelOpen)}>
            <div className="user-icon">
              {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user.name || user.username || "User"}</span>
          </div>
        )}
      </nav>

      {isPanelOpen && user && (
        <div className="dropdown-panel" ref={panelRef}>
          <h3>{user?.name || user?.username || "User"}</h3>
          <p>Email: {user.email || "N/A"}</p>
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode 🌞" : "Dark Mode 🌙"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
};

export default Navbar;
