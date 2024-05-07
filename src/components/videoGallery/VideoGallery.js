import React, { useEffect, useState } from "react";
import "./videoGallery.scss";
import { useGlobalContext } from "../../context/bpikd/GlobalState";

const VideoGallery = ({ selectedMedia, openModal }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const { getVideosData } = useGlobalContext();

  const onClickHandeler = (index) => {
    const videoData = selectedMedia.videos?.map((video) => video.url);
    const data = {
      index,
      videos: videoData,
    };
    console.log(data.videos);
    getVideosData(data);
    openModal();
  };

  useEffect(() => {
    selectedMedia.videos.forEach((video, index) => {
      const videoElement = document.createElement("video");
      videoElement.src = video.url; // Use the URL from the video object
      videoElement.crossOrigin = "anonymous"; // Set crossOrigin for CORS
      videoElement.preload = "metadata"; // Preload metadata to ensure dimensions are loaded

      const handleLoadedMetadata = () => {
        // Seek to a moment in the video where you want to capture the thumbnail
        videoElement.currentTime = 5; // 5 seconds into the video
      };

      const handleSeeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 160; // Thumbnail width
        canvas.height = 90; // Thumbnail height
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        setThumbnails((prev) => [
          ...prev,
          { id: video.mediaId, src: imageUrl },
        ]);
        // Cleanup: remove event listeners
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("seeked", handleSeeked);
      };

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("seeked", handleSeeked);
    });

    return () => {
      // Cleanup created video elements if necessary
    };
  }, [selectedMedia.videos]);

  return (
    <div className="video-gallery">
      {thumbnails.length > 0 ? (
        thumbnails.map((thumb, index) => (
          <div key={thumb.id} onClick={() => onClickHandeler(index)}>
            <img alt={`Video thumbnail ${thumb.id}`} src={thumb.src} />
          </div>
        ))
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
};

export default VideoGallery;
