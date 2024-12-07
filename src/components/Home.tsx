import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const leagues: string[] = ["League 1", "League 2", "League 3"];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2 className="header">Your Leagues</h2>
        <div className="grid">
          {leagues.map((league, index) => (
            <div
              className="card"
              key={index}
              onClick={() => navigate(`/league/${index}`)}
            >
              <h3>{league}</h3>
              <p>Fantasy football league description here...</p>
            </div>
          ))}
        </div>
        <button className="button" onClick={() => navigate("/new-league")}>
          Create New League
        </button>
      </div>
    </>
  );
};

export default Home;
