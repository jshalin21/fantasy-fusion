import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>(""); 
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
  
      console.log("Firebase user logged in:", firebaseUser);
  
      localStorage.setItem("email", email);
  
      navigate("/home");
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(err.message);
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Fantasy Fusion Login</h2>
        <p>Enter your credentials to access your account</p>
        {error && <p className="error-message">{error}</p>} 
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
