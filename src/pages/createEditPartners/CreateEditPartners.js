import React, { useState } from "react";
import "./createEditPartners.scss";

function CreateEditPartners() {
  const [imageFiles, setImageFiles] = useState([]);

  const handleAddImage = () => {
    setImageFiles((imageFiles) => [...imageFiles, null]); // Add a null entry to represent a new empty field
  };

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const updatedFiles = [...imageFiles];
      updatedFiles[index] = file; // Store the file object directly
      setImageFiles(updatedFiles);
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

  return (
    <div className="container partners">
      <h3 className="text-center my-5">Add Partners</h3>

      <div className="partners-create">
        {imageFiles.map((img, index) => (
          <div className="image-container" key={index}>
            {img && (
              <div
                className="featured-close"
                onClick={() => clearImage(index)}
              ></div>
            )}

            {img ? (
              <img
                src={URL.createObjectURL(img)} // Create a URL for the file object
                alt="Featured"
                style={{ objectFit: "cover" }}
                onLoad={() => URL.revokeObjectURL(img)} // Clean up the object URL after loading
              />
            ) : (
              <div
                style={{
                  border: "2px dashed #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "165px", // Ensure that the div has a minimum height for better UX
                }}
              >
                <span>ADD IMAGE</span>
              </div>
            )}
            <input
              type="file"
              id={`featured-image-upload-${index}`}
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e, index)}
              accept="image/*"
            />
            <label
              htmlFor={`featured-image-upload-${index}`}
              className="bg-success text-white p-1 w-100 mt-1 cursor-pointer"
            >
              <div className="add-image-placeholder">
                <i className="fas fa-plus"></i> <span>ADD IMAGE</span>
              </div>
            </label>
            <button
              type="button"
              onClick={() => removeImageField(index)}
              className="btn btn-danger mt-2 w-100"
            >
              Remove Field
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleAddImage} className="add-field-button">
        ADD FIELD
      </button>
    </div>
  );
}

export default CreateEditPartners;
