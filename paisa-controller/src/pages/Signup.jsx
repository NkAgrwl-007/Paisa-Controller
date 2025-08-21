import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // ✅ Send Signup Data to Backend
      const res = await axios.post("http://localhost:5000/api/users/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 201) {
        // ✅ Ensure backend returns { id, name, email, token }
        const userData = {
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          token: res.data.token,
        };

        // ✅ Save User Data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ Redirect to Home after Signup
        navigate("/home");
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
