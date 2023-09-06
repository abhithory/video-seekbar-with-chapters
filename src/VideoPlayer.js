import React, { useEffect, useRef, useState } from "react";

const chaptersTimestamps = [
  {
    index: 0,
    timestamp: "00:00",
    chapterName: "Introduction",
    descripiton: "This is random Description",
  },
  {
    index: 1,
    timestamp: "00:30",
    chapterName: "About Backend",
    descripiton: "This is random Description",
  },
  {
    index: 2,
    timestamp: "01:32",
    chapterName: "Frontend",
    descripiton: "This is random Description",
  },
  {
    index: 3,
    timestamp: "02:40",
    chapterName: "Database",
    descripiton: "This is random Description",
  },
  {
    index: 4,
    timestamp: "03:40",
    chapterName: "Deployment",
    descripiton: "This is random Description",
  },
  {
    index: 5,
    timestamp: "04:50",
    chapterName: "Monitoring",
    descripiton: "This is random Description",
  },
  {
    index: 6,
    timestamp: "06:40",
    chapterName: "THE PROJECT",
    descripiton: "This is random Description",
  },
];
const maxChapterIndex = chaptersTimestamps.length - 1;

const VideoPlayer = ({ videoSource }) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = videoRef?.current?.duration;
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

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

    const index = getChapterIndexFromSecounds(newTime);

    setCurrentChapterIndex(index >= 0 ? index : 0);
  };

  const goToTimeStamp = (timestamp) => {
    const timeInSecounds = timeToSeconds(timestamp);
    videoRef.current.currentTime = timeInSecounds;
    const index = getChapterIndexFromSecounds(timeInSecounds);
    setCurrentChapterIndex(index >= 0 ? index : 0);
  };

  const isDraggingRef = useRef(false); // Use a ref for dragging state

  const handleSeekMouseDown = (e) => {
    isDraggingRef.current = true;
    document.addEventListener("mouseup", handleSeekMouseUp);
    document.addEventListener("mousemove", handleSeekMouseMove);
  };
  const handleSeekMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleSeekMouseMove);
    document.removeEventListener("mouseup", handleSeekMouseUp);
  };


  const handleSeekMouseMove = (e) => {
    handleSeekHover(e)
    if (!isDraggingRef.current) return;
    const seekBarElement = document.getElementById("seekbar_container");
    const boundingRect = seekBarElement.getBoundingClientRect();
    const offsetX = e.clientX - boundingRect.left;
    const clickX = offsetX / boundingRect.width;
    const newTime = clickX * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime); // Update the current time in real-time
  };



  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  function timeToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  const getChapeterLengthPercent = (index) => {
    const thisChapterStartingSecounds = timeToSeconds(
      chaptersTimestamps[index].timestamp
    );

    let nextChapterStartingSecounds =
      index >= maxChapterIndex
        ? duration
        : timeToSeconds(chaptersTimestamps[index + 1].timestamp);
    const thisChapterDuration =
      nextChapterStartingSecounds - thisChapterStartingSecounds;

    return (thisChapterDuration / duration) * 100;
  };

  const getProgressChapterWidth = (index) => {
    const thisChapterStartingSecounds = timeToSeconds(
      chaptersTimestamps[index].timestamp
    );
    let nextChapterStartingSecounds =
      index >= maxChapterIndex
        ? duration
        : timeToSeconds(chaptersTimestamps[index + 1].timestamp);
    const thisChapterDuration =
      nextChapterStartingSecounds - thisChapterStartingSecounds;
    const sectionCurrentWidth = currentTime - thisChapterStartingSecounds;
    const width = (sectionCurrentWidth / thisChapterDuration) * 100;

    return width > 0 ? (width < 100 ? width : 100) : 0;
  };

  const getChapterIndexFromSecounds = (seconds) => {
    for (let i = 0; i <= maxChapterIndex; i++) {
      const thisChapterStartingSecounds = timeToSeconds(
        chaptersTimestamps[i].timestamp
      );

      let nextChapterStartingSecounds =
        i >= maxChapterIndex
          ? duration
          : timeToSeconds(chaptersTimestamps[i + 1].timestamp);

      if (
        seconds > thisChapterStartingSecounds &&
        seconds <= nextChapterStartingSecounds
      ) {
        return i;
      }
    }
    return -1;
  };

  const handleSeekHover = (e) => {
    const seekBarElement = document.getElementById("seekbar_container");
    const boundingRect = seekBarElement.getBoundingClientRect();
    const offsetX = e.clientX - boundingRect.left;
    const clickX = offsetX / boundingRect.width;
    const newTime = clickX * duration;
    const formattedTime = formatTime(newTime); // Implement the formatTime function
    const hoverTimeIndicator = document.querySelector(".hover-time-indicator");
    hoverTimeIndicator.textContent = formattedTime;

    // Calculate the position to display the time indicator above the cursor
    const indicatorWidth = hoverTimeIndicator.offsetWidth;
    const leftPosition = offsetX - indicatorWidth / 2;
    hoverTimeIndicator.style.left = `${leftPosition}px`;
  };

  const formatTime = (timeInSeconds) => {
    // Convert timeInSeconds to your desired format (e.g., 0:00)
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };




  const handleSeekHoverEnter = (e) => {
    const hoverTimeIndicator = document.querySelector(".hover-time-indicator");
    hoverTimeIndicator.style.display = "block";
  };

  const handleSeekHoverLeave = () => {
    const hoverTimeIndicator = document.querySelector(".hover-time-indicator");
    hoverTimeIndicator.style.display = "none";
  };



  return (
    <>
      <div className="video-player">
        <video ref={videoRef} controls onTimeUpdate={handleTimeUpdate}>
          <source src={videoSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-controls">
          <div
            className="seekbar-container"
            id="seekbar_container"
            onClick={handleSeek}
            onMouseDown={handleSeekMouseDown}
            onMouseMove={handleSeekMouseMove}
            onMouseUp={handleSeekMouseUp}
            onMouseEnter={handleSeekHoverEnter}
            onMouseLeave={handleSeekHoverLeave}

          >
            <div className="hover-time-indicator">0:00</div>

            {chaptersTimestamps?.map((item) => {
              const chapterPercent = getChapeterLengthPercent(item.index);
              console.log("chapterPercent", chapterPercent);
              return (
                <div
                  className="seekbar-section"
                  style={{ width: `${chapterPercent}%` }}
                  key={item.index}
                >
                  <div
                    className="seekbar-progress"
                    style={{ width: `${getProgressChapterWidth(item.index)}%` }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div className="other-controls">
            <button onClick={togglePlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <p>
              Chapter: {chaptersTimestamps[currentChapterIndex].chapterName}
            </p>
          </div>
        </div>
      </div>
      <div className="chapterSection">
        <div className="all-chapaterDetails">
          {chaptersTimestamps.map((item) => {
            return (
              <div className="one-chapter">
                <p>
                  {item.index + 1}: {item.chapterName}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    goToTimeStamp(item.timestamp);
                  }}
                >
                  {item.timestamp}
                </button>
              </div>
            );
          })}
        </div>
        <div className="current-chapaterDetails">
          <h1>Current ChapterDetails: </h1>
          <h3>Title: {chaptersTimestamps[currentChapterIndex].chapterName}</h3>
          <p>
            Descripiton: {chaptersTimestamps[currentChapterIndex].descripiton}
          </p>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
