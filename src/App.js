import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Game from "./Game"; 
import ADHDMenu from "./Adhdmenu";
import Puzzlepage from "./Puzzle";
import FlipCard from './FlipCard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Launch page */}
        <Route path="/" element={<Home />} />

        {/* Game page */}
        <Route path="/game" element={<Game />} />
         <Route path="/adhdmenu" element={<ADHDMenu />} />
         <Route path="/puzzle" element={<Puzzlepage />} />
          <Route path="/flipcard" element={<FlipCard />} />
         

      </Routes>
    </Router>
  );
}

