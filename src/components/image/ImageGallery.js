import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Download from 'yet-another-react-lightbox/plugins/download';
import './imageGallery.scss';

const ImageGallery = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Assuming images array includes objects with url and variants for different sizes
  const slides = images.map((image) => ({
    src: image.url,
    alt: `Image ${images.indexOf(image) + 1}`,
  }));

  return (
    <div className='image-gallery-lightbox'>
      {images.length > 0 ? (
        images?.map((item, index) => (
          <img
            key={index}
            src={item.url}
            alt={`Gallery no ${index}`}
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
            style={{ cursor: 'pointer' }}
          />
        ))
      ) : (
        <p>no content</p>
      )}

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={slides}
          index={photoIndex}
          plugins={[Download]}
        />
      )}
    </div>
  );
};

export default ImageGallery;
