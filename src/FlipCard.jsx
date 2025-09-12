import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import "./flipcard.css";



const levelConfigs = {
  easy: ["🚀", "🪐", "🌌", "🛰️"],      // 4 pairs
  medium: ["🚀", "🪐", "🌌", "🛰️", "🌙", "☄️"], // 6 pairs
  hard: ["🚀", "🪐", "🌌", "🛰️", "🌙", "☄️", "👩‍🚀", "🌍"], // 8 pairs
};

export default function CardFlip() {
  const location = useLocation();
  const selectedLevel = location.state?.level || "easy"; // default easy
  const [level, setLevel] = useState(selectedLevel);
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const generateShuffledCards = (emojiSet) =>
    [...emojiSet, ...emojiSet]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }));

  useEffect(() => {
    setCards(generateShuffledCards(levelConfigs[level]));
  }, [level]);

  const totalPairs = levelConfigs[level].length;
  const matchedPairs = cards.filter((c) => c.matched).length / 2;
  const progress = (matchedPairs / totalPairs) * 100;

  useEffect(() => {
    if (gameStarted && time > 0 && !gameOver) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0) setGameOver(true);
  }, [time, gameOver, gameStarted]);

  const handleCardClick = (card) => {
    if (card.flipped || secondCard || gameOver || !gameStarted) return;

    const flippedCard = { ...card, flipped: true };
    setCards(cards.map((c) => (c.id === card.id ? flippedCard : c)));

    if (!firstCard) setFirstCard(flippedCard);
    else setSecondCard(flippedCard);
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.emoji === secondCard.emoji) {
        setCards((prev) =>
          prev.map((c) =>
            c.emoji === firstCard.emoji ? { ...c, matched: true } : c
          )
        );
        setScore((prev) => prev + 10);
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1000);
      } else {
        setScore((prev) => Math.max(prev - 2, 0));
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, flipped: false }
                : c
            )
          );
        }, 1000);
      }
      setFirstCard(null);
      setSecondCard(null);
    }
  }, [firstCard, secondCard]);

  const restartGame = () => {
    setCards(generateShuffledCards(levelConfigs[level]));
    setScore(0);
    setTime(60);
    setGameOver(false);
    setCelebrate(false);
    setFirstCard(null);
    setSecondCard(null);
    setGameStarted(false);
  };

  const startGame = () => setGameStarted(true);

  // Dynamically set grid class based on level
  const gridClass =
    level === "easy" ? "grid-2" : level === "medium" ? "grid-3" : "grid-4";

  return (
    <div className="game-container">
      {celebrate && <Confetti />}

      <h1 className="title">Space Flip Game</h1>

      {!gameStarted && (
        <div className="level-selector">
          <label>🎮 Selected Level: </label>
          <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
          <button onClick={startGame} className="play-now-btn">
            🚀 Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <div className={`grid ${gridClass}`}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                <div className="card-front">✨</div>
                <div className="card-back">{card.emoji}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {gameOver && (
        <div className="game-over-modal">
          {progress === 100 ? (
            <>
              <h2>🌟 Congratulations! You Won! 🌟</h2>
              <p>Your Score: {score}</p>
              <button className="restart-btn" onClick={restartGame}>
                🔄 Play Again
              </button>
            </>
          ) : (
            <>
              <h2>⏳ Time’s Up!</h2>
              <p>Your Score: {score}</p>
              <button className="restart-btn" onClick={restartGame}>
                🔄 Try Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
