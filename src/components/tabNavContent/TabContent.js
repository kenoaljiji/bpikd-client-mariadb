import React, { useEffect, useState } from 'react';
import VideoGallery from '../videoGallery/VideoGallery';
import './tab-content.scss';
import ImageGallery from '../image/ImageGallery';
import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lightgallery.scss';
import 'lightgallery/scss/lg-zoom.scss';

import DOMPurify from 'dompurify';

function ContentComponent({ content }) {
  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <div
      className='custom-content'
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

function AudioPlayer({ audio, playAudio, stopAudio, isPlaying }) {
  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio(audio.name);
    }
  };

  return (
    <div className='audio-container'>
      {isPlaying ? (
        <i className='fa-regular fa-circle-stop' onClick={togglePlay}></i>
      ) : (
        <i className='fa-regular fa-circle-play' onClick={togglePlay}></i>
      )}
      {isPlaying && <audio src={audio.url} autoPlay onEnded={stopAudio} />}
      <span>{audio.name}</span>
    </div>
  );
}

const TabContent = ({ tab, selectedWork, openModal, closeModal }) => {
  const [currentPlaying, setCurrentPlaying] = useState(null);

  const playAudio = (fileName) => {
    setCurrentPlaying(fileName);
  };

  const stopAudio = () => {
    setCurrentPlaying(null);
  };
  const selectedMedia = selectedWork?.media;

  const { images, documents, audios, videos } = selectedMedia;

  useEffect(() => {}, [selectedWork, tab]);

  const onInit = () => {};
  const colorStyle = {
    red: '#E5332A',
    blue: '#0087D5',
  };

  const gridDocumentStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  };

  switch (tab) {
    case 'releases':
      return (
        <div className='tab-content releases'>
          {selectedWork.content?.length > 0 ? (
            <ContentComponent content={selectedWork?.content} />
          ) : (
            <p>There is no content</p>
          )}
        </div>
      );
    case 'documents':
      return (
        <div className='tab-content documents'>
          <ul style={gridDocumentStyle}>
            {documents?.length > 0 ? (
              documents?.map((doc, index) => (
                <li key={index} className=''>
                  {/* Font Awesome icons for file types */}
                  {doc?.url.endsWith('.pdf') && (
                    <i
                      className='fas fa-file-pdf fa-3x'
                      style={{ color: colorStyle.red }}
                    ></i>
                  )}
                  {doc?.url.endsWith('.doc') && (
                    <i
                      className='fas fa-file-word fa-3x'
                      style={{ color: colorStyle.blue }}
                    ></i>
                  )}
                  {doc?.url.endsWith('.docx') && (
                    <i
                      className='fas fa-file-word fa-3x'
                      style={{ color: '#0087d5' }}
                    ></i>
                  )}
                  {doc?.url.endsWith('.xls') && (
                    <i
                      className='fas fa-file-excel fa-3x'
                      style={{ color: '#31be7d' }}
                    ></i>
                  )}
                  {doc?.url.endsWith('.xlsx') && (
                    <i
                      className='fas fa-file-excel fa-3x'
                      style={{ color: '#31be7d' }}
                    ></i>
                  )}
                  {doc?.url.endsWith('.ppt') && (
                    <i
                      className='fas fa-file-powerpoint'
                      style={{ color: '#0087d5' }}
                    ></i>
                  )}
                  {doc?.url.endsWith('.pptx') && (
                    <i
                      className='fas fa-file-powerpoint'
                      style={{ color: '#0087d5' }}
                    ></i>
                  )}
                  {/* Render the file name */}
                  <a href={doc.url} className=''>
                    {doc.name}
                  </a>
                </li>
              ))
            ) : (
              <p>There is no content</p>
            )}
          </ul>
        </div>
      );

    case 'images':
      return (
        <div className='tab-content images'>
          {/*  <ul className="image-gallery" style={gridDocumentStyle}>
            {selectedMedia.images?.length > 0 ? (
              selectedMedia.images.map((image, index) => (
                <li key={index}>
                  <img src={`/assets/images/${image}`} alt={`img ${index}`} />
                </li>
              ))
            ) : (
              <p>There is no content</p>
            )}
          </ul> */}
          <LightGallery onInit={onInit} speed={500} backgroundColorr='#fff'>
            {images.length > 0 ? (
              images?.map((item, index) => (
                <ImageGallery image={item.url} picNum={index} />
              ))
            ) : (
              <p>There is no content</p>
            )}
          </LightGallery>
        </div>
      );
    case 'audio':
      return (
        <div className='tab-content audio'>
          <ul style={gridDocumentStyle}>
            {audios?.length > 0 ? (
              audios?.map((audio, index) => (
                <AudioPlayer
                  key={index}
                  audio={audio}
                  playAudio={playAudio}
                  stopAudio={stopAudio}
                  isPlaying={currentPlaying === audio.name}
                />
              ))
            ) : (
              <p>There is no content</p>
            )}
          </ul>
        </div>
      );
    case 'video':
      return (
        <div className='tab-content video'>
          {/*  {selectedMedia.video?.length > 0 ? (
              selectedMedia.video.map((video, index) => (
                <img key={index} src={'/assets/images/' + video} />
              ))
            ) : (
              <p>There is no content</p>
            )} */}
          <VideoGallery selectedMedia={selectedMedia} openModal={openModal} />
        </div>
      );
    default:
      return null;
  }
};

export default TabContent;
