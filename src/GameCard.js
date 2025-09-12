import React from "react";
import { motion } from "framer-motion";
import  "./App.css";

/*
 Props:
  - level: 'easy' | 'medium' | 'hard'
  - onPlay: callback when Play Now is clicked
*/
export default function GameCard({ level, onPlay }) {
  const COLORS = {
    easy:   { from: "#7EE8FA", to: "#80FF72" },
    medium: { from: "#FFD86B", to: "#FF6B6B" },
    hard:   { from: "#F78CA0", to: "#8A2BE2" },
  };

  const c = COLORS[level] || COLORS.easy;

  return (
    <motion.div
      className="game-card"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: `linear-gradient(135deg, ${c.from}22 0%, ${c.to}22 100%)`,
        boxShadow: `0 6px 30px ${c.from}33, inset 0 -6px 20px ${c.to}11`,
      }}
    >
      <div className="card-inner">
        <div className="card-header">
          <div className="level-circle" aria-hidden />
          <h3 className="card-title">{level}</h3>
        </div>

        <p className="card-desc">
          {level === "easy" && "2×2 puzzle — great for beginners"}
          {level === "medium" && "3×3 puzzle — a bit challenging"}
          {level === "hard" && "4×4 puzzle — for pros!"}
        </p>

        <motion.button
          className="glass-btn"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onPlay}
        >
          Play Now
        </motion.button>
      </div>
    </motion.div>
  );
}
