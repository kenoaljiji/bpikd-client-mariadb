import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useGlobalContext } from "../../context/bpikd/GlobalState";
import AddImageIcon from "../../icons/AddImageIcon";
import AddAudioIcon from "../../icons/AddAudioIcon";
import AddVideoIcon from "../../icons/AddVideoIcon";
import AddWordIcon from "../../icons/AddWordIcon";
import "./createEditPost.scss";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MediaFileComponent from "../../components/mediaFileComponent/MediaFileComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // for snow theme
import Loader from "../../components/loader/Loader";
import moment from "moment";
import Partners from "../partners/Partners";
import CreateEditPartners from "../createEditPartners/CreateEditPartners";
import { useParams } from "react-router-dom";

const CreateEditPost = () => {
  const {
    createPersonsPost,
    createNewsAndPagePost,
    category,
    setCategory,
    singlePost,
    listPages,
  } = useGlobalContext();

  const [imageURL, setImageURL] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("");

  const fileInputRef = useRef(null);

  const { category: paramCategory, id: postId } = useParams();

  const [initialValues, setInitialValues] = useState({
    title: singlePost?.title || "",
    visibility: singlePost?.visibility || "Public",
    publishTime: singlePost?.publishTime ? "Schedule" : "Now",
    isPublished: Boolean(singlePost?.isPublished),
    scheduledPublishTime: singlePost.scheduledPublishTime
      ? new Date(singlePost.scheduledPublishTime)
      : null,
    externalSource: singlePost.externalSource || "",
    content: singlePost.content || "",
    category: category,
    featured: singlePost?.featured || "",
    ...(category === "Person of Interest" && {
      person: {
        firstName: "",
        lastName: "",
        aboutPerson: "",
        featured: "",
      },
    }),
  });

  useEffect(() => {
    if (singlePost && postId) {
      setImageURL(singlePost.featured);
      console.log(singlePost.featured);
    }
  }, [singlePost, postId]);

  useEffect(() => {
    console.log("Checking singlePost:", singlePost);
    listPages(setIsLoading, category);

    if (singlePost && postId) {
      // Ensures that singlePost is not null or empty
      const data = singlePost; // Directly use singlePost as it is already available
      setInitialValues({
        title: data && data?.title,
        visibility: data?.visibility || "Public",
        publishTime: data?.publishTime ? "Schedule" : "Now",
        isPublished: Boolean(data?.isPublished),
        scheduledPublishTime: data.scheduledPublishTime
          ? new Date(data.scheduledPublishTime)
          : null,
        externalSource: data.externalSource || "",
        content: data.content || "",
        category: category,
        featured: data.featured || "",
        ...(category === "Person of Interest" && {
          person: {
            firstName: "",
            lastName: "",
            aboutPerson: "",
            featured: "",
          },
        }),
      });
    } else {
      // Reset to defaults if no postId or singlePost is empty
      setInitialValues((prev) => ({
        ...prev,
        title: "",
        visibility: "Public",
        publishTime: "Now",
        isPublished: true,
        scheduledPublishTime: null,
        externalSource: "",
        content: "",
        category: category,
        featured: "",
        ...(category === "Person of Interest" && {
          person: {
            firstName: "",
            lastName: "",
            aboutPerson: "",
            featured: "",
          },
        }),
      }));
    }
  }, [postId, paramCategory]); // Include singlePost in the dependency array

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Optionally, display the image preview
    setFeaturedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImageURL(previewUrl);

    // No need to reset the file input here
  };

  const [uploadedFiles, setUploadedFiles] = useState({
    images: [],
    audios: [],
    videos: [],
    documents: [],
  });

  useEffect(() => {
    console.log(uploadedFiles);
  }, [uploadedFiles]);

  // Handling multiple file uploads
  const handleFileUpload = (event, fileType) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Store both the blob URL for preview and the file object for upload
    const newFiles = files.map((file) => ({
      url: URL.createObjectURL(file), // Used for displaying preview
      file: file, // The actual file object for upload
      name: file.name,
      fileType: file.type, // Changed from fileType to type for consistency
    }));

    const targetKey =
      fileType === "words" || fileType === "pdfs" ? "documents" : fileType;

    setUploadedFiles((prev) => ({
      ...prev,
      [targetKey]: [...(prev[targetKey] || []), ...newFiles],
    }));
  };

  const clearImage = () => {
    setFeaturedImage("");
    setImageURL(""); // Clear image preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const personValidationSchema = Yup.object().shape({
    person: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      aboutPerson: Yup.string().required("About person is required"),
    }),
  });

  // Base validation schema
  // Base validation schema
  // Validation schema
  const baseValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    visibility: Yup.string().required("Visibility is required"),
    publishTime: Yup.string().required("Publish time is required"),
    externalSource: Yup.string(),
    pendingReview: Yup.boolean(),
    content: Yup.string().required("Content is required"),
    scheduledPublishTime: null,
    isPublished: Yup.boolean(),
  });

  // Combine the schemas conditionally
  const getValidationSchema = (category) => {
    let schema = baseValidationSchema;

    if (category === "Person of Interest") {
      schema = schema.concat(
        Yup.object().shape({
          person: personValidationSchema,
        })
      );
    } else {
      return schema;
    }

    return schema;
  };

  const cleanMedia = (media) => {
    const cleanedMedia = {};
    Object.keys(media).forEach((key) => {
      if (media[key].length > 0) {
        cleanedMedia[key] = media[key];
      }
    });
    return cleanedMedia;
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"], // Link and image insertion
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      ["clean"], // remove formatting button
    ],
  };

  return (
    <div className="post">
      <h2 className="text-center mt-5 mb-2">
        {postId ? "Edit Post" : "Add New Post"}
      </h2>
      {!postId && (
        <div className="post-category bg-gray ">
          <div className="category-select d-flex align-items-center p-1">
            <label>Select category:</label>
            <select
              className=""
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Person of Interest">Person of Interest</option>
              <option value="News">News</option>
              {/* <option value="Partners">Partners</option>
              <option value="About">About</option>
              <option value="Button1">Button1Page</option>
              <option value="Button2">Button2Page</option>
              <option value="Soon">Soon Page</option>
              <option value="Shop">Shop</option> */}
            </select>
          </div>
        </div>
      )}
      <div className="container mt-5">
        <h4>{category}</h4>
      </div>
      {category === "Partners" ? (
        <CreateEditPartners />
      ) : (
        <div className="position-relative">
          <div className="container mt-5">
            <Formik
              initialValues={initialValues}
              validationSchema={getValidationSchema}
              onSubmit={(values) => {
                let submissionData = { ...values };

                let today = moment().format("DD MMMM YYYY");

                const newMediaData = cleanMedia(uploadedFiles);

                /* 
              const scheduledTimeUTC = moment
                .tz(submissionData.scheduledPublishTime, 'Europe/Berlin')
                .utc()
                .toISOString(); */

                if (submissionData.externalSource === "") {
                  delete submissionData.externalSource;
                }

                // If the category is not 'Person of Interest', delete 'media' and 'featured' from submissionData
                if (category !== "Person of Interest") {
                  delete submissionData.media;
                  delete submissionData.featured;
                  delete submissionData.person;

                  submissionData = {
                    ...submissionData,
                    category: category,
                    isPublished: isPublished,
                    scheduledPublishTime:
                      submissionData.publishTime === "Now"
                        ? new Date()
                        : submissionData.scheduledPublishTime,
                    externalSource: submissionData.externalSource,
                  };

                  console.log(submissionData);

                  createNewsAndPagePost(
                    submissionData,
                    featuredImage,
                    setIsLoading
                  );
                } else {
                  // If 'Person-of-Interest', include 'media' and 'featured' in submissionData
                  // Assuming media and featured are handled outside Formik's initialValues
                  // and you have the state uploadedFiles and imageURL to include

                  submissionData = {
                    person: { ...submissionData.person },
                    title: submissionData.title,
                    media: cleanMedia(uploadedFiles),
                    content: submissionData.content,
                    category: category,
                    publishTime: submissionData.publishTime,
                    scheduledPublishTime:
                      submissionData.publishTime === "Now"
                        ? new Date()
                        : submissionData.scheduledPublishTime,
                    externalSource: submissionData.externalSource
                      ? submissionData.externalSource
                      : null,

                    visibility: submissionData.visibility,
                    isPublished: isPublished,
                  };

                  createPersonsPost(
                    submissionData,
                    uploadedFiles,
                    featuredImage,
                    setIsLoading
                  );
                }
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="row">
                    <div className="col-md-8">
                      {/* First Column */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px",
                        }}
                      >
                        {category === "Person of Interest" && (
                          <>
                            <div className="d-flex">
                              <div className="d-flex me-2 align-items-center">
                                <label className="flex-shrink-0 me-2">
                                  First Name:
                                </label>
                                <Field
                                  className="form-control"
                                  name="person.firstName"
                                />
                              </div>
                              <div className="d-flex ms-3 align-items-center">
                                <label className="flex-shrink-0 me-2">
                                  Last Name:
                                </label>
                                <Field
                                  className="form-control"
                                  name="person.lastName"
                                />
                              </div>
                            </div>

                            <Field
                              as="textarea"
                              className="form-control"
                              style={{ padding: "20px" }}
                              name="person.aboutPerson"
                              placeholder="About person"
                            />
                          </>
                        )}

                        <Field
                          as="textarea"
                          className="form-control mb-1"
                          style={{ padding: "20px", height: "280px" }}
                          name="title"
                          placeholder="Title"
                        />
                      </div>
                      {category === "Person of Interest" && (
                        <div className="file-upload-grid">
                          {[
                            {
                              type: "Image",
                              fileType: "images",
                              Icon: AddImageIcon,
                            },
                            {
                              type: "Audio",
                              fileType: "audios",
                              Icon: AddAudioIcon,
                            },
                            {
                              type: "Video",
                              fileType: "videos",
                              Icon: AddVideoIcon,
                            },
                            {
                              type: "Word",
                              fileType: "documents",
                              Icon: AddWordIcon,
                            },
                          ].map(({ type, fileType, Icon }) => {
                            const hasFiles = uploadedFiles[fileType].length > 0;
                            const iconColor = hasFiles ? "#198754" : "#093A41"; // Example: Green if files exist, otherwise black

                            return (
                              <div className="items" key={type}>
                                <div className="items-box">
                                  <input
                                    type="file"
                                    multiple // Allow multiple file selection
                                    id={`file-upload-${fileType}`}
                                    style={{ display: "none" }}
                                    onChange={(e) =>
                                      handleFileUpload(e, fileType)
                                    }
                                    accept={
                                      fileType === "images"
                                        ? "image/*"
                                        : fileType === "audios"
                                        ? "audio/*"
                                        : fileType === "videos"
                                        ? "video/*"
                                        : fileType === "documents"
                                        ? ".pdf, .doc, .docx" // Accept both PDF and Word documents
                                        : ""
                                    }
                                  />
                                  <label
                                    htmlFor={`file-upload-${fileType}`}
                                    className="file-upload-label"
                                  >
                                    <div>
                                      <Icon color={iconColor} />
                                    </div>
                                  </label>
                                  {/*  {uploadedFiles[fileType].map((file, index) => (
                                  <p key={index} className='small'>
                                    {file.name}
                                  </p>
                                ))} */}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {category !== "Person of Interest" && (
                        <ReactQuill
                          className="react-quill"
                          theme="snow"
                          value={values.content}
                          onChange={(content) =>
                            setFieldValue("content", content)
                          }
                          modules={modules}
                        />
                      )}
                    </div>

                    <div className="col-md-4 ">
                      {["Person of Interest", "News", "Soon", "Shop"].includes(
                        category
                      ) && (
                        <div className="featured">
                          {imageURL && imageURL !== "" && (
                            <div
                              className="featured-close"
                              onClick={() => clearImage()}
                            >
                              <i class="fa-solid fa-trash"></i>
                            </div>
                          )}

                          {/* Image upload and display */}
                          {imageURL ? (
                            <img
                              src={imageURL}
                              alt="Featured"
                              style={{
                                width: "305px",
                                height: "250px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "305px",
                                height: "250px",
                                border: "2px dashed #ccc",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <span>Add Featured Image</span>
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
                            <div className="add-image-placeholder">
                              <i className="fas fa-plus"></i>{" "}
                              <span>ADD FEATURE IMAGE</span>
                            </div>
                          </label>
                        </div>
                      )}

                      <div className="border">
                        <div className="d-flex justify-content-between align-items-center px-2 border-0 border-bottom py-2 ">
                          <label className="w-50">Visibility:</label>
                          <Field
                            as="select"
                            name="visibility"
                            className="select"
                          >
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                          </Field>
                        </div>

                        {/* Other form fields */}
                        <div className="d-flex justify-content-between align-items-center px-2 py-2 border-0">
                          <label className="w-50">Publish:</label>
                          <Field
                            as="select"
                            name="publishTime"
                            className="select"
                            onChange={(e) => {
                              const { value } = e.target;
                              setFieldValue("publishTime", value);
                              if (value === "Now") {
                                // Clear the scheduledPublishTime if Now is selected
                                setFieldValue("scheduledPublishTime", null);
                              }
                            }}
                          >
                            <option value="Now">Now</option>
                            <option value="Schedule">Schedule</option>
                          </Field>
                        </div>
                        {values.publishTime === "Schedule" && (
                          <ReactDatePicker
                            selected={values.scheduledPublishTime}
                            onChange={(date) =>
                              setFieldValue("scheduledPublishTime", date)
                            }
                            showTimeSelect
                            dateFormat="Pp"
                            className="form-control mb-2 mx-2"
                            placeholderText="Select date"
                            style={{ cursor: "pointer" }}
                          />
                        )}
                        <div
                          className="border-0 border-top pb-2 px-2"
                          style={{ paddingTop: "10px" }}
                        >
                          <label>External source:</label>
                          <Field
                            className="form-control mt-2"
                            name="externalSource"
                          />
                        </div>

                        {/* Pending review checkbox */}
                        {/* <div className='form-check mb-5 mx-1 mt-2 ps-0'>
                        <Field
                          type='checkbox'
                          name='pendingReview'
                          className='form-check-input'
                          id='pendingReview'
                          style={{
                            marginLeft: '7px',
                            paddingLeft: '0px',
                            marginRight: '5px',
                          }}
                        />
                        <label
                          className='form-check-label'
                          htmlFor='pendingReview'
                        >
                          Pending Review
                        </label>
                      </div> */}

                        <div className="button-container px-2 my-3">
                          <button type="button" className="me-2">
                            Preview
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Publish
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">{loading && <Loader />}</div>
                    </div>
                    <div>
                      {category === "Person of Interest" && (
                        <ReactQuill
                          className="react-quill"
                          theme="snow"
                          value={values.content}
                          onChange={(content) =>
                            setFieldValue("content", content)
                          }
                          modules={modules}
                        />
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          {category === "Person of Interest" && (
            <MediaFileComponent
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CreateEditPost;
