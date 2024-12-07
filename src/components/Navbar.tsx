import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth(); // Get the Firebase auth instance

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful.");
      navigate("/"); // Redirect to the login page after successful logout
    } catch (error: any) {
      console.error("Error during sign-out:", error.message);
    }
  };

  return (
    <div className="navbar">
      <h1>Fantasy Fusion</h1>
      <div>
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
