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
  const navigate = useNavigate();

  const handleFaceCapture = (capturedFaceData) => {
    setFaceData(capturedFaceData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!faceData) {
      alert("Please capture your face before registering.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await axios.post("http://localhost:3001/register", { 
        name, 
        email, 
        password,
        faceData 
      });
      
      if (result.data === "Already registered") {
        alert("E-mail already registered! Please Login to proceed.");
        navigate("/login");
      } else {
        alert("Registered successfully! Please Login to proceed.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputEmail1" className="form-label">
                <strong>Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                className="form-control"
                id="exampleInputname"
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
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
            <div className="mb-3">
              <label className="form-label">
                <strong>Face Capture</strong>
              </label>
              <FaceCapture onFaceCapture={handleFaceCapture} mode="capture" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{
                backgroundColor: "rgb(76,175,80)",
                color: "white",
                borderColor: "rgb(76,175,80)",
              }}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="container my-2">Already have an account ?</p>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
