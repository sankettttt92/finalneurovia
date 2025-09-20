import React, { useState } from "react";
import "./adhdmenu.css";
import backgroundVideo from "./menu.mp4";
import puzzleImg from "./flipworld.png";
import cardImg from "./puzzlec.png";
import easyImg from "./easy.jpg";
import mediumImg from "./medium.jpg";
import hardImg from "./hard.jpg";
import maze from "./maze.png";
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
      let image =
        level === "Easy"
          ? easyImg
          : level === "Medium"
          ? mediumImg
          : hardImg;
      navigate("/puzzle", { state: { level, image } });
    } else if (selectedCard === "flipcard") {
      navigate("/flipcard", { state: { level } });
    } else if (selectedCard === "Maze") {
      navigate("/Maze", { state: { level } });
    }
  };

  return (
    <div className="adhd-background">
      <video autoPlay loop muted className="video-bg">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="video-overlay" />

      {/* ✅ Go Home Button */}
      <button className="go-home-btn" onClick={() => navigate("/")}>
        ⬅ Home
      </button>

      <h1 className="top-left-heading">
        Welcome to Milky Way, Choose Your World
      </h1>

      <div className="adhd-content">
        <div className="cards-container">
          {/* Puzzle Card */}
          <div className="puzzle-card">
            <img src={cardImg} alt="Puzzle World" className="card-image" />
            <h2>Puzzle World</h2>
            <ul className="card-points">
              <li>🧩 Builds problem-solving skills</li>
              <li>🧠 Enhances concentration & focus</li>
            </ul>
            <button className="play-btn" onClick={() => openPopup("puzzle")}>
              Play Now
            </button>
          </div>

          {/* Flip Card */}
          <div className="puzzle-card">
            <img src={puzzleImg} alt="Flip Card" className="card-image" />
            <h2>Flip Card Game</h2>
            <ul className="card-points">
              <li>🃏 Improves memory retention</li>
              <li>⚡ Trains quick decision-making</li>
            </ul>
            <button className="play-btn" onClick={() => openPopup("flipcard")}>
              Play Now
            </button>
          </div>

          {/* Maze Game */}
          <div className="puzzle-card">
            <img src={maze} alt="Maze Game" className="card-image" />
            <h2>SPACE MAZE</h2>
            <ul className="card-points">
              <li>🚀 Enhances focus & planning skills</li>
              <li>⚡ Avoid distractions & collect stars</li>
            </ul>
            <button className="play-btn" onClick={() => openPopup("Maze")}>
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
              <button onClick={() => selectLevel("Easy")}>Easy</button>
              <button onClick={() => selectLevel("Medium")}>Medium</button>
              <button onClick={() => selectLevel("Hard")}>Hard</button>
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
