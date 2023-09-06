import React, { useRef, useState } from "react";

const VideoPlayer = ({ videoSource }) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = videoRef?.current?.duration;

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const seekBar = e.currentTarget;
    const boundingRect = seekBar.getBoundingClientRect();
    const offsetX = e.clientX - boundingRect.left;
    const clickX = offsetX / boundingRect.width;
    const newTime = clickX * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  const getSectionWidth = (sectionNo) => {
    const sectionFullduration = duration / 4;
    const sectionCurrentWidth = currentTime - sectionNo * sectionFullduration;
    const width = (sectionCurrentWidth / sectionFullduration) * 100;

    const maxWidth = (sectionFullduration / sectionFullduration) * 100;

    return width > 0 ? (width >= maxWidth ? maxWidth - 1 : width) : 0;
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const handleSeekMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleSeekMouseMove = (e) => {
    if (!isDragging) return;
    const seekBar = e.currentTarget;
    const boundingRect = seekBar.getBoundingClientRect();
    const offsetX = e.clientX - boundingRect.left;
    const clickX = offsetX / boundingRect.width;
    const newTime = clickX * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime); // Update the current time in real-time
  };

  const handleSeekMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="video-player">
      <video ref={videoRef} controls onTimeUpdate={handleTimeUpdate}>
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        className="seekbar-container"
        onClick={handleSeek}
        onMouseDown={handleSeekMouseDown}
        onMouseMove={handleSeekMouseMove}
        onMouseUp={handleSeekMouseUp}
      >
        <div className="seekbar-content">
          <div className="seekbar-section" style={{ width: "25%" }}>
            <div
              className="seekbar-progress"
              style={{ width: `${getSectionWidth(0)}%` }}
            ></div>
          </div>
          <div className="seekbar-section" style={{ width: "25%" }}>
            <div
              className="seekbar-progress"
              style={{ width: `${getSectionWidth(1)}%` }}
            ></div>
          </div>
          <div className="seekbar-section" style={{ width: "25%" }}>
            <div
              className="seekbar-progress"
              style={{ width: `${getSectionWidth(2)}%` }}
            ></div>
          </div>
          <div className="seekbar-section" style={{ width: "25%" }}>
            <div
              className="seekbar-progress"
              style={{ width: `${getSectionWidth(3)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
