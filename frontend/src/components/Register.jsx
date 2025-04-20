import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FaceCapture from "./FaceCapture";

const Register = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [faceData, setFaceData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFaceCapture = (capturedFaceData) => {
    setFaceData(capturedFaceData);
    setError(null); // Clear any previous errors when new face is captured
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!faceData) {
      setError("Please capture your face before registering.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await axios.post("http://localhost:3001/register", { 
        name, 
        email, 
        password,
        faceData 
      });
      
      if (result.data.success) {
        alert("Registered successfully! Please Login to proceed.");
        navigate("/login");
      } else {
        setError(result.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container" style={{ 
      minHeight: "100vh",
      backgroundColor: "rgb(76,175,80)",
      overflowY: "auto",
      padding: "20px 0"
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="mb-4 text-center" style={{ color: "rgb(76,175,80)" }}>
                Register
              </h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    <strong>Name</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="form-control"
                    id="name"
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <strong>Email Id</strong>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="form-control"
                    id="email"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <strong>Password</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    className="form-control"
                    id="password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Face Capture</strong>
                  </label>
                  <FaceCapture onFaceCapture={handleFaceCapture} mode="capture" />
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: "rgb(76,175,80)",
                      borderColor: "rgb(76,175,80)"
                    }}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p className="mb-2">Already have an account?</p>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
