import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "../Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth(); // Get the Firebase auth instance

  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful.");
      navigate("/"); // Redirect to the login page after successful logout
    } catch (error: any) {
      console.error("Error during sign-out:", error.message);
    }
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setHidden(currentScrollY > lastScrollY); // Hide navbar when scrolling down
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`navbar ${hidden ? "hidden" : ""}`}>
      <h1 className="navbar-title">Fantasy Fusion</h1>
      <div className="navbar-links">
        <span onClick={() => navigate("/home")} className="nav-link">
          Home
        </span>
        <span onClick={() => navigate("/profile")} className="nav-link">
          Profile
        </span>
        <span onClick={handleLogout} className="nav-link">
          Logout
        </span>
      </div>
    </div>
  );
};

export default Navbar;