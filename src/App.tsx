import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home, { LeaguesProvider } from "./components/Home";
import League from "./components/League";
import Player from "./components/Player";
import NewLeague from "./components/NewLeague";

const App: React.FC = () => {
  return (
    <LeaguesProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/league/:id" element={<League />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/new-league" element={<NewLeague />} />
          </Routes>
        </div>
      </Router>
    </LeaguesProvider>
  );
};

export default App;
