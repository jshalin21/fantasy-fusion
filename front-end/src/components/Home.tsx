import "../Home.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import NewLeague from "./NewLeague";

interface League {
  _id: string;
  name: string;
  description: string;
  players: string[];
}

const Home: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = async (refresh: boolean) => {
    setIsModalOpen(false);
    if (refresh) await fetchLeagues(); 
  };

  const fetchLeagues = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      setError("You must be logged in to view leagues.");
      return;
    }

    try {
      const response = await fetch(`https://fantasy-fusion.vercel.app/api/leagues?email=${email}`);
      const data = await response.json();

      if (response.ok) {
        setLeagues(data.data); 
      } else {
        setError(data.message || "Failed to fetch leagues.");
      }
    } catch (err) {
      setError("An error occurred while fetching leagues.");
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

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
          {error && <p className="error-message">{error}</p>}
          {leagues.map((league) => (
            <Link to={`/league/${league._id}`} key={league._id} className="league-card-link">
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
          <NewLeague onClose={closeModal} />
        </div>
      )}
    </>
  );
};

export default Home;
