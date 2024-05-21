import React, { useRef, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouteContext } from '../../context/route/RouteProvider';
import Alerts from '../../components/Alerts';
import './headerItems.scss';
import axios from 'axios';
import { localhost } from '../../config/config';
import Loader from '../../components/loader/Loader';
import { useAlertContext } from '../../context/alert/AlertState';

const HeaderItems = () => {
  const { state, changeHeaderAndRoutes, getTextSettings } = useRouteContext();
  const { headersData, textTrack: initialTextTrack } = state;

  const { routes, buttons, logoImgPath } = headersData;

  const [error, setError] = useState(false);

  const [logoImage, setLogoImage] = useState('');
  const [imageURL, setImageURL] = useState(logoImgPath ? logoImgPath : '');
  const fileInputRef = useRef(null);

  const [textTrack, setTextTrack] = useState(initialTextTrack);

  const [loading, setLoading] = useState(false);

  const handleTextChange = (event) => {
    setTextTrack({ ...textTrack, text: event.target.value });
  };

  const togglePlaying = () => {
    setTextTrack({ ...textTrack, isPlaying: !textTrack.isPlaying });
  };

  const toggleActive = (event) => {
    setTextTrack({ ...textTrack, active: event.target.checked });
  };

  const { setAlert } = useAlertContext();

  const updateTextData = async (data) => {
    try {
      setLoading(true);
      let response;

      response = await axios.post(`${localhost}/settings`, data);

      setAlert('Updated Text Successfully', 'success');
      console.log(response);
      getTextSettings();
    } catch (error) {
      console.error('Error sending data to the server:', error);
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error('Server responded with an error:', error.response.data);
      }
      throw error; // Rethrow to handle it in the calling function or component
    }
    setLoading(false);
  };

  useEffect(() => {
    if (logoImgPath) setImageURL(logoImgPath);
  }, [logoImgPath]);

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
    setLogoImage('');
    setImageURL(''); // Clear image preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
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
    let routes = {};
    let buttons = {};

    // Separate values into routes and buttons based on the key prefix or specific keys
    Object.keys(values).forEach((key) => {
      if (
        ['person', 'news', 'about', 'partners', 'shop', 'soon'].includes(key)
      ) {
        // If the key is one of the routes, add it to the routes object
        routes[key] = values[key];
      } else if (['button1', 'button2'].includes(key)) {
        // If the key is one of the buttons, add it to the buttons object
        buttons[key] = values[key];
      }
    });

    const data = {
      routes,
      buttons,
      logoImgPath: logoImage,
    };

    changeHeaderAndRoutes(data, setLoading);

    setSubmitting(false);

    setError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTextData(textTrack);
      console.log('Data updated/created successfully:', response);
    } catch (error) {
      console.error('Failed to update/create data:', error);
    }
  };

  return (
    <div className='my-5 container header-items'>
      <div className='text-center'>{error && <Alerts />}</div>
      <h2 className='mb-5 pt-3 text-center font-bold'>Header Items</h2>
      <div className=''>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className='justify-content-center'>
                <div className='d-flex justify-content-between border-bottom px-0 pb-1'>
                  <h4>Header Categories</h4>
                  <button
                    style={{ position: 'relative', top: '-10px' }}
                    type='submit'
                    className='btn btn-primary'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </button>
                </div>
                <div className='d-flex justify-content-center'>
                  <div className='w-100 pt-2'>
                    {Object.entries(routes).map(([key, label]) => (
                      <FieldGroup label={label} name={key} key={key} />
                    ))}
                  </div>
                  <div className='featured mt-4'>
                    {imageURL ? (
                      <img
                        src={imageURL}
                        alt='Featured'
                        style={{
                          width: '220px',
                          height: '100px',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '250px',
                          height: '100px',
                          border: '2px dashed #ccc',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <span>CHANGE LOGO</span>
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
                      <div className='add-image-placeholder text-center'>
                        <i className='fas fa-plus'></i> <span>CHANGE LOGO</span>
                      </div>
                    </label>
                    {loading && (
                      <div className='text-center'>
                        <div className='mt-4'>
                          <Loader />
                        </div>
                        <span class='mt-5 blink-text'>
                          Please Wait
                          <span class='dots'></span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className='d-flex justify-content-between border-bottom px-0 pb-1 mt-3'>
                  <h4>Header Buttons</h4>
                </div>
                <div className='mx-auto pt-2'>
                  {Object.keys(buttons).map((key) => (
                    <FieldGroup label={key} name={key} key={key} />
                  ))}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className='d-flex justify-content-between border-bottom px-0 pb-1 mt-4'>
        <h4>Text Header</h4>
      </div>
      <div className='container mt-3'>
        <div className='form-check mt-2'>
          <input
            type='checkbox'
            className='form-check-input'
            checked={textTrack.active}
            onChange={toggleActive}
            id='activeCheck'
          />
          <label className='form-check-label' htmlFor='activeCheck'>
            Active
          </label>
        </div>
        <div className='form-group my-3'>
          <textarea
            type='text'
            className='form-control'
            value={textTrack.text}
            onChange={handleTextChange}
            placeholder='Edit text here...'
          />
        </div>
        <div className='d-flex justify-content-between'>
          <div className='form-group mt-2'>
            <button className='btn btn-primary' onClick={togglePlaying}>
              {textTrack.isPlaying ? 'Stop Animation' : 'Start Animation'}
            </button>
          </div>
          <div className='form-group mt-2'>
            <button className='btn btn-success' onClick={handleSubmit}>
              Submit Text
            </button>
          </div>
        </div>
        {loading && <Loader />}
        <div className='mt-3'>
          <Alerts />
        </div>
      </div>
    </div>
  );
};

const FieldGroup = ({ label, name }) => (
  <div className='mt-3'>
    <div className='mb-3'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3 text-end'>
            {/* Ensure label displays full value */}
            <label htmlFor={name} className='form-label pt-2'>
              {label}
              {/* Transform dashes to spaces if needed */}
            </label>
          </div>
          <div className='col-md-8'>
            {/* Field uses the name, should handle spaces correctly */}
            <Field type='text' className='form-control' id={name} name={name} />
            <ErrorMessage
              name={name}
              component='div'
              className='text-danger pt-2'
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeaderItems;
