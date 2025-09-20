// src/components/PuzzleHeader.js
import React from "react";

export default function PuzzleHeader({ level, onExit }) {
  return (
    <div className="puzzle-header">
      <h2>🧩 {level?.toUpperCase()} Puzzle</h2>
      <button className="exit-btn" onClick={onExit}>
        Exit ✖
      </button>
    </div>
  );
}
