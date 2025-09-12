import React, { useState } from "react";
import "./adhdmenu.css"; // Import CSS
import backgroundVideo from "./menu.mp4"; // Video background

// Import images
import puzzleImg from "./puzzle.png"; // Puzzle card image
import cardImg from "./card1.png"; // Flip Card image

import easyImg from "./easy.jpg";
import mediumImg from "./medium.jpg";
import hardImg from "./hard.jpg";

import { useNavigate } from "react-router-dom";

function ADHDMenu() {
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const openPopup = (cardName) => {
    setSelectedCard(cardName);
    setPopupOpen(true);
  };

  const selectLevel = (level) => {
    setPopupOpen(false);

    if (selectedCard === "puzzle") {
      // Navigate to Puzzle
      let image = level === "easy" ? easyImg : level === "medium" ? mediumImg : hardImg;
      navigate("/puzzle", { state: { level, image } });
    } else if (selectedCard === "flipcard") {
      // Navigate to Flip Card
      navigate("/flipcard", { state: { level } });
    }
  };

  return (
    <div className="adhd-background">
      <video autoPlay loop muted className="video-bg">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="video-overlay" />
      <h1 className="top-left-heading">
        Welcome to Milky Way, Choose Your World
      </h1>

      <div className="adhd-content">
        <div className="cards-container">
          {/* Puzzle Card */}
          <div className="puzzle-card">
            <img src={puzzleImg} alt="Puzzle World" className="card-image" />
            <h2>Puzzle World</h2>
            <p className="card-subtitle">Learn – Play – Focus</p>
            <button className="play-btn" onClick={() => openPopup("puzzle")}>
              Play Now
            </button>
          </div>

          {/* Flip Card */}
          <div className="puzzle-card">
            <img src={cardImg} alt="Flip Card" className="card-image" />
            <h2>Flip Card Game</h2>
            <p className="card-subtitle">Memory & Focus</p>
            <button className="play-btn" onClick={() => openPopup("flipcard")}>
              Play Now
            </button>
          </div>
        </div>
      </div>

      {/* Popup for Level Selection */}
      {popupOpen && (
        <div className="level-popup">
          <div className="popup-content">
            <h3>Select Difficulty Level</h3>
            <div className="level-buttons">
              <button onClick={() => selectLevel("easy")}>Easy</button>
              <button onClick={() => selectLevel("medium")}>Medium</button>
              <button onClick={() => selectLevel("hard")}>Hard</button>
            </div>
            <button className="close-btn" onClick={() => setPopupOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ADHDMenu;
