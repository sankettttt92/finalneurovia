import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Game from "./Game"; 
import ADHDMenu from "./Adhdmenu";
import Puzzlepage from "./Puzzle";
import FlipCard from './FlipCard';
import Maze from './Maze'; // Updated import

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/adhdmenu" element={<ADHDMenu />} />
        <Route path="/puzzle" element={<Puzzlepage />} />
        <Route path="/flipcard" element={<FlipCard />} />
        <Route path="/Maze" element={<Maze />} /> {/* Capital M matches path */}
      </Routes>
    </Router>
  );
}
