import React from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css"; // you can rename to navbar.css if you prefer

const Sidebar = () => {
  return (
    <nav className="nav-menu">
      <ul className="nav-links">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/savings">Savings</Link>
        </li>
        <li>
          <Link to="/budget">Budget</Link>
        </li>
        <li>
          <Link to="/report">Reports</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
