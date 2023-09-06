import React from 'react'
import CustomVideoPlayer from './VideoPlayer'

import "./App.css";
import "./VideoPlayer.css";

const startTime = 20; // Start time in seconds
const endTime = 200; // End time in seconds


function App() {
    return (
        <div>
            <CustomVideoPlayer videoSource={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                startTime={startTime}
                endTime={endTime}
            />
        </div>
    )
}

export default App