import React, { useRef } from "react";

/*
 Props:
  - src: video source (string)
  - level: label text
  - onEnded: callback once video finishes
*/
export default function TutorialPlayer({ src, level, onEnded }) {
  const videoRef = useRef(null);

  return (
    <div className="tutorial-wrap">
      <div className="tutorial-box">
        <h2 className="tutorial-title">Tutorial — {level.toUpperCase()}</h2>
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          className="tutorial-video"
          onEnded={() => {
            if (typeof onEnded === "function") onEnded();
          }}
        />
        <div className="tutorial-actions">
          <button
            className="glass-btn small"
            onClick={() => {
              // stop and go to puzzle early if user wants
              if (videoRef.current) {
                videoRef.current.pause();
                if (typeof onEnded === "function") onEnded();
              }
            }}
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
