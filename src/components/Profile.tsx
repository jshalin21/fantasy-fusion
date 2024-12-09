import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../Profile.css";

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null); // Holds the profile picture URL
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info
    const fetchUserInfo = async () => {
      const loggedInEmail = localStorage.getItem("email");

      if (!loggedInEmail) {
        setError("No logged-in user found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/users?email=${loggedInEmail}`);
        const data = await response.json();

        if (response.ok) {
          if (!data.data || data.data.length === 0) {
            setError("User not found in the database");
          } else {
            setUserInfo(data.data[0]);
          }
        } else {
          setError(data.message || "Failed to fetch user information");
        }
      } catch (err) {
        setError("An error occurred while fetching user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();

    // Load profile picture from localStorage
    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        setProfilePic(result);
        localStorage.setItem("profilePic", result); // Save to localStorage
      };

      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-box">
          <div className="profile-picture-container">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-picture"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="profile-upload"
            />
          </div>
          <h2>Your Profile</h2>
          <p>
            <strong>Name:</strong> {userInfo?.name}
          </p>
          <p>
            <strong>Email:</strong> {userInfo?.email}
          </p>
          <button className="profile-button" onClick={() => navigate("/home")}>
            Go Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
