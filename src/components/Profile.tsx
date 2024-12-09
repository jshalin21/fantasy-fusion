import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const loggedInEmail = localStorage.getItem("email"); // Retrieve the email stored during login/signup

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
            setUserInfo(data.data[0]); // Use the first user returned since email is unique
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Your Profile</h2>
        <p>
          <strong>Name:</strong> {userInfo?.name}
        </p>
        <p>
          <strong>Email:</strong> {userInfo?.email}
        </p>
        <button onClick={() => navigate("/home")}>Go Back to Home</button>
      </div>
    </div>
  );
};

export default Profile;
