import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useParams, useNavigate } from "react-router-dom";
import "../player.css"; 
interface GameStats {
  Week: number;
  Opponent: string;
  FantasyPoints: number;
  PassingYards: number;
  PassingTouchdowns: number;
  PassingInterceptions: number;
  RushingYards: number;
  RushingTouchdowns: number;
  Sacks: number;
  Fumbles: number;
  FumblesLost: number;
}

const Player: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seasonStats, setSeasonStats] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("");

  useEffect(() => {
    const fetchSeasonStats = async () => {
      if (!id) return;

      const segments = id.split(" ");
      const playerID = segments.pop();
      const name = segments.join(" "); 
      setPlayerName(name);

      if (!playerID || isNaN(Number(playerID))) {
        setError("Invalid PlayerID in route.");
        setLoading(false);
        return;
      }

      const endpoint = `https://api.sportsdata.io/v3/nfl/stats/json/PlayerGameStatsBySeason/2024/${playerID}/all?key=abe55e731fca473dbc718d18afa0c089`;

      try {
        const response = await fetch(endpoint);

        if (response.ok) {
          const data = await response.json();

          const stats = data.map((game: any) => ({
            Week: game.Week,
            Opponent: game.Opponent,
            FantasyPoints: game.FantasyPoints,
            PassingYards: game.PassingYards,
            PassingTouchdowns: game.PassingTouchdowns,
            PassingInterceptions: game.PassingInterceptions,
            RushingYards: game.RushingYards,
            RushingTouchdowns: game.RushingTouchdowns,
            Sacks: game.PassingSacks,
            Fumbles: game.Fumbles,
            FumblesLost: game.FumblesLost,
          }));

          setSeasonStats(stats);
        } else {
          setError("Failed to fetch season stats.");
        }
      } catch (err) {
        setError("An error occurred while fetching the player's stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonStats();
  }, [id]);

  if (loading) {
    return <p>Loading player stats...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>

        <h1 className="player-name">{playerName}</h1>

        <h2 className="header">Season Statistics</h2>

        <div className="stats-table">
          <div className="stats-header">
            <div>Week</div>
            <div>Opponent</div>
            <div>Fantasy Points</div>
            <div>Passing Yards</div>
            <div>Passing TDs</div>
            <div>INTs</div>
            <div>Rushing Yards</div>
            <div>Rushing TDs</div>
            <div>Sacks</div>
            <div>Fumbles</div>
            <div>Fumbles Lost</div>
          </div>
          {seasonStats.map((game, index) => (
            <div key={index} className="stats-row">
              <div>{game.Week}</div>
              <div>{game.Opponent}</div>
              <div>{game.FantasyPoints.toFixed(2)}</div>
              <div>{game.PassingYards}</div>
              <div>{game.PassingTouchdowns}</div>
              <div>{game.PassingInterceptions}</div>
              <div>{game.RushingYards}</div>
              <div>{game.RushingTouchdowns}</div>
              <div>{game.Sacks}</div>
              <div>{game.Fumbles}</div>
              <div>{game.FumblesLost}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Player;
