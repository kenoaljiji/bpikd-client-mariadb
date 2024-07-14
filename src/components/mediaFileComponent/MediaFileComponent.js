import axios from 'axios';
import React, { useState } from 'react';
import { localhost } from '../../config/config';
import MediaButtonIcon from '../../icons/MediaButtonIcon';
import './mediaFileComponent.scss';

const MediaFileComponent = ({
  uploadedFiles,
  setUploadedFiles,
  fetchWorkDetails = null,
  getPersonById = null,
}) => {
  const [showMedia, setShowMedia] = useState(false);
  const [openFileIndex, setOpenFileIndex] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [selectionMode, setSelectionMode] = useState({}); // Tracks selection mode for each fileType

  const toggleMedia = () => setShowMedia(!showMedia);

  const toggleAccordion = (index) => {
    setOpenFileIndex(openFileIndex === index ? null : index);
  };

  // Toggles selection mode for a given fileType
  const toggleSelectionMode = (fileType) => {
    setSelectionMode((prev) => ({ ...prev, [fileType]: !prev[fileType] }));
  };

  const handleSelectFile = (fileType, file) => {
    const fileWithMetadata = { ...file, type: fileType };
    const isSelected = selectedFiles.some(
      (selectedFile) =>
        selectedFile.name === file.name && selectedFile.type === fileType
    );

    if (isSelected) {
      setSelectedFiles(
        selectedFiles.filter(
          (selectedFile) =>
            !(selectedFile.name === file.name && selectedFile.type === fileType)
        )
      );
    } else {
      setSelectedFiles([...selectedFiles, fileWithMetadata]);
    }
  };

  const deleteSelectedFiles = async (fileType) => {
    const uploadedFilesToDelete = uploadedFiles[fileType].filter(
      (file) =>
        file.mediaId &&
        selectedFiles.some(
          (selectedFile) =>
            selectedFile.name === file.name && selectedFile.type === fileType
        )
    );
    const filesToDeleteLocally = uploadedFiles[fileType].filter(
      (file) =>
        !file.mediaId &&
        selectedFiles.some(
          (selectedFile) =>
            selectedFile.name === file.name && selectedFile.type === fileType
        )
    );

    const remainingFiles = uploadedFiles[fileType].filter(
      (file) => !filesToDeleteLocally.includes(file)
    );
    setUploadedFiles((prev) => ({ ...prev, [fileType]: remainingFiles }));

    for (const file of uploadedFilesToDelete) {
      console.log(file.mediaId);
      try {
        const response = await axios.delete(
          `${localhost}/post/persons/media/${file.mediaId}`
        );

        console.log('Deleted:', response.data.message);
      } catch (error) {
        console.error('Failed to delete media:', error);
      }
    }
    if (fetchWorkDetails) {
      fetchWorkDetails();
    }

    setSelectedFiles(
      selectedFiles.filter((selectedFile) => selectedFile.type !== fileType)
    );
  };

  const nonEmptyFileTypes = Object.entries(uploadedFiles).filter(
    ([_, files]) => files.length > 0
  );

  const renderMediaContent = (fileType, file) => {
    switch (fileType) {
      case 'images':
        return (
          <img
            src={file.url}
            alt={file.name}
            style={{ maxWidth: '100px', maxHeight: '100px' }}
          />
        );
      case 'audios':
        return (
          <div className='audio-container'>
            {playingAudio === file.name ? (
              <i
                className='fa-regular fa-circle-stop'
                onClick={() => setPlayingAudio(null)}
              ></i>
            ) : (
              <i
                className='fa-regular fa-circle-play'
                onClick={() => setPlayingAudio(file.name)}
              ></i>
            )}
            {playingAudio === file.name && (
              <audio
                src={file.url}
                autoPlay
                onEnded={() => setPlayingAudio(null)}
              />
            )}
          </div>
        );
      case 'videos':
        return <video src={file.url} style={{ maxWidth: '200px' }} controls />;
      case 'documents':
        return <i className='fas fa-file-alt text-dark'></i>; // Example using Font Awesome CDN
      default:
        return null;
    }
  };

  return (
    <div className={`media-toggle-container ${showMedia ? 'active' : ''}`}>
      <div className='position-relative'>
        <div className='media-side' onClick={toggleMedia}>
          <div className='media-button'>
            <MediaButtonIcon />
          </div>
        </div>

        <div className='media-container d-block px-5'>
          <h3 className='my-3'>Media Files</h3>

          {nonEmptyFileTypes.length > 0 ? (
            <div className='accordion'>
              {nonEmptyFileTypes.map(([fileType, files], index) => (
                <div
                  key={fileType}
                  className={`accordion-item ${
                    openFileIndex === index ? 'open' : ''
                  }`}
                >
                  <div
                    className='accordion-header d-flex justify-content-between'
                    onClick={() => toggleAccordion(index)}
                  >
                    <div>
                      {fileType.toUpperCase()}
                      <i
                        className={`accordion-icon fas ${
                          openFileIndex === index ? 'arrow up' : 'arrow down'
                        }`}
                      ></i>
                    </div>
                    {openFileIndex === index && (
                      <div className='btn-container'>
                        {selectionMode[fileType] && (
                          <button
                            className='btn-delete-selected btn btn-danger me-2 border-danger'
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSelectedFiles(fileType);
                            }}
                          >
                            Delete
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectionMode(fileType);
                          }}
                        >
                          {selectionMode[fileType] ? 'Cancel' : 'Select'}
                        </button>
                      </div>
                    )}
                  </div>
                  {openFileIndex === index && (
                    <div className='accordion-body'>
                      {files.map((file, fileIndex) => (
                        <div key={fileIndex} className='file-item'>
                          <div className=''>
                            {selectionMode[fileType] && selectionMode && (
                              <input
                                type='checkbox'
                                className=''
                                checked={selectedFiles.some(
                                  (selectedFile) =>
                                    selectedFile.name === file.name &&
                                    selectedFile.type === fileType
                                )}
                                onChange={() =>
                                  handleSelectFile(fileType, file)
                                }
                              />
                            )}
                          </div>
                          {renderMediaContent(fileType, file)}
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='no-media-message'>There are no media items.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaFileComponent;
