import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css"; // Import CSS file

const text =
  "Blast off into space, one puzzle at a time. The galaxy is waiting for your next move.";

function Home() {
     const navigate = useNavigate();
  return (
    <div className="background">
      <h1 className="intro-title">Welcome to Cosmic Quest</h1>
      <p className="intro-subtitle">
        {text.split(" ").map((word, i) => (
          <span key={i} style={{ "--i": i }}>
            {word}
          </span>
        ))}
      </p>

      {/* 🚀 New Button */}
     <button className="start-btn" onClick={() => navigate("/adhdmenu")}>
        Start Space Adventure
      </button>
    </div>
  );
}

export default Home;
