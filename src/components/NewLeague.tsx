import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const NewLeague: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="form-container">
          <h2 className="header">Create New League</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input type="text" className="input-field" placeholder="League Name" />
            <textarea className="input-field" placeholder="League Description"></textarea>
            <button className="button" type="submit">
              Create League
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewLeague;
