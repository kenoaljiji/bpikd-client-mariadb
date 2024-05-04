import React, { useEffect } from "react";
import "./videoGallery.scss";
import { useGlobalContext } from "../../context/bpikd/GlobalState";

const VideoGallery = ({ selectedMedia, openModal }) => {
  const { getVideosData } = useGlobalContext();
  const onClickHandeler = (index) => {
    const videoData = selectedMedia.videos?.map((video) => video.url);
    console.log(videoData);
    const data = {
      index,
      videos: videoData,
    };
    console.log(data.videos);
    getVideosData(data);
    openModal();
  };

  return (
    <div className="video-gallery">
      {selectedMedia.videos?.length > 0 ? (
        selectedMedia.videos?.map((item, index) => (
          <div className="mt-0" onClick={() => onClickHandeler(index)}>
            <img
              alt={"Video" + (index + 1)}
              src={`/assets/images/video-example.png`}
            />
          </div>
        ))
      ) : (
        <p>There is no content</p>
      )}
    </div>
  );
};

export default VideoGallery;
