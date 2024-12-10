import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
  
      console.log("Firebase user created:", firebaseUser);
  
      await fetch("https://fantasy-fusion.vercel.app/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          name,
          email,
        }),
      });
  
      localStorage.setItem("email", email);
  
      navigate("/home");
    } catch (err: any) {
      console.error("Error during sign-up:", err);
      setError(err.message);
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Fantasy Fusion Sign Up</h2>
        <p>Create your account to get started</p>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button onClick={handleSignUp}>Sign Up</button>
        <a onClick={() => navigate("/")}>Already have an account? Log In</a>
      </div>
    </div>
  );
};

export default SignUp;
