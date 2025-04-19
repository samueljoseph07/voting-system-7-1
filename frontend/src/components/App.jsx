import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import VoteCounts from "./VoteCounts";
import AdminLogin from "./AdminLogin"; // Import the AdminLogin component
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import { useState } from "react";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <div style={{ marginTop: "0rem" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/login"
            element={
              <AdminLogin onAdminLogin={() => setIsAdminLoggedIn(true)} />
            }
          />
          <Route path="/home" element={<Home />} />
          {/* Make VoteCounts accessible only if isAdminLoggedIn is true */}
          <Route
            path="/votes"
            element={
              isAdminLoggedIn ? <VoteCounts /> : <Navigate to="/admin/login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
