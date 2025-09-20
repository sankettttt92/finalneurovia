// src/components/PuzzleGrid.js
import React from "react";

export default function PuzzleGrid({ size, pieces, image, hintIndex, isSolved, onDragStart, onDrop }) {
  return (
    <div className="puzzle-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {pieces.map((pieceNumber, index) => {
        const col = pieceNumber % size;
        const row = Math.floor(pieceNumber / size);
        const posX = `${(col * 100) / (size - 1)}%`;
        const posY = `${(row * 100) / (size - 1)}%`;

        return (
          <div
            key={index}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(index)}
            className="puzzle-tile"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: `${size * 100}% ${size * 100}%`,
              backgroundPosition: `${posX} ${posY}`,
            }}
          >
            {hintIndex === index && !isSolved && (
              <div className="hint-hand">👉</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
