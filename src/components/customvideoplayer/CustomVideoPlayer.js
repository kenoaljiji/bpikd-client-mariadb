import React, { useRef, useState, useEffect } from 'react';
import './customvideoplayer.scss';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import Draggable from 'react-draggable';
import VideoOptions from '../videooptions/VideoOptions';

const CustomVideoPlayer = ({
  videos,
  closeModal,
  isVideoGalleryOpen,
  isPlaying,
  setIsPlaying,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [showSpeedMenu, setShowSpeedMenu] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const videoRef = useRef(null);

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    setModalPosition({ x, y });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setCurrentTime(videoRef.current.currentTime);
  };

  useEffect(() => {}, []);

  return isMinimized ? (
    <div
      className='overlay-background video-minimized'
      onClick={() => setShowSpeedMenu(false)}
    >
      <Draggable
        handle='.draggable-handle' // Ensure that the handle targets the draggable element's class
        defaultPosition={modalPosition}
        onDrag={handleDrag}
      >
        <div className='draggable-handle'>
          <VideoPlayer
            videos={videos}
            showSpeedMenu={showSpeedMenu}
            setShowSpeedMenu={setShowSpeedMenu}
            toggleMinimize={toggleMinimize}
            isMinimized={isMinimized}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            videoRef={videoRef}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
            duration={duration}
            setDuration={setDuration}
            volume={volume}
            setVolume={setVolume}
            closeModal={closeModal}
            selectedSpeed={selectedSpeed}
            setSelectedSpeed={setSelectedSpeed}
          />
        </div>
      </Draggable>
    </div>
  ) : (
    <div className={`video-modal ${isVideoGalleryOpen ? 'active' : ''}`}>
      <>
        <div
          className='overlay-background'
          onClick={() => setShowSpeedMenu(false)}
        ></div>
        <span
          className='closeModal'
          style={{ zIndex: '999999999999' }}
          onClick={() => {
            setIsPlaying(false);
            closeModal();
          }}
        >
          X
        </span>
        <VideoPlayer
          videos={videos}
          showSpeedMenu={showSpeedMenu}
          setShowSpeedMenu={setShowSpeedMenu}
          toggleMinimize={toggleMinimize}
          isMinimized={isMinimized}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          videoRef={videoRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          duration={duration}
          setDuration={setDuration}
          volume={volume}
          setVolume={setVolume}
          selectedSpeed={selectedSpeed}
          setSelectedSpeed={setSelectedSpeed}
        />
      </>
      <VideoOptions videos={videos} />
    </div>
  );
};

export default CustomVideoPlayer;
