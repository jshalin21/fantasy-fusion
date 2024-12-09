import "../Home.css";
import React, { useState, createContext, useContext, ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

// Define the League type
interface League {
  name: string;
  description: string;
  players: string[];
}

// Define the shape of the context
interface LeagueContextType {
  leagues: League[];
  addLeague: (league: League) => void;
  setLeaguesArray: (updatedLeagues: League[]) => void;
  addPlayerToLeague: (leagueName: string, player: string) => void;
}

// Create the context
const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

// Hook to use the LeagueContext
const useLeagues = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error("useLeagues must be used within a LeaguesProvider");
  }
  return context;
};

// Provider component
const LeaguesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leagues, setLeagues] = useState<League[]>([]);

  const addLeague = (league: League) => {
    setLeagues((prevLeagues) => [...prevLeagues, league]);
  };

  const setLeaguesArray = (updatedLeagues: League[]) => {
    setLeagues(updatedLeagues);
  };

  const addPlayerToLeague = (leagueName: string, player: string) => {
    setLeagues((prevLeagues) =>
      prevLeagues.map((league) =>
        league.name === leagueName
          ? { ...league, players: [...league.players, player] }
          : league
      )
    );
  };

  return (
    <LeagueContext.Provider value={{ leagues, addLeague, setLeaguesArray, addPlayerToLeague }}>
      {children}
    </LeagueContext.Provider>
  );
};

// Main Home Component
const Home: React.FC = () => {
  const { leagues, addLeague } = useLeagues();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leagueName, setLeagueName] = useState("");
  const [leagueDescription, setLeagueDescription] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateLeague = (e: React.FormEvent) => {
    e.preventDefault();

    if (leagueName.trim() && leagueDescription.trim()) {
      addLeague({ name: leagueName, description: leagueDescription, players: [] });
      setLeagueName("");
      setLeagueDescription("");
      closeModal();
    } else {
      alert("Please fill out both fields.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="hero-section">
          <video
            className="background-video"
            autoPlay
            loop
            muted
            src="/ff_clips.mp4"
          ></video>
          <div className="hero-overlay">
            <h1 className="home-header">Fantasy Fusion</h1>
            <p className="hero-description">
              Bringing all your fantasy leagues together in one place.
            </p>
          </div>
        </div>
        <div className="leagues-grid">
          {leagues.map((league, index) => (
            <Link to={`/league/${index}`} key={index} className="league-card-link">
              <div className="league-card">
                <h3 className="league-name">{league.name}</h3>
                <p className="league-description">{league.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="add-league-wrapper">
          <button className="add-league-card" onClick={openModal}>
            <span className="add-league-text">Create New League</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New League</h2>
            <form onSubmit={handleCreateLeague}>
              <div>
                <label htmlFor="league-name">League Name</label>
                <input
                  type="text"
                  id="league-name"
                  name="leagueName"
                  placeholder="Enter league name"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="league-description">Description</label>
                <textarea
                  id="league-description"
                  name="leagueDescription"
                  placeholder="Enter league description"
                  value={leagueDescription}
                  onChange={(e) => setLeagueDescription(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">
                  Create
                </button>
                <button
                  type="button"
                  className="close-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export { LeaguesProvider, useLeagues };
export default Home;
