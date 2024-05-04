import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import AddImageIcon from '../../icons/AddImageIcon';
import AddAudioIcon from '../../icons/AddAudioIcon';
import AddVideoIcon from '../../icons/AddVideoIcon';
import AddWordIcon from '../../icons/AddWordIcon';
import './personEditPost.scss';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MediaFileComponent from '../../components/mediaFileComponent/MediaFileComponent';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // for snow theme
import Loader from '../../components/loader/Loader';
import moment from 'moment';
import CreateEditPartners from '../createEditPartners/CreateEditPartners';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { localhost } from '../../config/config';
import { LIST_SINGLE_POST, LIST_SINGLE_POST_FAIL } from '../../context/types';
import { useAuthContext } from '../../context/auth/AuthState';
import Alerts from '../../components/Alerts';
import { useAlertContext } from '../../context/alert/AlertState';

const PersonEditPage = () => {
  const {
    createPersonsPost,
    createNewsAndPagePost,
    category,
    setCategory,
    singlePost,
    getPostById,
    dispatch,
  } = useGlobalContext();

  const [imageURL, setImageURL] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');

  const [media, setMedia] = useState([]);
  const [works, setWorks] = useState([singlePost?.works]);

  const [singleWork, setSingleWork] = useState();
  const [selectedWorkId, setSelectedWorkId] = useState('');

  const { setAlert } = useAlertContext();

  const fileInputRef = useRef(null);

  const { id: postId } = useParams();

  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  const getPersonById = async (id) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${localhost}/post/persons/${id}`);

      console.log(res);

      dispatch({
        type: LIST_SINGLE_POST,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: LIST_SINGLE_POST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (singlePost) {
      setWorks(singlePost?.works);

      console.log(works);
    }
  }, [singlePost, selectedWorkId]);

  const updatePersonById = async (id, data) => {
    const formData = new FormData();

    /* console.log(featuredImage); */

    if (featuredImage instanceof Blob) {
      formData.append('featuredImage', featuredImage, featuredImage.name);
    }

    formData.append('data', JSON.stringify(data));

    try {
      setIsLoading(true);

      const res = await axios.put(`${localhost}/post/persons/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res);
      setAlert('Person Updated', 'success');
      /* 
      console.log(res);

      console.log(res.data); */
    } catch (error) {
      setAlert(error.message, 'danger');
      dispatch({
        type: LIST_SINGLE_POST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (postId) {
      getPersonById(postId, 'persons', setIsLoading);
    }
  }, [postId]);

  const [initialValues, setInitialValues] = useState({
    firstName: singlePost.firstName || '',
    lastName: singlePost.lastName || '',
    aboutPerson: singlePost.aboutPerson || '',
    featured: singlePost.featured || '',
  });

  const [initialValuesWork, setInitialValuesWork] = useState({
    title: singleWork?.title || '',
    content: singleWork?.content || '',
    person_id: singleWork?.person_id || '',
    publishTime: singleWork?.publishTime || 'Now', // Adjust logic for handling "Now" if necessary
    isPublished: singleWork?.isPublished || true,
    scheduledPublishTime:
      singleWork?.publishTime === 'Now'
        ? null
        : new Date(singleWork?.scheduledPublishTime),
    externalSource: singleWork?.externalSource || '',
  });

  useEffect(() => {
    if (singlePost && postId) {
      console.log(singlePost);
      setImageURL(singlePost.featured);
    }
  }, [singlePost, postId]);

  useEffect(() => {
    console.log('Checking singlePost:', singlePost);

    if (singlePost) {
      // Ensures that singlePost is not null or empty

      setInitialValues({
        firstName: singlePost.firstName,
        lastName: singlePost.lastName,
        aboutPerson: singlePost.aboutPerson,
        featured: singlePost.featured,
      });
    }
  }, [postId, singlePost]); // Include singlePost in the dependency array

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
      isNew: true,
      fileType: file.type, // Changed from fileType to type for consistency
    }));

    const targetKey =
      fileType === 'words' || fileType === 'pdfs' ? 'documents' : fileType;

    setUploadedFiles((prev) => ({
      ...prev,
      [targetKey]: [...(prev[targetKey] || []), ...newFiles],
    }));
  };

  const clearImage = () => {
    setFeaturedImage('');
    setImageURL(''); // Clear image preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const personValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    aboutPerson: Yup.string().required('About person is required'),
  });

  // Base validation schema
  // Base validation schema
  // Validation schema

  const worksSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    externalSource: Yup.string(),
    publishTime: Yup.string(),
    content: Yup.string().required('Content is required'),
    scheduledPublishTime: Yup.date(),
    isPublished: Yup.boolean(),
    category: Yup.string(),
  });

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
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'], // Link and image insertion
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      ['clean'], // remove formatting button
    ],
  };

  const fetchWorkDetails = async (workId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${localhost}/post/persons/work/${workId}`
      );

      setSingleWork(response.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      console.error('Error fetching work details:', err);
    }
  };

  useEffect(() => {
    if (selectedWorkId !== '') {
      fetchWorkDetails(selectedWorkId);
    }
    console.log(singleWork);
  }, [selectedWorkId]);

  useEffect(() => {
    setInitialValuesWork({
      title: singleWork?.title || '',
      content: singleWork?.content || '',
      person_id: singleWork?.person_id,
      publishTime: singleWork?.publishTime || 'Now', // Adjust logic for handling "Now" if necessary
      isPublished: singleWork?.isPublished,
      scheduledPublishTime:
        singleWork?.scheduledPublishTime &&
        new Date(singleWork.scheduledPublishTime),
      externalSource: singleWork?.externalSource,
    });
    if (singleWork) {
      setUploadedFiles(singleWork.media);
    }
  }, [singleWork]);

  const handleDelete = async (workId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${localhost}/post/persons/work/${workId}`
      );

      getPersonById(postId);
      setSelectedWorkId('');
      alert(response.data.message);
    } catch (error) {
      console.error('Error deleting work:', error);
      alert(
        'Failed to delete work: ' +
          (error.response ? error.response.data.error : error.message)
      );
    }
    setIsLoading(false);
  };

  const uploadFiles = async () => {
    const formData = new FormData();

    Object.keys(uploadedFiles).forEach((type) => {
      // Map the type to the expected form field name
      const fieldName =
        type === 'images'
          ? 'images'
          : type === 'videos'
          ? 'videos'
          : type === 'audios'
          ? 'audios'
          : 'documents'; // Adjust based on actual keys if different

      uploadedFiles[type].forEach((file, index) => {
        if (file.isNew) {
          // Make sure your file objects have this property when they're new
          formData.append(fieldName, file.file, file.name); // Append the file object, not the URL
          formData.append(`${fieldName}[${index}][index]`, index); // Ensure the index is sent
          formData.append(`${fieldName}[${index}][type]`, type); // Sending the type might be redundant but can be useful
        }
      });
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${localhost}/post/persons/work/${singleWork.id}/media`,
        formData
      );

      setAlert('Update successful:', 'success');
    } catch (error) {
      setAlert('Error updating', 'danger');
    }
    setIsLoading(false);
  };

  return (
    <div className='post'>
      <h2 className='text-center mt-5 mb-2'>
        {postId ? 'Edit Post' : 'Add New Post'}
      </h2>
      {!postId && (
        <div className='post-category bg-gray '>
          <div className='category-select d-flex align-items-center p-1'>
            <label>Select category:</label>
            <select
              className=''
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value='Person of Interest'>Person of Interest</option>
              <option value='News'>News</option>
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
      <div className='container mt-5'>
        <h4>{category}</h4>
      </div>

      <div className='position-relative'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className='container mt-5'>
              <Formik
                initialValues={initialValues}
                validationSchema={personValidationSchema}
                enableReinitialize={true}
                onSubmit={(values) => {
                  /*     console.log(values); */
                  updatePersonById(postId, values);
                }}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className='row'>
                      <div className='col-md-8'>
                        {/* First Column */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                          }}
                        >
                          <>
                            <div className='d-flex'>
                              <div className='d-flex me-2 align-items-center'>
                                <label className='flex-shrink-0 me-2'>
                                  First Name:
                                </label>
                                <Field
                                  className='form-control'
                                  name='firstName'
                                />
                              </div>
                              <div className='d-flex ms-3 align-items-center'>
                                <label className='flex-shrink-0 me-2'>
                                  Last Name:
                                </label>
                                <Field
                                  className='form-control'
                                  name='lastName'
                                />
                              </div>
                            </div>

                            <Field
                              as='textarea'
                              className='form-control'
                              style={{ padding: '20px', minHeight: '270px' }}
                              name='aboutPerson'
                              placeholder='About person'
                            />
                          </>
                        </div>
                      </div>
                      <div className='col-md-4 '>
                        <div className='featured'>
                          {imageURL && imageURL !== '' && (
                            <div
                              className='featured-close'
                              onClick={() => clearImage()}
                            >
                              <i class='fa-solid fa-trash'></i>
                            </div>
                          )}

                          {/* Image upload and display */}
                          {imageURL ? (
                            <img
                              src={imageURL}
                              alt='Featured'
                              style={{
                                width: '305px',
                                height: '250px',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '305px',
                                height: '250px',
                                border: '2px dashed #ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <span>Add Featured Image</span>
                            </div>
                          )}
                          <input
                            type='file'
                            id='featured-image-upload'
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept='image/*' // Accept images only
                          />
                          <label
                            htmlFor='featured-image-upload'
                            className='featured-image-container bg-success text-white p-1 w-100 mt-1 cursor-pointer'
                          >
                            <div className='add-image-placeholder'>
                              <i className='fas fa-plus'></i>{' '}
                              <span>ADD FEATURE IMAGE</span>
                            </div>
                          </label>
                          <div className='button-container my-1'>
                            <button
                              type='submit'
                              className='btn btn-primary d-block'
                            >
                              UPDATE PERSON
                            </button>
                            <div className='mt-3'>{loading && <Loader />}</div>
                            <Alerts />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className='work-media container'>
              <div className='work-title-select'>
                <select
                  value={selectedWorkId}
                  onChange={(event) => setSelectedWorkId(event.target.value)}
                  className='form-control px-2'
                >
                  <option value=''>Select a Title</option>
                  {works?.map((work) => (
                    <>
                      <option key={work?.workId} value={work?.workId}>
                        {work?.title}
                      </option>
                    </>
                  ))}
                </select>
                {selectedWorkId && (
                  <button
                    className='btn btn-danger me-2 p-1 border-0'
                    onClick={() => handleDelete(selectedWorkId)}
                  >
                    Delete
                  </button>
                )}
              </div>
              {selectedWorkId && (
                <Formik
                  initialValues={initialValuesWork}
                  enableReinitialize={true}
                  onSubmit={async (values) => {
                    let submissionData = { ...values };

                    submissionData = {
                      title: submissionData.title,
                      content: submissionData.content,
                      category: category,
                      publishTime: submissionData.publishTime,
                      scheduledPublishTime:
                        submissionData.publishTime === 'Now'
                          ? now // Use formatted current time if "Now"
                          : moment(submissionData.scheduledPublishTime).format(
                              'YYYY-MM-DD HH:mm:ss'
                            ), // Format existing date
                      externalSource: submissionData.externalSource
                        ? submissionData.externalSource
                        : null,

                      isPublished: isPublished,
                    };

                    const res = await axios.put(
                      `${localhost}/post/persons/work/${singleWork.id}`,
                      submissionData
                    );
                    uploadFiles();
                  }}
                >
                  {({ setFieldValue, values }) => (
                    <Form>
                      <div className='row'>
                        <div className='col-md-8'>
                          <Field
                            as='textarea'
                            className='form-control mb-1'
                            style={{ padding: '20px', height: '280px' }}
                            name='title'
                            placeholder='Title'
                          />
                          <div className='file-upload-grid'>
                            {[
                              {
                                type: 'Image',
                                fileType: 'images',
                                Icon: AddImageIcon,
                              },
                              {
                                type: 'Audio',
                                fileType: 'audios',
                                Icon: AddAudioIcon,
                              },
                              {
                                type: 'Video',
                                fileType: 'videos',
                                Icon: AddVideoIcon,
                              },
                              {
                                type: 'Word',
                                fileType: 'documents',
                                Icon: AddWordIcon,
                              },
                            ].map(({ type, fileType, Icon }) => {
                              const hasFiles =
                                uploadedFiles[fileType].length > 0;
                              const iconColor = hasFiles
                                ? '#198754'
                                : '#093A41'; // Example: Green if files exist, otherwise black

                              return (
                                <div className='items' key={type}>
                                  <div className='items-box'>
                                    <input
                                      type='file'
                                      multiple // Allow multiple file selection
                                      id={`file-upload-${fileType}`}
                                      style={{ display: 'none' }}
                                      onChange={(e) =>
                                        handleFileUpload(e, fileType)
                                      }
                                      accept={
                                        fileType === 'images'
                                          ? 'image/*'
                                          : fileType === 'audios'
                                          ? 'audio/*'
                                          : fileType === 'videos'
                                          ? 'video/*'
                                          : fileType === 'documents'
                                          ? '.pdf, .doc, .docx' // Accept both PDF and Word documents
                                          : ''
                                      }
                                    />
                                    <label
                                      htmlFor={`file-upload-${fileType}`}
                                      className='file-upload-label'
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
                        </div>
                        <div className='col-md-4'>
                          <div className='border mt-4'>
                            {/* Other form fields */}
                            <div className='d-flex justify-content-between align-items-center px-2 py-2 border-0'>
                              <label className='w-50'>Publish:</label>
                              <Field
                                as='select'
                                name='publishTime'
                                className='select'
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setFieldValue('publishTime', value);
                                  if (value === 'Now') {
                                    // Clear the scheduledPublishTime if Now is selected
                                    setFieldValue('scheduledPublishTime', null);
                                  }
                                }}
                              >
                                <option value='Now'>Now</option>
                                <option value='Scheduled'>Scheduled</option>
                              </Field>
                            </div>
                            {values.publishTime === 'Scheduled' && (
                              <ReactDatePicker
                                selected={values.scheduledPublishTime}
                                onChange={(date) =>
                                  setFieldValue('scheduledPublishTime', date)
                                }
                                showTimeSelect
                                dateFormat='Pp'
                                className='form-control mb-2 mx-2'
                                placeholderText='Select date'
                                style={{ cursor: 'pointer' }}
                              />
                            )}
                            <div
                              className='border-0 border-top pb-2 px-2'
                              style={{ paddingTop: '10px' }}
                            >
                              <label>External source:</label>
                              <Field
                                className='form-control mt-2'
                                name='externalSource'
                              />
                            </div>

                            <div className='button-container px-2 my-3'>
                              <button
                                type='button'
                                className='me-2 w-100 d-block'
                              >
                                PREVIEW
                              </button>
                              <button
                                type='submit'
                                className='btn btn-primary d-block'
                              >
                                UPDATE TITLE
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <ReactQuill
                          className='react-quill'
                          theme='snow'
                          value={values.content}
                          onChange={(content) =>
                            setFieldValue('content', content)
                          }
                          modules={modules}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
            {selectedWorkId && (
              <MediaFileComponent
                uploadedFiles={uploadedFiles}
                getPersonById={() => getPersonById(postId)}
                fetchWorkDetails={() => fetchWorkDetails(selectedWorkId)}
                setUploadedFiles={setUploadedFiles}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonEditPage;
