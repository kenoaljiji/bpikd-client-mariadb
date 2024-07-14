import React, { useEffect, useState } from 'react';
import './createEditPartners.scss';
import { localhost } from '../../config/config';
import axios from 'axios';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import { useAlertContext } from '../../context/alert/AlertState';
import Loader from '../../components/loader/Loader';

function CreateEditPartners() {
  const { partners, getPartnersData, category } = useGlobalContext();
  const { setAlert } = useAlertContext();

  const [imageFiles, setImageFiles] = useState(
    partners.map((partner) => ({ ...partner, url: '' }))
  ); // Initialize with URL property

  const [loading, setLoading] = useState(false);

  const handleAddImage = () => {
    setImageFiles((imageFiles) => [
      ...imageFiles,
      { file: null, url: '', preview: '' }, // Initialize with structured object
    ]);
  };

  useEffect(() => {
    /*    getPartnersData(setLoading); */
  }, [category]);

  useEffect(() => {
    setImageFiles(
      partners.map((partner) => ({
        ...partner,
        url: partner?.url ? partner.url : '',
      }))
    ); // Initialize with URL property on data fetch
  }, [partners]);

  const handleImageUrlChange = (e, index) => {
    const newImageFiles = imageFiles.slice();
    newImageFiles[index] = { ...newImageFiles[index], url: e.target.value };
    setImageFiles(newImageFiles);
  };

  const uploadAddDeletePartnersImages = async () => {
    const formData = new FormData();

    formData.append('partnersData', JSON.stringify(imageFiles)); // Only send non-file data

    imageFiles.forEach((img, index) => {
      if (img && img.file) {
        formData.append(`partnersImages-${index}`, img.file, img.file.name);
      }
    });

    try {
      setLoading(true);
      const response = await axios.post(
        `${localhost}/post/partners`,
        formData,
        {
          headers: {
            // Content-Type should not be manually set, let axios handle it
          },
        }
      );

      getPartnersData(setLoading); // Refresh data after the operation
      setAlert('Files uploaded successfully', 'success'); // Simple success feedback
    } catch (error) {
      console.error('Error uploading images:', error);
      setAlert('Failed to upload images', 'danger');
    }
    setLoading(false);
  };

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newImageFiles = imageFiles.slice(); // Create a shallow copy of the imageFiles array
      const currentEntry = imageFiles[index]; // Access the current entry at the specified index

      if (currentEntry && currentEntry.id) {
        // If there's an existing entry with an ID, preserve the ID
        newImageFiles[index] = {
          ...currentEntry, // Spread existing properties
          file: file,
          preview: URL.createObjectURL(file),
        };
      } else {
        // If it's a new entry (no existing ID), add without ID
        newImageFiles[index] = {
          file: file,
          preview: URL.createObjectURL(file),
        };
      }

      setImageFiles(newImageFiles); // Update state
    }
  };

  /* const clearImage = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles[index] = null; // Set the image at the specific index back to null
    setImageFiles(updatedFiles);
  }; */

  const handleRemovePartner = async (index) => {
    const partner = imageFiles[index];

    if (partner?.id) {
      // Partner has an ID, attempt to delete from the server
      try {
        setLoading(true);
        const response = await axios.delete(
          `${localhost}/post/partners/${partner?.id}`
        );
        console.log(response.data);

        // Successfully deleted from the server, now remove from local state
        removeImageField(index);
      } catch (error) {
        console.error('Error deleting partner:', error);
      }
    } else {
      // No ID, so this is a newly added field that hasn't been saved to the server yet
      removeImageField(index);
    }
    setLoading(false);
  };

  const removeImageField = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1); // Remove the image field at the specified index
    setImageFiles(updatedFiles);
  };

  return (
    <div className='container partners mt-5'>
      <div className='partners-create'>
        {imageFiles.length > 0 &&
          imageFiles.map((img, index) => (
            <div className='image-container' key={`partnersImages-${index}`}>
              {img.preview !== '' ? (
                <img
                  src={img.preview ? img.preview : img.imagePath}
                  alt={`Preview ${index}`}
                  style={{ objectFit: 'cover' }}
                  onLoad={() => URL.revokeObjectURL(img.imagePath)}
                />
              ) : (
                <div
                  style={{
                    border: '2px dashed #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '165px',
                  }}
                >
                  <span>ADD IMAGE</span>
                </div>
              )}
              <input
                type='text'
                value={img.url}
                onChange={(e) => handleImageUrlChange(e, index)}
                placeholder='Enter image URL'
                className='form-control my-2'
              />

              <input
                type='file'
                id={`featured-image-upload-${index}`}
                name={`partnersImages-${index}`}
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e, index)}
                accept='image/*'
              />
              <label
                htmlFor={`featured-image-upload-${index}`}
                className='bg-success text-white p-1 w-100 mt-1 cursor-pointer'
              >
                <div className='add-image-placeholder'>
                  <i className='fas fa-plus'></i> <span>ADD IMAGE</span>
                </div>
              </label>
              <button
                type='button'
                onClick={() => handleRemovePartner(index)}
                className='btn btn-danger mt-2 w-100'
              >
                Remove Field
              </button>
            </div>
          ))}
        {loading && (
          <div className='text-center d-flex align-items-center justify-content-center flex-column'>
            <div className='mt-4'>
              <Loader />
            </div>
            <span className='mt-3 blink-text'>
              Please Wait
              <span className='dots'></span>
            </span>
          </div>
        )}
        <div className='text-center d-flex align-items-center justify-content-center flex-column'>
          {/* <Alerts /> */}
        </div>
      </div>
      <button onClick={handleAddImage} className='add-field-button'>
        ADD FIELD
      </button>
      <button
        className='btn btn-success my-3'
        onClick={uploadAddDeletePartnersImages}
      >
        Submit
      </button>
    </div>
  );
}

export default CreateEditPartners;
