import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ import navigate
import "./Maze.css";

export default function Maze() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ initialize navigate
  const level = location.state?.level || "Easy";

  const mazeSizes = {
    Easy: { rows: 5, cols: 5, keys: 3, distractions: 2, wallDensity: 0.1 },
    Medium: { rows: 6, cols: 6, keys: 5, distractions: 3, wallDensity: 0.2 },
    Hard: { rows: 8, cols: 8, keys: 7, distractions: 4, wallDensity: 0.25 },
  };

  const {
    rows: ROWS,
    cols: COLS,
    keys: TOTAL_KEYS,
    distractions: TOTAL_DISTRACTIONS,
    wallDensity,
  } = mazeSizes[level];

  const startPos = { r: 1, c: 1 };
  const exitPos = { r: ROWS - 2, c: COLS - 2 };

  const generateMaze = () => {
    const map = Array.from({ length: ROWS }, () => Array(COLS).fill(1));

    const carvePath = (r, c) => {
      map[r][c] = 0;
      const directions = [
        { r: -1, c: 0 },
        { r: 1, c: 0 },
        { r: 0, c: -1 },
        { r: 0, c: 1 },
      ].sort(() => Math.random() - 0.5);

      for (let d of directions) {
        const nr = r + d.r * 2;
        const nc = c + d.c * 2;
        if (
          nr > 0 &&
          nr < ROWS - 1 &&
          nc > 0 &&
          nc < COLS - 1 &&
          map[nr][nc] === 1
        ) {
          map[r + d.r][c + d.c] = 0;
          carvePath(nr, nc);
        }
      }
    };
    carvePath(startPos.r, startPos.c);

    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        if (map[r][c] === 1 && Math.random() > wallDensity) map[r][c] = 0;
      }
    }

    map[exitPos.r][exitPos.c] = "E";

    const validCells = [];
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        if (
          map[r][c] === 0 &&
          !(r === startPos.r && c === startPos.c) &&
          !(r === exitPos.r && c === exitPos.c)
        ) {
          validCells.push({ r, c });
        }
      }
    }

    const keysPlaced = [];
    for (let i = 0; i < TOTAL_KEYS && validCells.length > 0; i++) {
      const idx = Math.floor(Math.random() * validCells.length);
      const cell = validCells.splice(idx, 1)[0];
      map[cell.r][cell.c] = "K";
      keysPlaced.push(cell);
    }

    for (let i = 0; i < TOTAL_DISTRACTIONS && validCells.length > 0; i++) {
      const idx = Math.floor(Math.random() * validCells.length);
      const cell = validCells.splice(idx, 1)[0];
      map[cell.r][cell.c] = "D";
    }

    return { map, keysPlaced };
  };

  const [{ map, keysPlaced }, setMaze] = useState(generateMaze());
  const [player, setPlayer] = useState(startPos);
  const [collectedKeys, setCollectedKeys] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef(null);

  // ⚡ NEW STATE for fatigue reminder
  const [showReminder, setShowReminder] = useState(false);

  // ===============================
  // Game Data Variable
  // ===============================
  const gameData = {
    world: "maze",
    level,
    score,
    timeSpent,
    collectedKeys,
    totalKeys: TOTAL_KEYS,
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const movePlayer = (dr, dc) => {
    const nr = player.r + dr;
    const nc = player.c + dc;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return;

    const cell = map[nr][nc];
    if (cell === 1) {
      setMessage("🚧 Bumped into a wall!");
      return;
    }

    setPlayer({ r: nr, c: nc });
    setMessage("");

    if (cell === "K") {
      setCollectedKeys((prev) => prev + 1);
      setScore((prev) => prev + 10);
      setMaze((prev) => {
        const copy = prev.map.map((row) => [...row]);
        copy[nr][nc] = 0;
        return { ...prev, map: copy };
      });
      setMessage("🔑 Key collected! +10 points");
    } else if (cell === "D") {
      setMessage("💫 Hit a distraction! Back to start.");
      setPlayer(startPos);
      setCollectedKeys(0);
      setScore((prev) => Math.max(prev - 5, 0));
      setMaze(generateMaze());
    } else if (cell === "E") {
      if (collectedKeys === TOTAL_KEYS) {
        setGameWon(true);
        setShowPopup(true);
        stopTimer();
        setMessage("🎉 All keys collected! Level completed! 🚀");
      } else {
        setMessage("🚪 Gate locked! Collect all keys first.");
      }
    }
  };

  const keyToDelta = (key) => {
    switch (key) {
      case "ArrowUp":
      case "w":
        return { r: -1, c: 0 };
      case "ArrowDown":
      case "s":
        return { r: 1, c: 0 };
      case "ArrowLeft":
      case "a":
        return { r: 0, c: -1 };
      case "ArrowRight":
      case "d":
        return { r: 0, c: 1 };
      default:
        return null;
    }
  };

  useEffect(() => {
    startTimer();

    // ⚡ Trigger reminder after 15 sec
    const reminderTimer = setTimeout(() => {
      setShowReminder(true);
    }, 15000);

    return () => {
      stopTimer();
      clearTimeout(reminderTimer);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (gameWon) return;
      const dir = keyToDelta(e.key);
      if (dir) {
        e.preventDefault();
        movePlayer(dir.r, dir.c);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [player, map, collectedKeys, gameWon]);

  const resetLevel = () => {
    setMaze(generateMaze());
    setPlayer(startPos);
    setCollectedKeys(0);
    setGameWon(false);
    setShowPopup(false);
    setScore(0);
    setTimeSpent(0);
    setMessage("Level restarted!");
    startTimer();
  };

  const renderCell = (cell, r, c) => {
    const isPlayer = player.r === r && player.c === c;
    const classes = ["cell"];
    let content = null;

    if (isPlayer) content = <div className="player">🚀</div>;
    else if (cell === 1) {
      classes.push("wall");
      content = <div>🪐</div>;
    } else if (cell === "K") {
      classes.push("key");
      content = <div>🔑</div>;
    } else if (cell === "D") {
      classes.push("distract");
      content = <div>☄️</div>;
    } else if (cell === "E") {
      classes.push("exit");
      content = <div>🚪</div>;
    }

    return (
      <div key={`${r}-${c}`} className={classes.join(" ")}>
        {content}
      </div>
    );
  };

  return (
    <div className="maze-wrapper">
      <div className="maze-left">
        <h2> Space Maze - {level}</h2>
        <div
          className="grid"
          style={{
            gridTemplateRows: `repeat(${ROWS}, 50px)`,
            gridTemplateColumns: `repeat(${COLS}, 50px)`,
          }}
        >
          {map.map((row, r) => row.map((cell, c) => renderCell(cell, r, c)))}
        </div>
      </div>
      <div className="maze-right">
        <h3>🛰️ Player Stats</h3>
        <p>
          Keys Collected: {collectedKeys}/{TOTAL_KEYS}
        </p>
        <p>
          Distractions hit:{" "}
          {TOTAL_DISTRACTIONS - map.flat().filter((c) => c === "D").length}
        </p>
        <p>
          Door Status:{" "}
          {collectedKeys === TOTAL_KEYS ? "Unlocked ✅" : "Locked 🔒"}
        </p>
        <p>Score: {score}</p>
        <p>Time Spent: {timeSpent}s</p>
        <div className="message">{message}</div>
        <button onClick={resetLevel} className="reset-btn">
          Restart Level
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          <h3>🎉 Congratulations! 🎉</h3>
          <p>
            All keys collected! Level completed! 🚀<br />
            Score: {score} | Time: {timeSpent}s
          </p>
          {/* ✅ Navigate to /adhdmenu when continue is clicked */}
          <button onClick={() => navigate("/adhdmenu")}>Continue</button>
        </div>
      )}

      {showReminder && (
        <div className="reminder-popup">
          <h3>⚠️ Screen Alert</h3>
          <p>You’ve been playing for 15 seconds. Take a short break 👀</p>
          <div className="popup-buttons">
            <button onClick={() => window.location.reload()}>Quit</button>
            <button onClick={() => setShowReminder(false)}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}
