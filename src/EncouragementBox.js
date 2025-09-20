// src/components/EncouragementBox.js
import React from "react";

export default function EncouragementBox({ progress }) {
  return (
    <div className="encouragement-box">
      {progress < 100
        ? `Great job! You are ${progress}% done 🎉`
        : "You did it! 🌟 Excellent work!"}
    </div>
  );
}
