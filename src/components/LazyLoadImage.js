import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ImageComponent = ({ image }) => (
  <div>
    <LazyLoadImage
      src={image.src}
      alt={image.alt}
      effect='blur'
      featured='/assets/no-picture.png'
    />
  </div>
);

export default ImageComponent;
