import React from "react";
import CustomVideoPlayer from "../customvideoplayer/CustomVideoPlayer";

const VideoModal = ({ closeModal, isVideoGalleryOpen }) => {
  const videos = [
    "/assets/videos/video-test.mp4",
    "/assets/videos/video-test.mp4",
    "/assets/videos/video-test.mp4",
  ]; // Array of video URLs
  return (
    <CustomVideoPlayer
      videos={videos}
      closeModal={closeModal}
      isVideoGalleryOpen={isVideoGalleryOpen}
    />
  );
};

export default VideoModal;
