import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

interface Player {
  id: number;
  name: string;
  team: string;
  points: number;
  image: string;
}

const League: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const players: Player[] = [
    { id: 1, name: "Player 1", team: "Team A", points: 50, image: "https://via.placeholder.com/50" },
    { id: 2, name: "Player 2", team: "Team B", points: 30, image: "https://via.placeholder.com/50" },
    { id: 3, name: "Player 3", team: "Team C", points: 70, image: "https://via.placeholder.com/50" },
    { id: 4, name: "Player 4", team: "Team D", points: 20, image: "https://via.placeholder.com/50" },
  ];

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2 className="header">League Players</h2>
        <input
          type="text"
          placeholder="Search Players"
          className="full-width"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button style={{ marginTop: "20px" }}>Add Player</button>
        <ul className="player-list">
          {filteredPlayers.map((player) => (
            <li
              key={player.id}
              className="player-item"
              onClick={() => navigate(`/player/${player.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={player.image} alt={player.name} className="player-image" />
              <div className="player-info">
                <h3>{player.name}</h3>
                <p>Team: {player.team}</p>
                <p>Points: {player.points}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default League;
