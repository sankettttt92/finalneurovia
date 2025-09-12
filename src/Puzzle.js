// Puzzle.js
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Puzzle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { level, image } = location.state || {}; // read from router state

  // Redirect if no level/image passed
  useEffect(() => {
    if (!level || !image) {
      navigate("/adhdmenu"); // fallback
    }
  }, [level, image, navigate]);

  // Determine grid size based on level
  const size = level === "easy" ? 2 : level === "medium" ? 3 : 4;
  const total = size * size;

  const [pieces, setPieces] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [hintIndex, setHintIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [blastOff, setBlastOff] = useState(false);
  const idleTimer = useRef(null);

  // ✅ Voice helper
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  // Shuffle pieces on load
  useEffect(() => {
    const arr = Array.from({ length: total }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setPieces(arr);
    setDragIndex(null);
    setHintIndex(null);
    resetIdleTimer();
    speak(`Let's start the ${level} puzzle!`);
  }, [total, level]);

  const resetIdleTimer = () => {
    setHintIndex(null);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      showHint();
    }, 5000);
  };

  const showHint = () => {
    const wrongIndex = pieces.findIndex((val, idx) => val !== idx);
    if (wrongIndex !== -1) {
      setHintIndex(wrongIndex);
      speak("Here's a hint!");
    }
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
    resetIdleTimer();
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex === null) return;
    const newPieces = [...pieces];
    [newPieces[dragIndex], newPieces[dropIndex]] = [newPieces[dropIndex], newPieces[dragIndex]];
    setPieces(newPieces);
    setDragIndex(null);
    resetIdleTimer();
    speak("Good move!");
  };

  const isSolved = pieces.every((val, idx) => val === idx);

  useEffect(() => {
    const correct = pieces.filter((val, idx) => val === idx).length;
    const percent = Math.round((correct / total) * 100);
    setProgress(percent);

    if (percent === 100 && !blastOff) {
      setBlastOff(true);
      fireCelebration();
      speak("Congratulations! You solved the puzzle!");
    }
  }, [pieces, total]);

  const fireCelebration = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  return (
    <div className="puzzle-screen">
      <div className="puzzle-header">
        <h2>{level?.toUpperCase()} Puzzle</h2>
        <div>
          <button
            className="glass-btn small"
            onClick={() => navigate("/adhdmenu")}
          >
            Exit
          </button>
        </div>
      </div>

      <div className="progress-bar-container" style={{ margin: "20px 0", position: "relative" }}>
        <div style={{ width: "100%", height: "20px", background: "#ddd", borderRadius: "10px", overflow: "hidden" }}>
          <motion.div
            style={{ height: "100%", background: "linear-gradient(90deg, #00c6ff, #0072ff)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <motion.div
          style={{ position: "absolute", top: "-35px", fontSize: "30px" }}
          animate={{ x: `${progress * 3}px`, y: blastOff ? -200 : 0, rotate: blastOff ? 45 : 0 }}
          transition={{ duration: 1 }}
        >
          🚀
        </motion.div>
      </div>

      <div className="puzzle-container" style={{ display: "flex", gap: "20px" }}>
        <div className="puzzle-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: "450px", height: "450px" }}>
          {pieces.map((pieceNumber, index) => {
            const col = pieceNumber % size;
            const row = Math.floor(pieceNumber / size);
            const posX = `${(col * 100) / (size - 1)}%`;
            const posY = `${(row * 100) / (size - 1)}%`;

            return (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="puzzle-tile"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: `${size * 100}% ${size * 100}%`,
                  backgroundPosition: `${posX} ${posY}`,
                  position: "relative",
                }}
              >
                {hintIndex === index && !isSolved && <div className="hint-hand" style={{ position: "absolute", bottom: "-30px", right: "-30px", fontSize: "40px", animation: "bounce 1s infinite" }}>👉</div>}
              </div>
            );
          })}
        </div>

        <div className="reference-image" style={{ textAlign: "center" }}>
          <h4>Reference</h4>
          <img src={image} alt="Reference" style={{ width: "200px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }} />
        </div>
      </div>

      <div className="puzzle-footer">
        {isSolved ? <div className="solved-banner">🎉 You solved it! Great job! 🎉</div> : <div className="progress">Pieces: {total}</div>}
      </div>
    </div>
  );
}
