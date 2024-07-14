import React from 'react';

const BackTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // optional: smooth scrolling animation
    });
  };

  return (
    <div className='text-center button-backTop'>
      <img
        src='/assets/images/back-top.png'
        alt='back to top'
        onClick={scrollToTop}
      />
    </div>
  );
};

export default BackTopButton;
