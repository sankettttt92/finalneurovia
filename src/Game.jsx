// Game.jsx
import React, { useState } from "react";
import GameCard from "./GameCard";
import TutorialPlayer from "./TutorialPlayer";
import Puzzle from "./Puzzle";

// Assets (place these files in src/)
import easyImg from "./easy.jpg";
import mediumImg from "./medium.jpg";
import hardImg from "./hard.jpg";

import easyVid from "./easy.mp4";
import mediumVid from "./medium.mp4";
import hardVid from "./hard.mp4";

/*
 Game component:
 - Selects level -> shows tutorial -> then shows puzzle.
*/
export default function Game() {
  const [level, setLevel] = useState(null);        // 'easy' | 'medium' | 'hard' | null
  const [playingTutorial, setPlayingTutorial] = useState(false);

  const LEVELS = {
    easy:   { img: easyImg, video: easyVid, grid: 2 },
    medium: { img: mediumImg, video: mediumVid, grid: 3 },
    hard:   { img: hardImg, video: hardVid, grid: 4 },
  };

  const openLevel = (lvl) => {
    setLevel(lvl);
    setPlayingTutorial(true);
  };

  const onTutorialEnded = () => setPlayingTutorial(false);
  const onExitPuzzle = () => {
    setLevel(null);
    setPlayingTutorial(false);
  };

  return (
    <div className="app-root">
      <div className="space-bg" /> {/* decorative starry background */}

      {!level && (
        <main className="menu">
          <h1 className="title">✨ Space Puzzle Adventure ✨</h1>

          <div className="cards-row">
            <GameCard level="easy"   onPlay={() => openLevel("easy")} />
            <GameCard level="medium" onPlay={() => openLevel("medium")} />
            <GameCard level="hard"   onPlay={() => openLevel("hard")} />
          </div>

          <p className="hint">Click Play Now → watch a quick tutorial → solve the puzzle!</p>
        </main>
      )}

      {level && playingTutorial && (
        <TutorialPlayer
          src={LEVELS[level].video}
          level={level}
          onEnded={onTutorialEnded}
        />
      )}

      {level && !playingTutorial && (
        <Puzzle
          level={level}
          size={LEVELS[level].grid}
          image={LEVELS[level].img}
          onExit={onExitPuzzle}
        />
      )}
    </div>
  );
}
