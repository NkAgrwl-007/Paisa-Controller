import React from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ✅ Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Savings from "./pages/Savings";
import Reports from "./pages/Reports";
import AIInsights from "./pages/AIInsight";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AIInsight from "./pages/AIInsight";
import "./styles/global.css";

// ✅ Protected Route Component
const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // check JWT token
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <div className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
      {!hideNavAndFooter && <Footer />}
    </>
  );
};

export default App;
