import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", credentials);
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        credentials,
        { withCredentials: true }
      );

      console.log("Response from server:", response.data);
      setMessage(response.data.message);

      if (response.status === 200 && response.data.user) {
        const { isAdmin, email } = response.data.user;
        localStorage.setItem("isAdmin", isAdmin);
        localStorage.setItem("email", email);
        navigate("/home");
      } else {
        setMessage("User data not found in the response.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      setMessage(error?.response?.data?.message || "Server is unreachable. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p className="error-message">{message}</p>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
