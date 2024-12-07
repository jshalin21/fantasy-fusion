import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(""); // Stores the email input
  const [password, setPassword] = useState<string>(""); // Stores the password input
  const [error, setError] = useState<string>(""); // Stores any error messages

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", userCredential.user);
      navigate("/home"); // Navigate to the home page on successful login
    } catch (err: any) {
      console.error("Error during login:", err.message);
      setError(err.message); // Set the error message to display to the user
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Fantas Fusion Login</h2>
        <p>Enter your credentials to access your account</p>
        {error && <p className="error-message">{error}</p>} {/* Show error if any */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Log In</button>
        <a onClick={() => navigate("/signup")}>Don't have an account? Sign Up</a>
      </div>
    </div>
  );
};

export default Login;
