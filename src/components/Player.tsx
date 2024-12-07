import React from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";

interface Player {
  name: string;
  team: string;
  points: number;
  stats: string;
}

const Player: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const playerData: Record<string, Player> = {
    1: { name: "Player 1", team: "Team A", points: 50, stats: "Details about Player 1's performance." },
    2: { name: "Player 2", team: "Team B", points: 30, stats: "Details about Player 2's performance." },
    3: { name: "Player 3", team: "Team C", points: 70, stats: "Details about Player 3's performance." },
    4: { name: "Player 4", team: "Team D", points: 20, stats: "Details about Player 4's performance." },
  };

  // Check if id is defined and exists in playerData
  const player = id && playerData[id];

  if (!player) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <h2 className="header">Player not found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2 className="header">{player.name}</h2>
        <div className="full-width card">
          <p>Team: {player.team}</p>
          <p>Points: {player.points}</p>
          <p>Stats: {player.stats}</p>
        </div>
      </div>
    </>
  );
};

export default Player;
