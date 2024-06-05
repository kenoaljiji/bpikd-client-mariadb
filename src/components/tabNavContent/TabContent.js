import React, { useEffect, useState } from 'react';
import VideoGallery from '../videoGallery/VideoGallery';
import './tab-content.scss';
import ImageGallery from '../image/ImageGallery';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lightgallery.scss';
import 'lightgallery/scss/lg-zoom.scss';

import DOMPurify from 'dompurify';
import moment from 'moment';
import StopAudioButton from '../../icons/StopAudioButton';
import PlayAudioButton from '../../icons/PlayAudioButton';
import Loader from '../loader/Loader';

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
    <div
      className='audio-container'
      style={{ alignItems: audio.name.length < 28 ? 'center' : 'flex-start' }}
    >
      {isPlaying ? (
        <div onClick={togglePlay}>
          <StopAudioButton color={'#DF2B2B'} />
        </div>
      ) : (
        <div onClick={togglePlay}>
          <PlayAudioButton color={'#DF2B2B'} />
        </div>
      )}
      {isPlaying && <audio src={audio.url} autoPlay onEnded={stopAudio} />}
      <span>{audio.name}</span>
    </div>
  );
}

const TabContent = ({
  tab,
  selectedWork,
  openModal,
  isPlaying,
  setIsPlaying,
  smallLoading,
}) => {
  const [currentPlaying, setCurrentPlaying] = useState(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const playAudio = (fileName) => {
    setCurrentPlaying(fileName);
  };

  const stopAudio = () => {
    setCurrentPlaying(null);
  };
  const selectedMedia = selectedWork?.media;

  const { images, documents, audios, videos } = selectedMedia;

  useEffect(() => {}, [selectedWork, tab]);

  // Function to handle file download
  const handleDownload = (event, url, filename) => {
    event.preventDefault(); // Prevent the default anchor tag behaviour
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      })
      .catch(() => {
        alert('Failed to download file.');
      });
  };

  const onInit = () => {};
  const colorStyle = {
    red: '#E5332A',
    blue: '#0087D5',
  };

  const svgEye = () => (
    <svg
      width='21px'
      height='21px'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M1.5 12c0-2.25 3.75-7.5 10.5-7.5S22.5 9.75 22.5 12s-3.75 7.5-10.5 7.5S1.5 14.25 1.5 12zM12 16.75a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM14.7 12a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 0 1 5.4 0z'
        fill='#000000'
      />
    </svg>
  );

  const handleScreenChange = (fullscreenState) => {
    setIsFullscreen(fullscreenState);
  };

  switch (tab) {
    case 'releases':
      return (
        <div className='tab-content releases'>
          {selectedWork.content?.length > 0 ? (
            <div style={{ width: '100%' }}>
              <ContentComponent content={selectedWork?.content} />
              <div className='counter-date' style={{ marginTop: '0px' }}>
                <span style={{ marginRight: '5px' }}>
                  {smallLoading ? (
                    <div className='spinner-mobile'>
                      <Loader />
                    </div>
                  ) : (
                    selectedWork?.work_view_count
                  )}
                </span>
                {svgEye()}
                <span>{`${moment(selectedWork?.scheduledPublishTime).format(
                  'HH:mm DD.MM.YYYY'
                )}`}</span>
              </div>
            </div>
          ) : (
            <p>no content</p>
          )}
        </div>
      );
    case 'documents':
      return (
        <div className='tab-content documents'>
          <ul className='grid-document-style'>
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
                  {doc?.url.endsWith('.pdf') ? (
                    <a
                      href={doc.url}
                      className=''
                      target='_blank'
                      rel='noreferrer'
                    >
                      {doc.name}
                    </a>
                  ) : (
                    <a href={doc.url} download={doc.name}>
                      {doc.name}
                    </a>
                  )}
                </li>
              ))
            ) : (
              <p>no content</p>
            )}
          </ul>
        </div>
      );

    case 'images':
      return (
        <div className='tab-content images'>
          <ImageGallery images={images} />
        </div>
      );
    case 'audio':
      return (
        <div className='tab-content audio'>
          <ul className='grid-document-style'>
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
              <p>no content</p>
            )}
          </ul>
        </div>
      );
    case 'video':
      return (
        <div className='tab-content videos'>
          {selectedMedia.videos.length > 0 ? (
            <VideoGallery
              selectedMedia={selectedMedia}
              openModal={openModal}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          ) : (
            <p>no content</p>
          )}
        </div>
      );
    default:
      return null;
  }
};

export default TabContent;
