// src/components/PuzzleFooter.js
import React from "react";

export default function PuzzleFooter({ isSolved, total }) {
  return (
    <div className="puzzle-footer">
      {isSolved ? (
        <div className="solved-banner">🎉 You solved it! Great job! 🎉</div>
      ) : (
        <div className="progress">Pieces: {total}</div>
      )}
    </div>
  );
}
