import React, { useEffect } from 'react';
import './videoGallery.scss';

const VideoGallery = ({ selectedMedia, openModal }) => {
  const onClickHandeler = () => {
    console.log('clicked');
    openModal();
  };

  return (
    <div className='video-gallery'>
      {selectedMedia.videos?.length > 0 ? (
        selectedMedia.videos?.map((item, index) => (
          <div className='mt-0' onClick={onClickHandeler}>
            <img
              alt={'Video' + (index + 1)}
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
