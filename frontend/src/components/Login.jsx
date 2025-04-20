import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FaceCapture from "./FaceCapture";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const faceCaptureRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/login", { email, password });
      
      if (result.data.success) {
        // If credentials are correct, show face verification
        setShowFaceVerification(true);
      } else {
        alert("Incorrect email or password! Please try again.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred during login.");
    }
  };

  const handleFaceVerification = async (capturedFaceData) => {
    try {
      const result = await axios.post("http://localhost:3001/verify-face", {
        email,
        faceData: capturedFaceData
      });

      if (result.data.success) {
        alert("Login successful!");
        navigate("/home");
      } else {
        alert("Face verification failed! Please try again.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred during face verification.");
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center text-center vh-100"
        style={{ backgroundColor: "rgb(76,175,80)" }}
      >
        <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
          <h2 className="mb-3" style={{ color: "rgb(76,175,80)" }}>
            Login
          </h2>
          {!showFaceVerification ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  <strong>Email Id</strong>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="form-control"
                  id="exampleInputEmail1"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  <strong>Password</strong>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "rgb(76,175,80)",
                  color: "white",
                  borderColor: "rgb(76,175,80)",
                }}
              >
                Verify Credentials
              </button>
            </form>
          ) : (
            <div>
              <h4 className="mb-3">Face Verification</h4>
              <FaceCapture
                ref={faceCaptureRef}
                onFaceCapture={handleFaceVerification}
                mode="verify"
              />
            </div>
          )}
          <p className="container my-2">Don&apos;t have an account?</p>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
          <p className="mt-3">
            Are you an admin?
            <Link to="/admin/login" className="btn btn-info ms-2">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
