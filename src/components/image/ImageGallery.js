import React, { useState } from 'react';

import './imageGallery.scss';

const ImageGallery = ({ image, picNum }) => {
  const onInit = () => {};

  return (
    <a href={image} className='mt-0'>
      <img alt={'slika' + picNum + 1} src={image} />
    </a>
  );
};

export default ImageGallery;
