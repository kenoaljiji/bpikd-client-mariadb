import React, { useEffect, useState } from "react";
import "./createEditPartners.scss";
import { localhost } from "../../config/config";
import axios from "axios";
import { useGlobalContext } from "../../context/bpikd/GlobalState";

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

    // Append all current image data to formData
    formData.append("images", JSON.stringify(imageFiles));
    console.log(partners);

    imageFiles.forEach((img, index) => {
      if (img && img.file) {
        // Append file only if it's newly uploaded
        formData.append(`partnersImages-${index}`, img.file, img.file.name);
      }
    });
    // Handle sending the request
    try {
      const response = await axios.post(
        "http://localhost:8000/post/partners",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);
      getPartnersData(setLoading);
    } catch (error) {
      console.error("Error uploading images:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Axios request error:", error.request);
      } else {
        console.error("Error", error.message);
      }
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

  const updatePartners = async () => {
    const formData = new FormData();

    imageFiles.forEach((img, index) => {
      if (img.file) {
        formData.append(`file-${index}`, img.file, img.file.name);
      }
      formData.append(`preview-${index}`, img.preview);
      if (img.id) {
        formData.append(`id-${index}`, img.id);
      }
    });

    try {
      const response = await axios.put(
        "http://localhost:8000/post/partners",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error updating partners:", error);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = imageFiles.filter((_, idx) => idx !== index);
    setImageFiles(updatedFiles);
    updatePartners();
  };

  // Additional methods for handling file changes, adding new files, etc.

  return (
    <div className="container partners mt-5">
      <div className="partners-create">
        {!loading &&
          imageFiles.map((img, index) => (
            <div className="image-container" key={`partnersImages-${index}`}>
              {img && (
                <div
                  className="featured-close"
                  onClick={() => clearImage(index)}
                ></div>
              )}

              {img ? (
                <img
                  src={img.preview}
                  alt={`Preview ${index}`}
                  style={{ objectFit: "cover" }}
                  onLoad={() => URL.revokeObjectURL(img.preview)}
                />
              ) : (
                <div
                  style={{
                    border: "2px dashed #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "165px",
                  }}
                >
                  <span>ADD IMAGE</span>
                </div>
              )}
              <input
                type="file"
                id={`featured-image-upload-${index}`}
                name={`partnersImages-${index}`}
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
      <button
        className="btn btn-success my-3"
        onClick={uploadAddDeletePartnersImages}
      >
        Submit
      </button>
    </div>
  );
}

export default CreateEditPartners;
