import React from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import "./styles/global.css";

// ✅ Protected Route Component
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("user"); 
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <div className="container">
        <Routes>
          {/* ✅ Default Route is Signup */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />

          {/* ✅ Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
      {!hideNavAndFooter && <Footer />}
    </>
  );
};

export default App;
