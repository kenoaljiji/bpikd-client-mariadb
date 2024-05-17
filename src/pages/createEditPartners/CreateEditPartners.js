import React, { useEffect, useState } from 'react';
import './createEditPartners.scss';
import { localhost } from '../../config/config';
import axios from 'axios';
import { useGlobalContext } from '../../context/bpikd/GlobalState';

function CreateEditPartners() {
  const { partners, getPartnersData, category } = useGlobalContext();

  const [imageFiles, setImageFiles] = useState(
    partners?.map((partner) => ({
      file: null,
      preview: partner.imagePath,
    }))
  );

  const [loading, setLoading] = useState(false);

  const handleAddImage = () => {
    setImageFiles((imageFiles) => [...imageFiles, null]); // Add a null entry to represent a new empty field
  };

  useEffect(() => {
    getPartnersData(setLoading);
  }, [category]);

  const uploadAddDeletePartnersImages = async () => {
    const formData = new FormData();

    imageFiles.forEach((img, index) => {
      if (img && img.file) {
        formData.append(`partnersImages-${index}`, img.file, img.file.name);
      }
    });

    try {
      const response = await axios.post(
        `${localhost}/post/partners`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response);

      getPartnersData(setLoading);
      alert('Files uploaded successfully'); // Simple success feedback
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images'); // Simple error feedback
    }
  };

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newImageFiles = imageFiles.slice();
      newImageFiles[index] = {
        file: file,
        preview: URL.createObjectURL(file),
      };
      setImageFiles(newImageFiles);
    }
  };

  const clearImage = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles[index] = null; // Set the image at the specific index back to null
    setImageFiles(updatedFiles);
  };

  const removeImageField = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1); // Remove the image field at the specified index
    setImageFiles(updatedFiles);
  };

  useEffect(() => {
    console.log(imageFiles);
  }, [imageFiles]);
  return (
    <div className='container partners mt-5'>
      <div className='partners-create'>
        {!loading &&
          imageFiles.map((img, index) => (
            <div className='image-container' key={`partnersImages-${index}`}>
              {img ? (
                <img
                  src={img.preview}
                  alt={`Preview ${index}`}
                  style={{ objectFit: 'cover' }}
                  onLoad={() => URL.revokeObjectURL(img.preview)}
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
                onClick={() => removeImageField(index)}
                className='btn btn-danger mt-2 w-100'
              >
                Remove Field
              </button>
            </div>
          ))}
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
