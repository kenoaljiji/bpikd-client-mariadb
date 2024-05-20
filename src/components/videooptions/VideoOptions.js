import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faUndo,
  faShareAlt,
  faCopy,
  faEllipsisV, // Import for the three dots icon
} from '@fortawesome/free-solid-svg-icons';
import './videooptions.scss';
import SocialShareComponent from '../socialShare/SocialShareComponent';
import { localhost } from '../../config/config';
import { useGlobalContext } from '../../context/bpikd/GlobalState';

const VideoOptions = () => {
  const { videosData } = useGlobalContext();
  const { index, videos } = videosData;
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);

  const toggleSocialShare = () => {
    setShowSocialShare(!showSocialShare);
  };

  useEffect(() => {
    console.log(videosData);
  }, [videos]);

  const handleDownload = async () => {
    const videoUrl = videos[index];

    // Fetch the video from the server
    const response = await fetch(videoUrl);
    if (response.ok) {
      // Create a blob from the video stream
      const videoBlob = await response.blob();
      // Create a URL for the blob
      const videoUrlBlob = URL.createObjectURL(videoBlob);

      // Create a link to download the blob
      const link = document.createElement('a');
      link.href = videoUrlBlob;
      link.download = 'downloaded_video.mp4'; // This is the name the downloaded file will have

      // Append the link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional: release the created blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(videoUrlBlob), 100);
    } else {
      console.error('Failed to download video:', response.statusText);
    }
  };

  useEffect(() => {
    const videoElement = document.querySelector('.video');
    if (videoElement) {
      videoElement.style.transform = `rotate(${rotation}deg)`;

      // Apply scale transformation when rotated to 90, 180, or 270 degrees
      if (rotation === 90 || rotation === 270) {
        videoElement.style.transform += ' scale(0.5)';
        videoElement.style.transition = 'all .3s';
      }

      // If rotated to 270 degrees, reset the video to its original state
      if (rotation === 360) {
        videoElement.addEventListener('transitionend', handleRotationReset);
      }
    }

    return () => {
      // Cleanup event listener
      videoElement.removeEventListener('transitionend', handleRotationReset);
    };
  }, [rotation]);

  // Function to handle resetting the video to its original state after rotation to 270 degrees
  const handleRotationReset = () => {
    const videoElement = document.querySelector('.video');
    if (videoElement) {
      videoElement.style.transform = 'none';
      videoElement.style.transition = 'none';
      videoElement.removeEventListener('transitionend', handleRotationReset);
      setRotation(0);
    }
  };

  const handleShare = () => {
    // Logic to handle social sharing
    /*  toggleSocialShare(); */
    setShowSocialShare(true);
  };

  const handleRotate = () => {
    // Logic to handle video rotation
    if (rotation !== 360) {
      setRotation((prevRotation) => prevRotation + 90);
    } else setRotation(0);
  };

  const handleCopyLink = () => {
    const videoUrl = videos[index];
    navigator.clipboard
      .writeText(videoUrl)
      .then(() => {
        setMessage(true);
        setTimeout(() => {
          setMessage(false);
        }, 1000);
      })
      .catch((error) => {
        console.error('Error copying video link:', error);
      });
  };

  return (
    <div
      className='video-options'
      onMouseLeave={() => setShowSocialShare(false)}
    >
      <div className='option' onClick={handleDownload}>
        <FontAwesomeIcon icon={faDownload} />
      </div>
      <div className='option' onClick={handleRotate}>
        <FontAwesomeIcon
          icon={faUndo}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>

      <div className='option more-options'>
        <FontAwesomeIcon icon={faEllipsisV} />
        <div className='hidden-menu'>
          {showSocialShare && (
            <div className='option'>
              <SocialShareComponent
                showSocialShare={showSocialShare}
                toggleSocialShare={toggleSocialShare}
              />
            </div>
          )}
          <div className='option' onMouseEnter={handleShare}>
            <FontAwesomeIcon icon={faShareAlt} />
            <span>Share</span>
          </div>
          <div
            className='option'
            onClick={handleCopyLink}
            onMouseEnter={() => setShowSocialShare(false)}
          >
            <FontAwesomeIcon icon={faCopy} />

            {message ? <span>Link copied</span> : <span>Copy Link</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoOptions;
