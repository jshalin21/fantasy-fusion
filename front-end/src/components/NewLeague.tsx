import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NewLeagueProps {
  onClose: (refresh: boolean) => void; 
}

const NewLeague: React.FC<NewLeagueProps> = ({ onClose }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateLeague = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      setError("You must be logged in to create a league.");
      return;
    }

    try {
      const userResponse = await fetch(`https://fantasy-fusion.vercel.app/api/users?email=${email}`);
      const userData = await userResponse.json();

      if (!userResponse.ok || !userData.data || userData.data.length === 0) {
        setError("Failed to retrieve user information.");
        return;
      }

      const userId = userData.data[0]._id; 

      const leagueResponse = await fetch("https://fantasy-fusion.vercel.app/api/leagues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, userId }),
      });

      if (leagueResponse.ok) {
        onClose(true);
      } else {
        const leagueData = await leagueResponse.json();
        setError(leagueData.message || "Failed to create league.");
      }
    } catch (err) {
      setError("An error occurred while creating the league.");
    }
  };

  return (
    <div className="form-container">
      <h2>Create a New League</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="League Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="League Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="modal-actions">
        <button onClick={handleCreateLeague}>Create League</button>
        <button onClick={() => onClose(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default NewLeague;
