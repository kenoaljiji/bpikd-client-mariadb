import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faVolumeMute,
  faVolumeUp,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import leftArrowIcon from './left-arrow.svg';
import rightArrowIcon from './right-arrow.svg';

import ProgressBar from '../progressBar/ProgressBar';
import { useGlobalContext } from '../../context/bpikd/GlobalState';

const VideoPlayer = ({
  showSpeedMenu,
  setShowSpeedMenu,
  toggleMinimize,
  isMinimized,
  currentTime,
  setCurrentTime,
  videoRef,
  isPlaying,
  closeModal,
  setIsPlaying,
  isMuted,
  setIsMuted,
  isFullScreen,
  setIsFullScreen,
  duration,
  videos,
  setDuration,
  volume,
  setVolume,
  selectedSpeed,
  setSelectedSpeed,
}) => {
  const { videosData, getVideosData } = useGlobalContext();

  const { index } = videosData;

  const [displaySocialIcons, setDisplaySocialIcons] = useState(false);

  const [videoSize, setVideoSize] = useState('landscape');

  const onClickHandler = (index) => {
    const data = {
      index,
      videos: videos,
    };
    getVideosData(data);
  };

  useEffect(() => {
    setShowSpeedMenu(false);
    let video = videoRef.current;
    if (video) {
      video.currentTime = currentTime;
    }

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration);
    });

    return () => {
      video.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateSize = () => {
        const orientation =
          video.clientWidth > video.clientHeight ? 'landscape' : 'portrait';

        // Update state
        setVideoSize(orientation);
        console.log(orientation);
      };

      // Add event listener for when metadata is loaded
      video.addEventListener('loadedmetadata', updateSize);

      // Clean-up function to remove event listeners
      return () => {
        video.removeEventListener('loadedmetadata', updateSize);
        window.removeEventListener('resize', updateSize);
      };
    }
  }, [index]); // Depend on currentVideoIndex to re-run effect when video changes

  const updateTime = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMuteUnmute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !videoRef.current.muted;
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handlePreviousVideo = () => {
    const newIndex = index === 0 ? videos.length - 1 : index - 1;
    onClickHandler(newIndex);
    videoRef.current.load();
  };

  const handleNextVideo = () => {
    const newIndex = index === videos.length - 1 ? 0 : index + 1;
    onClickHandler(newIndex);
    videoRef.current.load();
  };

  const adjustVolume = (e) => {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const newVolume = ((e.clientX - rect.left) / rect.width) * 100;
    setVolume(newVolume);
    videoRef.current.volume = newVolume / 100;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  const formatAdjustedTime = (time) => {
    const adjustedMinutes = Math.floor(time / 60);
    const adjustedSeconds = Math.floor(time % 60);
    return `${String(adjustedMinutes).padStart(2, '0')}:${String(
      adjustedSeconds
    ).padStart(2, '0')}`;
  };

  const adjustedDuration = duration - currentTime;

  const handleProgressBarClick = (clickedTime) => {
    const newTime = (clickedTime * duration) / 100;
    videoRef.current.currentTime = newTime;
  };

  const handleSpeedBarClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressBarWidth = progressBar.offsetWidth;

    const newSpeed = (clickX / progressBarWidth) * 2;
    handleSpeedSelection(newSpeed.toFixed(1));
  };

  const toggleSpeedMenu = () => {
    setShowSpeedMenu(!showSpeedMenu);
  };

  const handleSpeedSelection = (speed) => {
    setSelectedSpeed(speed);
    setShowSpeedMenu(false);
    videoRef.current.playbackRate = speed;
  };

  const speedOptions = [
    { value: 0.5, label: '0.5x Slow' },
    { value: 1.0, label: '1.0x Normal' },
    { value: 1.2, label: '1.2x Medium' },
    { value: 1.5, label: '1.5x Fast' },
    { value: 1.7, label: '1.7x Very Fast' },
    { value: 2.0, label: '2.0x Super Fast' },
  ];

  return (
    <div className={`custom-video-player ${isMinimized ? 'minimized' : ''}`}>
      <div className='video-container position-relative'>
        {!isMinimized && (
          <div
            onClick={handlePreviousVideo}
            className='arrow-button left-arrow'
          >
            <img src={leftArrowIcon} alt='Left Arrow' />
          </div>
        )}
        <div
          className='position-relative'
          onMouseEnter={() => setDisplaySocialIcons(false)}
        >
          {isMinimized && (
            <span
              className='closeModal'
              onClick={(e) => {
                e.stopPropagation(e);
                toggleMinimize();
                setIsPlaying(false);
                closeModal();
              }}
            >
              x
            </span>
          )}

          <video
            ref={videoRef}
            src={videos[index]}
            className={`video ${
              videoSize === 'landscape' ? 'landscape' : 'portrait'
            }`}
            volume={volume / 100}
          />
        </div>
        {!isMinimized && (
          <div onClick={handleNextVideo} className='arrow-button right-arrow'>
            <img src={rightArrowIcon} alt='Right Arrow' />
          </div>
        )}
      </div>
      <div className='controls'>
        <div
          className={`speed-wrapper ${showSpeedMenu ? 'active' : ''}`}
          onMouseLeave={() => setShowSpeedMenu(false)}
        >
          <div className='speed-menu'>
            <div className='progress-container'>
              <span>{selectedSpeed}x</span>
              <div
                className='speed-progress-bar ms-2'
                onClick={handleSpeedBarClick}
              >
                <div
                  className='speed-progress'
                  style={{ width: `${selectedSpeed * 50}%` }}
                ></div>
              </div>
            </div>
            <div className='line'></div>
            <ul className='mt-2'>
              {speedOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSpeedSelection(option.value)}
                  className='d-flex justify-content-between align-items-center'
                >
                  {option.label}
                  {selectedSpeed === option.value && (
                    <FontAwesomeIcon icon={faCheck} color={'#0087d5'} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='bottom-controls'>
          <div className='main-controls'>
            <div className='volume-control'>
              <button
                onClick={toggleMuteUnmute}
                className={`sound-icon ${isMuted ? 'muted' : ''}`}
              >
                <i>
                  <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
                </i>
              </button>
              <div className='volume-bar' onClick={adjustVolume}>
                <div
                  className='volume-progress'
                  style={{ width: `${volume}%` }}
                ></div>
              </div>
            </div>
            <button onClick={togglePlayPause} className='play-button'>
              <i>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </i>
            </button>
            <div className='misc-controls'>
              <button onClick={toggleFullScreen}>
                <i className='fa-solid fa-up-right-and-down-left-from-center'></i>
              </button>

              <button onClick={toggleMinimize}>
                <i className='fa-regular fa-window-maximize'></i>
              </button>
              <button
                onClick={toggleSpeedMenu}
                className='speed-menu-button'
                onMouseEnter={() => setShowSpeedMenu(true)}
              >
                <div className='speed-icon'>{selectedSpeed}x</div>
              </button>
            </div>
          </div>
        </div>
        <div className='progress-bar-container'>
          <div className='current-time'>{formatTime(currentTime)}</div>
          <ProgressBar
            duration={duration}
            currentTime={currentTime}
            onProgressClick={handleProgressBarClick}
          />
          <div className='video-time'>
            -{formatAdjustedTime(adjustedDuration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
