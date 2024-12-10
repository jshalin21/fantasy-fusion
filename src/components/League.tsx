import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "../league.css";

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

interface League {
  _id: string;
  name: string;
  description: string;
  players: string[];
}

const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const League: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the league ID from the URL params
  const navigate = useNavigate();

  const [league, setLeague] = useState<League | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedPlayers, setSearchedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/leagues/${id}`);
        const data = await response.json();

        if (response.ok) {
          setLeague(data.data);
        } else {
          setError(data.message || "Failed to fetch league.");
        }
      } catch (err) {
        setError("An error occurred while fetching the league.");
      }
    };

    fetchLeague();
  }, [id]);

  const handleDeleteLeague = async () => {
    if (!league) return;

    const confirmed = window.confirm(`Are you sure you want to delete the league "${league.name}"?`);
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:4000/api/leagues/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          navigate("/home"); // Navigate back to home after deletion
        } else {
          const data = await response.json();
          setError(data.message || "Failed to delete league.");
        }
      } catch (err) {
        setError("An error occurred while deleting the league.");
      }
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
    if (!league) return;
  
    const playerDetails = `${player.FirstName} ${player.LastName} - ${player.Position} (${player.Team}) - Fantasy Points: ${player.FantasyPoints || 0} ${player.PlayerID}`;
  
    if (!league.players.includes(playerDetails)) {
      const updatedPlayers = [...league.players, playerDetails];
      setLeague({ ...league, players: updatedPlayers });
  
      // Clear the search query
      setSearchQuery("");
      setSearchedPlayers([]);
  
      // Update the league in the database
      fetch(`http://localhost:4000/api/leagues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ players: updatedPlayers }),
      });
    } else {
      alert(`${player.FirstName} ${player.LastName} is already in the league!`);
    }
  };
  

  const handleRemovePlayer = (player: string) => {
    if (!league) return;

    const updatedPlayers = league.players.filter((p) => p !== player);
    setLeague({ ...league, players: updatedPlayers });

    // Update the league in the database
    fetch(`http://localhost:4000/api/leagues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ players: updatedPlayers }),
    });
  };

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  if (!league) {
    return <div className="loading-text">Loading...</div>;
  }

  const filteredPlayers = league.players.filter((player) =>
    player.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <button onClick={() => navigate("/home")} className="back-button">
          Back
        </button>
        <h2 className="header">{league.name}</h2>
        <p className="league-description">{league.description}</p>

        <input
          type="text"
          placeholder="Search for a player to add"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {loading && <p className="loading-text">Loading players...</p>}
        {searchedPlayers.length > 0 && (
          <ul className="player-list">
            {searchedPlayers.map((player) => (
              <Link
              to={`/player/${player.PlayerID}`} // Pass PlayerID in the URL instead of the player's name
              key={player.PlayerID}
              className="player-item"
            >
              {player.FirstName} {player.LastName} - {player.Position} ({player.Team}) - Fantasy Points: {player.FantasyPoints}
              <button
                className="add-player-button"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  handleAddPlayer(player);
                }}
              >
                Add to League
              </button>
            </Link>
            ))}
          </ul>
        )}

<h3 className="section-header">League Players</h3>
<ul className="player-list">
  {filteredPlayers.map((player, index) => {
    const playerDisplay = player.split(" ").slice(0, -1).join(" "); // Removes the last segment (PlayerID)
    const routeParam = encodeURIComponent(player);

    return (
      <li key={index} className="player-item">
        <Link
          to={`/player/${routeParam}`} // Use the full string for the route
          className="player-item" // Apply custom CSS class
        >
          <div className="player-details">{playerDisplay}</div> {/* Styled div */}
        </Link>
        <button
          className="remove-player-button"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            handleRemovePlayer(player);
          }}
        >
          Remove
        </button>
      </li>
    );
  })}
</ul>



        <button onClick={handleDeleteLeague} className="delete-league-button">
          Delete League
        </button>
      </div>
    </>
  );
};

export default League;
