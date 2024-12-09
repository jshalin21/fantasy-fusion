import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLeagues } from "./Home";
import axios from "axios";

interface Player {
  PlayerID: number;
  Team: string;
  Number: number;
  FirstName: string;
  LastName: string;
  Position: string;
  Status: string;
  Height: string;
  Weight: number;
  BirthDate: string;
  College: string;
  FantasyPoints?: number;
}

const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const League: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { leagues, setLeaguesArray } = useLeagues();
  const navigate = useNavigate();

  const leagueIndex = parseInt(id || "0");
  const league = leagues[leagueIndex];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedPlayers, setSearchedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteLeague = () => {
    const confirmed = window.confirm(`Are you sure you want to delete the league "${league?.name}"?`);
    if (confirmed) {
      const updatedLeagues = leagues.filter((_, index) => index !== leagueIndex);
      setLeaguesArray(updatedLeagues);
      navigate("/home");
    }
  };

  const fetchFantasyPoints = async () => {
    try {
      const response = await axios.get<{ PlayerID: number; FantasyPoints: number }[]>(
        `https://api.sportsdata.io/v3/nfl/stats/json/DailyFantasyPoints/2024-12-09?key=abe55e731fca473dbc718d18afa0c089`
      );

      const fantasyPointsMap: { [key: number]: number } = {};
      response.data.forEach((player) => {
        fantasyPointsMap[player.PlayerID] = player.FantasyPoints;
      });

      return fantasyPointsMap;
    } catch (err) {
      console.error("Failed to fetch fantasy points:", err);
      return {};
    }
  };

  const fetchPlayers = async (query: string) => {
    if (!query.trim()) {
      setSearchedPlayers([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fantasyPointsMap = await fetchFantasyPoints();

      const response = await axios.get<Player[]>(
        `https://api.sportsdata.io/v3/nfl/scores/json/PlayersByAvailable?key=abe55e731fca473dbc718d18afa0c089&format=json`
      );
      const filteredPlayers = response.data
        .filter((player) =>
          `${player.FirstName} ${player.LastName}`.toLowerCase().includes(query.toLowerCase())
        )
        .map((player) => ({
          ...player,
          FantasyPoints: fantasyPointsMap[player.PlayerID] || 0,
        }));

      setSearchedPlayers(filteredPlayers);
    } catch (err) {
      setError("Failed to fetch players. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPlayers = debounce(fetchPlayers, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchPlayers(query);
  };

  const handleAddPlayer = (player: Player) => {
    const playerDetails = `${player.FirstName} ${player.LastName} - ${player.Position} (${player.Team}) - Fantasy Points: ${player.FantasyPoints || 0}`;

    if (!league.players.includes(playerDetails)) {
      const updatedLeagues = [...leagues];
      updatedLeagues[leagueIndex].players.push(playerDetails);
      setLeaguesArray(updatedLeagues);
      setSearchQuery("");
      setSearchedPlayers([]);
    } else {
      alert(`${player.FirstName} ${player.LastName} is already in the league!`);
    }
  };

  if (!league) {
    return <div>League not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ position: "relative", padding: "20px" }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
        <h2 className="header" style={{ textAlign: "center", margin: "20px 0" }}>{league.name}</h2>
        <p style={{ textAlign: "center", color: "#bbb" }}>{league.description}</p>

        <input
          type="text"
          placeholder="Search for a player to add"
          className="full-width"
          style={{
            width: "100%",
            padding: "10px",
            margin: "20px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {loading && <p style={{ textAlign: "center" }}>Loading players...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {searchedPlayers.length > 0 && (
          <ul className="player-list" style={{ listStyleType: "none", padding: 0 }}>
            {searchedPlayers.map((player) => (
              <li
                key={player.PlayerID}
                className="player-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#333",
                  color: "white",
                  margin: "10px 0",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <span>
                  {player.FirstName} {player.LastName} - {player.Position} ({player.Team}) - Fantasy Points: {player.FantasyPoints}
                </span>
                <button
                  onClick={() => handleAddPlayer(player)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#0066cc",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#004d99")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0066cc")}
                >
                  Add to League
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3
          style={{
            marginTop: "30px",
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#f0f0f0",
            borderBottom: "2px solid #0066cc",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          League Players
        </h3>
        <ul
          className="player-list"
          style={{
            listStyleType: "none",
            padding: "0",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            width: "100%",
          }}
        >
          {league.players.map((player, index) => (
            <li
              key={index}
              className="player-item"
              style={{
                backgroundColor: "#444",
                color: "white",
                width: "80%",
                padding: "15px",
                borderRadius: "5px",
                textAlign: "center",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {/* Link to Player Page */}
              <Link
                to={`/player/${encodeURIComponent(player)}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                {player}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={handleDeleteLeague}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
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
      </div>
    </>
  );
};

export default League;
