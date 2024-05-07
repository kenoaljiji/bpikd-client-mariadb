import React, { useRef } from "react";

const ProgressBar = ({ duration, currentTime, onProgressClick }) => {
  const progressBarRef = useRef(null);

  const handleProgressBarClick = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressBarWidth = progressBar.offsetWidth;
    const progress = (clickX / progressBarWidth) * 100;
    onProgressClick(progress);
  };

  return (
    <div
      className="progress-bar-wrapper"
      onClick={handleProgressBarClick}
      ref={progressBarRef}
    >
      <div
        className="progress-bar"
        style={{ width: `${(currentTime / duration) * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
