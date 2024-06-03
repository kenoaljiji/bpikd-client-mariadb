import React, { useEffect } from 'react';
import CustomVideoPlayer from '../customvideoplayer/CustomVideoPlayer';
import { useGlobalContext } from '../../context/bpikd/GlobalState';

const VideoModal = ({
  closeModal,
  isVideoGalleryOpen,
  isPlaying,
  setIsPlaying,
}) => {
  const { videosData } = useGlobalContext();

  const videos = videosData.videos;

  useEffect(() => {
    console.log(videos);
  }, [videos]);

  return (
    <CustomVideoPlayer
      videos={videos}
      closeModal={closeModal}
      isVideoGalleryOpen={isVideoGalleryOpen}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    />
  );
};

export default VideoModal;
