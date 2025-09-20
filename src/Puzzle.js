// src/components/Puzzle.js
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import PuzzleHeader from "./PuzzleHeader";
import PuzzleGrid from "./PuzzleGrid";
import PuzzleFooter from "./PuzzleFooter";
import EncouragementBox from "./EncouragementBox";

import "./index.css";

export default function Puzzle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { level: rawLevel, image } = location.state || {};
  const level = rawLevel?.toLowerCase(); // ✅ normalize to lowercase

  // ================== STATES ==================
  const size = level === "easy" ? 2 : level === "medium" ? 3 : 4;
  const total = size * size;
  const levelTimeLimit =
    level === "easy" ? 60 : level === "medium" ? 120 : 180;

  const [pieces, setPieces] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [hintIndex, setHintIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [blastOff, setBlastOff] = useState(false);

  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const idleTimer = useRef(null);

  // ================== REMINDER POPUP ==================
  const [showReminder, setShowReminder] = useState(false);

  // ================== VOICE HELPERS ==================
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopVoice = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // ================== NAVIGATION GUARD ==================
  useEffect(() => {
    if (!level || !image) {
      navigate("/adhdmenu");
    }
  }, [level, image, navigate]);

  // ================== SHUFFLE + TIMER ==================
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
    startTimer();

    let timeMessage =
      level === "easy"
        ? "1 minute"
        : level === "medium"
        ? "2 minutes"
        : "3 minutes";

    speak(`Get ready! You have ${timeMessage} to solve the ${level} puzzle.`);
  }, [total, level, levelTimeLimit]);

  // ================== TIMER LOGIC ==================
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!paused) {
        setTime((t) => {
          if (t + 1 >= levelTimeLimit && !blastOff) {
            clearInterval(timerRef.current);
            endGameDueToTimeout();
          }
          return t + 1;
        });
      }
    }, 1000);
  };

  const pauseTimer = () => setPaused(true);
  const resumeTimer = () => setPaused(false);

  // ================== IDLE + HINT ==================
  const resetIdleTimer = () => {
    setHintIndex(null);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      showHint();
      if (!blastOff) {
        speak("Need some help? Try moving a piece!");
      }
    }, 7000);
  };

  const showHint = () => {
    const wrongIndex = pieces.findIndex((val, idx) => val !== idx);
    if (wrongIndex !== -1) {
      setHintIndex(wrongIndex);
    }
  };

  // ================== FOCUS HANDLER ==================
  useEffect(() => {
    const handleBlur = () => {
      pauseTimer();
      if (!blastOff) speak("Puzzle paused, come back soon!");
    };
    const handleFocus = () => {
      resumeTimer();
      if (!blastOff) speak("Welcome back! Let's continue the puzzle.");
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [blastOff]);

  // ================== DRAG + DROP ==================
  const handleDragStart = (index) => {
    setDragIndex(index);
    resetIdleTimer();
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex === null || blastOff) return;
    const newPieces = [...pieces];
    [newPieces[dragIndex], newPieces[dropIndex]] = [
      newPieces[dropIndex],
      newPieces[dragIndex],
    ];
    setPieces(newPieces);
    setDragIndex(null);
    resetIdleTimer();
    if (!blastOff) speak("Good move!");
  };

  const isSolved = pieces.every((val, idx) => val === idx);

  // ================== PROGRESS + CELEBRATION ==================
  useEffect(() => {
    const correct = pieces.filter((val, idx) => val === idx).length;
    const percent = Math.round((correct / total) * 100);
    setProgress(percent);

    if (percent === 100 && !blastOff) {
      setBlastOff(true);
      fireCelebration();
      stopVoice();
      speak(`Congratulations! You solved the puzzle in ${formatTime(time)}!`);

      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => stopVoice(), 5000);
    }
  }, [pieces, total, blastOff, time]);

  const fireCelebration = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  // ================== TIMEOUT HANDLER ==================
  const endGameDueToTimeout = () => {
    stopVoice();
    speak(`Time's up! You could not finish the ${level} puzzle in time.`);
    setBlastOff(true);
    setTimeout(() => {
      stopVoice();
      navigate("/adhdmenu");
    }, 3000);
  };

  // ================== TIME FORMATTER ==================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ================== REMINDER POPUP TIMER ==================
  useEffect(() => {
    const reminderTimer = setTimeout(() => {
      setShowReminder(true);
    }, 30000); // 1 min
    return () => clearTimeout(reminderTimer);
  }, []);

  // ================== JSX ==================
  return (
    <div className="puzzle-screen">
      <PuzzleHeader
        level={level}
        onExit={() => {
          stopVoice();
          navigate("/adhdmenu");
        }}
      />

      {/* Progress Bar with Rocket */}
      <div className="progress-bar-container">
        <div className="progress-bar-bg">
          <motion.div
            className="progress-bar-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <motion.div
          className="progress-rocket"
          animate={{
            x: `${progress * 3}px`,
            y: blastOff ? -200 : 0,
            rotate: blastOff ? 45 : 0,
          }}
          transition={{ duration: 1 }}
        >
          🚀
        </motion.div>
      </div>

      {/* Timer */}
      <div className="timer-box">
        <h4>
          ⏱ Time: {formatTime(time)} / {formatTime(levelTimeLimit)}
        </h4>
      </div>

      <div className="puzzle-body">
        <PuzzleGrid
          size={size}
          pieces={pieces}
          image={image}
          hintIndex={hintIndex}
          isSolved={isSolved}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />

        <div className="reference-box">
          <h4>Reference</h4>
          <img src={image} alt="Reference" className="reference-img" />
          <EncouragementBox progress={progress} />
        </div>
      </div>

      <PuzzleFooter isSolved={isSolved} total={total} />

      {/* ============== GLASS-THEME REMINDER POPUP ============== */}
      {showReminder && (
        <div className="reminder-popup">
          <h3>⚠️ Reminder</h3>
          <p>Screen time is increasing! Take a short break to rest your eyes. 👀</p>
          <button onClick={() => setShowReminder(false)}>Got it</button>
        </div>
      )}
    </div>
  );
}
