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

  const player = id && playerData[id];

  if (!player) {
    return (
      <>
        <Navbar />
        <div className="page-container" style={styles.pageContainer}>
          <h2 style={styles.header}>Player not found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container" style={styles.pageContainer}>
        <h2 style={styles.header}>{player.name}</h2>
        <div style={styles.card}>
          <p style={styles.text}>Team: {player.team}</p>
          <p style={styles.text}>Points: {player.points}</p>
          <p style={styles.text}>Stats: {player.stats}</p>
        </div>
      </div>
    </>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#000", // Black background
    color: "#fff", // White text for contrast
    padding: "20px",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "20px",
  },
  card: {
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "#1a1a1a", // Dark card background
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    textAlign: "center" as const,
  },
  text: {
    fontSize: "18px",
    color: "#d1d1d1", // Light gray text
    margin: "10px 0",
  },
};

export default Player;
