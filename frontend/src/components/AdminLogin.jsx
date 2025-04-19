import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const AdminLogin = ({ onAdminLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    // In a real application, you would authenticate against a backend
    if (username === "admin" && password === "admin") {
      onAdminLogin(); // Update the admin login status in App.js
      navigate("/votes");
    } else {
      alert("Admin login failed. Invalid credentials.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAdminLogin();
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center text-center vh-100"
      style={{ backgroundColor: "rgb(76,175,80)" }}
    >
      <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
        <h2 className="mb-3" style={{ color: "rgb(76,175,80)" }}>
          Admin Login
        </h2>
        <div className="mb-3 text-start">
          <label htmlFor="adminUsername" className="form-label">
            <strong>Username</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="adminUsername"
            placeholder="Enter Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown} // Add onKeyDown handler
          />
        </div>
        <div className="mb-3 text-start">
          <label htmlFor="adminPassword" className="form-label">
            <strong>Password</strong>
          </label>
          <input
            type="password"
            className="form-control"
            id="adminPassword"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown} // Add onKeyDown handler
          />
        </div>
        <button
          onClick={handleAdminLogin}
          className="btn btn-primary"
          style={{
            backgroundColor: "rgb(76,175,80)",
            color: "white",
            borderColor: "rgb(76,175,80)",
          }}
        >
          Admin Login
        </button>
        <p className="mt-3">
          <Link to="/login" className="btn btn-secondary">
            Back to User Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
