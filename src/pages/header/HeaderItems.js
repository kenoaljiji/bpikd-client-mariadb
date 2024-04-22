import React, { useRef, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouteContext } from "../../context/route/RouteProvider";
import Alerts from "../../components/Alerts";
import "./headerItems.scss";

const HeaderItems = () => {
  const { state, dispatch, changeHeaderAndRoutes, loadHeaderConfig } =
    useRouteContext();
  const { headersData } = state;

  const { routes, buttons, logoImgPath } = headersData;

  const [error, setError] = useState(false);

  const [logoImage, setLogoImage] = useState("");
  const [imageURL, setImageURL] = useState(logoImgPath);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Optionally, display the image preview
    setLogoImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImageURL(previewUrl);

    // No need to reset the file input here
  };

  const clearImage = () => {
    setLogoImage(null);
    setImageURL(""); // Clear image preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  // Building initial form values based on current routes and buttons state
  const initialValues = {
    ...routes,
    ...buttons,
  };

  // Creating a dynamic validation schema based on the routes and buttons
  const validationSchema = Yup.object({
    ...Object.keys(routes).reduce((acc, key) => {
      acc[key] = Yup.string().required(`${key} field is required`);
      return acc;
    }, {}),
    ...Object.keys(buttons).reduce((acc, key) => {
      acc[key] = Yup.string().required(`${key} field is required`);
      return acc;
    }, {}),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    // Here, dispatch an action to update the routes and buttons in your context
    // Assuming you have an action type called "UPDATE_CONFIG"

    // Initialize empty objects for routes and buttons
    let routes = {};
    let buttons = {};

    // Separate values into routes and buttons based on the key prefix or specific keys
    Object.keys(values).forEach((key) => {
      if (
        ["person", "news", "about", "partners", "shop", "soon"].includes(key)
      ) {
        // If the key is one of the routes, add it to the routes object
        routes[key] = values[key];
      } else if (["button1", "button2"].includes(key)) {
        // If the key is one of the buttons, add it to the buttons object
        buttons[key] = values[key];
      }
    });

    const data = {
      routes,
      buttons,
      logoImgPath: logoImage,
    };

    changeHeaderAndRoutes(data);

    setSubmitting(false);

    setError(true);
    /*  setTimeout(() => {
      setError(false);
    }, 2000); */
  };

  return (
    <div className="my-5 container">
      <div className="text-center">{error && <Alerts />}</div>
      <h2 className="mb-5 pt-3 text-center font-bold">Header Items</h2>
      <div className="">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="justify-content-center">
                <div className="d-flex justify-content-between border-bottom px-0 pb-1">
                  <h4>Header Categories</h4>
                  <button
                    style={{ position: "relative", top: "-10px" }}
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
                <div className="d-flex justify-content-center">
                  <div className="w-100 pt-2">
                    {Object.entries(routes).map(([key, label]) => (
                      <FieldGroup label={label} name={key} key={key} />
                    ))}
                  </div>
                  <div className="featured mt-4">
                    {imageURL !== "" && (
                      <div
                        className="featured-close"
                        onClick={() => clearImage()}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </div>
                    )}

                    {/* Image upload and display */}
                    {imageURL ? (
                      <img
                        src={imageURL}
                        alt="Featured"
                        style={{
                          width: "250px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "250px",
                          height: "100px",
                          border: "2px dashed #ccc",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span>CHANGE LOGO</span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="featured-image-upload"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*" // Accept images only
                    />
                    <label
                      htmlFor="featured-image-upload"
                      className="featured-image-container bg-success text-white p-1 w-100 mt-1 cursor-pointer"
                    >
                      <div className="add-image-placeholder text-center">
                        <i className="fas fa-plus"></i> <span>CHANGE LOGO</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="d-flex justify-content-between border-bottom px-0 pb-1 mt-3">
                  <h4>Header Buttons</h4>
                </div>
                <div className="mx-auto pt-2">
                  {Object.keys(buttons).map((key) => (
                    <FieldGroup label={key} name={key} key={key} />
                  ))}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const FieldGroup = ({ label, name }) => (
  <div className="mt-3">
    <div className="mb-3">
      <div className="container">
        <div className="row">
          <div className="col-md-3 text-end">
            {/* Ensure label displays full value */}
            <label htmlFor={name} className="form-label pt-2">
              {label}
              {/* Transform dashes to spaces if needed */}
            </label>
          </div>
          <div className="col-md-8">
            {/* Field uses the name, should handle spaces correctly */}
            <Field type="text" className="form-control" id={name} name={name} />
            <ErrorMessage
              name={name}
              component="div"
              className="text-danger pt-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeaderItems;
