import React from 'react';
import VideoThumbnail from 'react-video-thumbnail';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import './videoGallery.scss';

const VideoGallery = ({ selectedMedia, openModal }) => {
  const { getVideosData } = useGlobalContext();
  const onClickHandler = (index) => {
    const videoData = selectedMedia.videos?.map((video) => video.url);
    const data = {
      index,
      videos: videoData,
    };
    getVideosData(data);
    openModal();
  };

  return (
    <div className='video-gallery-generated'>
      {selectedMedia.videos?.map((video, index) => (
        <div
          onClick={() => onClickHandler(index)}
          key={index}
          className='video-gallery-item'
        >
          <VideoThumbnail
            videoUrl={video.url} // URL of the video
            thumbnailHandler={(thumbnail) => console.log(thumbnail)}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoGallery;
