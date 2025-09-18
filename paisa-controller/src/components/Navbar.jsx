// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(
    () =>
      JSON.parse(localStorage.getItem("user")) || {
        name: "User",
        email: "user@email.com",
      }
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ⬅️ controls sidebar toggle
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsPanelOpen(false);
    navigate("/login");
  };

  const handleSaveProfile = () => {
    setUser(editForm);
    localStorage.setItem("user", JSON.stringify(editForm));
    setIsEditOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-brand">
            {user && (
              <div
                className="sidebar-user top"
                onClick={() => setIsPanelOpen(!isPanelOpen)}
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            )}
            <h2>Paisa Controller</h2>
          </div>

          <ul className="sidebar-links">
            <li className={location.pathname === "/dashboard" ? "active" : ""}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li
              className={location.pathname === "/transactions" ? "active" : ""}
            >
              <Link to="/transactions">Transactions</Link>
            </li>
            <li className={location.pathname === "/budgets" ? "active" : ""}>
              <Link to="/budgets">Budgets</Link>
            </li>
            <li className={location.pathname === "/savings" ? "active" : ""}>
              <Link to="/savings">Savings</Link>
            </li>
            <li className={location.pathname === "/reports" ? "active" : ""}>
              <Link to="/reports">Reports</Link>
            </li>
            <li
              className={location.pathname === "/ai-insights" ? "active" : ""}
            >
              <Link to="/ai-insights">AI Insights</Link>
            </li>
          </ul>
        </div>
      )}

      {/* Overlay Panel */}
      {isPanelOpen && user && (
        <div className="user-panel-overlay">
          <div className="user-panel slide-in">
            <button
              className="close-btn"
              onClick={() => setIsPanelOpen(false)}
            >
              ✖
            </button>

            {!isEditOpen && (
              <>
                <div className="user-info">
                  <h3>{user?.name || "User"}</h3>
                  <p className="email">
                    {user?.email || "Email not available"}
                  </p>
                </div>

                <button
                  className="theme-btn"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>

                <button
                  className="edit-btn"
                  onClick={() => setIsEditOpen(true)}
                >
                  ✏️ Edit Profile
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </>
            )}

            {isEditOpen && (
              <div className="edit-panel">
                <h3>Edit Profile</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
                <div className="modal-actions">
                  <button className="save-btn" onClick={handleSaveProfile}>
                    💾 Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setIsEditOpen(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
