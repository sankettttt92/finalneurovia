import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./flipcard.css";

const levelConfigs = {
  Easy: ["🚀", "🪐", "🌌", "🛰️"],
  Medium: ["🚀", "🪐", "🌌", "🛰️", "🌙", "☄️"],
  Hard: ["🚀", "🪐", "🌌", "🛰️", "🌙", "☄️", "👩‍🚀", "🌍"],
};

export default function CardFlip() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLevel = location.state?.level || "Easy";

  const normalizedLevel =
    selectedLevel.charAt(0).toUpperCase() +
    selectedLevel.slice(1).toLowerCase();

  const [level] = useState(
    levelConfigs[normalizedLevel] ? normalizedLevel : "Easy"
  );
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [storyText, setStoryText] = useState("");

  // ✅ NEW: Reminder popup
  const [showReminder, setShowReminder] = useState(false);

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

  const totalPairs = levelConfigs[level]?.length || 0;
  const matchedPairs = cards.filter((c) => c.matched).length / 2;
  const progress = (matchedPairs / totalPairs) * 100;

  // Timer
  useEffect(() => {
    if (gameStarted && time > 0 && !gameOver) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0) setGameOver(true);
  }, [time, gameOver, gameStarted]);

  const handleCardClick = (card) => {
    if (card.flipped || secondCard || gameOver) return;

    const flippedCard = { ...card, flipped: true };
    setCards(cards.map((c) => (c.id === card.id ? flippedCard : c)));

    if (!firstCard) setFirstCard(flippedCard);
    else setSecondCard(flippedCard);
  };

  // Matching logic
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

  // Game end check
  useEffect(() => {
    if ((matchedPairs === totalPairs || time === 0) && gameStarted) {
      setGameOver(true);
      setCelebrate(matchedPairs === totalPairs);
    }
  }, [matchedPairs, time, gameStarted]);

  // Restart game
  const restartGame = () => {
    setCards(generateShuffledCards(levelConfigs[level]));
    setScore(0);
    setTime(60);
    setGameOver(false);
    setCelebrate(false);
    setFirstCard(null);
    setSecondCard(null);
    setGameStarted(true);
    setShowReminder(false);
  };

  // Start game after story
  const startGame = () => {
    setShowStory(false);
    setGameStarted(true);

    // ✅ Trigger reminder after 30 sec
    setTimeout(() => {
      setShowReminder(true);
    }, 30000);
  };

  // Typewriter Effect for Story
  useEffect(() => {
    if (showStory) {
      const fullText = ` In the galaxy far away, magical cards were scattered across the stars. 🪐 Your mission is to flip the cards, find the matching pairs, and restore cosmic harmony! 🌍✨ But hurry, explorer—⏳ time is limited and only the bravest will succeed!`;
      let index = 0;
      setStoryText("");
      const interval = setInterval(() => {
        setStoryText((prev) => prev + fullText.charAt(index));
        index++;
        if (index === fullText.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showStory]);

  const gridClass =
    level === "Easy" ? "grid-2" : level === "Medium" ? "grid-3" : "grid-4";

  return (
    <div className="wrapper-card">
      <div className="game-container adhd-theme">
        {/* ✅ Gradient Home Button */}
        <button className="home-btn" onClick={() => navigate("/")}>
          ⬅ Home
        </button>

        {celebrate && <Confetti />}

        {/* Story Modal */}
        {showStory && (
          <div className="story-modal animate-dialog">
            <h2> Welcome, Space Explorer!!</h2>
            <p className="animated-text">{storyText}</p>
            <button className="start-btn" onClick={startGame}>
              🚀 Begin Your Adventure
            </button>
          </div>
        )}

        {/* Title */}
        {!showStory && <h1 className="title"> Space Flip Game </h1>}

        {/* Game UI */}
        {gameStarted && !showStory && (
          <>
            {/* Stats Card with Progress */}
            <div className="stats-card">
              <div className="stats-header">
                <div className="stat-item">
                  ⏱️ <span className="stat-value">{time}s</span>
                </div>
                <div className="stat-item">
                  ⭐ <span className="stat-value">{score}</span>
                </div>
              </div>

              <div className="progress-container inside-card">
                <div
                  className="progress-bar"
                  style={{
                    width: `${progress}%`,
                    transition: "width 0.5s ease",
                  }}
                ></div>
              </div>
            </div>

            <div className={`grid ${gridClass}`}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`card ${
                    card.flipped || card.matched ? "flipped" : ""
                  }`}
                  onClick={() => handleCardClick(card)}
                >
                  <div className="card-inner">
                    <div className="card-front">✨</div>
                    <div className="card-back">
                      <span className="emoji">{card.emoji}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Game Over Modal */}
        {gameOver && !showStory && (
          <div className="game-over-modal animate-dialog">
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

        {/* ✅ Reminder Popup */}
        {showReminder && !gameOver && (
          <div className="reminder-popup animate-dialog">
            <h3>⚠️ Reminder</h3>
            <p>
              You’ve been playing for a while! Take a short break to rest your
              eyes 👀 and stretch a bit 🧘‍♂️.
            </p>
            <button onClick={() => setShowReminder(false)}>Got it 👍</button>
          </div>
        )}
      </div>
    </div>
  );
}
