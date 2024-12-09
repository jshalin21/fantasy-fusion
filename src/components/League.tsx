import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useLeagues } from "./Home";

const League: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { leagues, setLeaguesArray } = useLeagues();
  const navigate = useNavigate();

  const leagueIndex = parseInt(id || "0");
  const league = leagues[leagueIndex];

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleDeleteLeague = () => {
    const confirmed = window.confirm(`Are you sure you want to delete the league "${league?.name}"?`);
    if (confirmed) {
      const updatedLeagues = leagues.filter((_, index) => index !== leagueIndex);
      setLeaguesArray(updatedLeagues);
      navigate("/home"); // Navigate back to home after deletion
    }
  };

  if (!league) {
    return <div>League not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <button onClick={() => navigate("/home")} style={{ marginBottom: "20px" }}>
          Back
        </button>
        <h2 className="header">{league.name}</h2>
        <p>{league.description}</p>

        {/* Delete League Button */}
        <button
          onClick={handleDeleteLeague}
          style={{
            marginTop: "20px",
            backgroundColor: "#d50a0a",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Delete League
        </button>

        {/* Placeholder for Player Management */}
        <input
          type="text"
          placeholder="Search Players"
          className="full-width"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ul className="player-list">
          {league.players.map((player, index) => (
            <li key={index} className="player-item">
              <h3>{player}</h3>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default League;
