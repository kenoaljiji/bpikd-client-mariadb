import React from 'react';

const ProgressUpload = ({ progress }) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#ddd',
        marginTop: '5px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          height: '25px',
          width: `${progress}%`,
          backgroundColor: 'green',
          textAlign: 'center',
          color: 'white',
          lineHeight: '20px', // Vertically center the text
        }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressUpload;
