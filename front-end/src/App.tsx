import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import League from "./components/League";
import Player from "./components/Player";
import NewLeague from "./components/NewLeague";
import Profile from "./components/Profile";

const App: React.FC = () => {
  return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/league/:id" element={<League />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;