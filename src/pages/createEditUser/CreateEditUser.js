import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../../context/auth/AuthState';
import axios from 'axios';
import { localhost } from '../../config/config';
import Loader from '../../components/loader/Loader';
// Style is on auth.scss

const CreateEditUser = () => {
  const { id } = useParams();

  const { registerUser, updateUser, user } = useAuthContext();

  const [loading, setLoading] = useState(true);

  const isUpdate = Boolean(id);

  const fetchUser = async (id) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Make sure this token is correctly retrieved
        },
      };
      const res = await axios.get(`${localhost}/user/${id}`, config);
      const fetchedUserData = res.data;

      // Directly set initialValues here after fetching
      setInitialValues({
        ...fetchedUserData,
        password: '', // Keep password field empty
      });

      console.log('Fetched user data:', fetchedUserData);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
    setLoading(false);
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().min(
      2,
      'First name must be at least 2 characters long'
    ),
    lastName: Yup.string().min(
      3,
      'Last Name must be at least 2 characters long'
    ),
    nickName: Yup.string().min(
      3,
      'Nickname must be at least 2 characters long'
    ),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: isUpdate
      ? Yup.string()
          .min(4, 'Password must be at least 8 characters long')
          .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.') // Optional for update
      : Yup.string()
          .required('Password is required')
          .min(4, 'Password must be at least 8 characters long')
          .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    role: Yup.string()
      .required('Role is required')
      .oneOf(['owner', 'admin', 'editor'], 'Invalid role'), // Assuming you have predefined roles
    username: Yup.string()
      .required('Username is required')
      .min(4, 'Username must be at least 4 characters long'),
  });

  const [initialValues, setInitialValues] = useState({
    firstname: '',
    lastname: '',
    nickname: '',
    email: '',
    password: '', // Consider if you want this to be editable or not
    role: 'admin',
    username: '',
  });

  useEffect(() => {
    if (id) {
      fetchUser(id); // Now fetchUser itself takes care of setting initialValues
    } else {
      setLoading(false);
    }
    //eslint-disable-next-line
  }, [id]);

  const options =
    user.user.role === 'owner'
      ? [
          { value: 'owner', label: 'Owner' },
          { value: 'admin', label: 'Admin' },
          { value: 'editor', label: 'Editor' },
        ]
      : [
          { value: 'admin', label: 'Admin' },
          { value: 'editor', label: 'Editor' },
        ];

  return (
    <div className='my-5'>
      <h2 className='mb-5 text-center font-bold'>
        {isUpdate ? 'Update User' : 'Add New User'}
      </h2>
      {loading ? (
        <div className='container'>
          <Loader />
        </div>
      ) : (
        <div className='container'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize // Important to update initialValues when they are fetched
            onSubmit={async (values, { setSubmitting }) => {
              const submissionValues = { ...values };
              if (!submissionValues.password) {
                delete submissionValues.password;
              }

              try {
                if (id) {
                  await updateUser(id, submissionValues); // Wait for updateUser to complete
                } else {
                  await registerUser(submissionValues); // Wait for registerUser to complete
                }

                // Navigate or perform success actions here
                // if (success) navigate('users');
              } catch (error) {
                console.error('Form submission error:', error);
                // Handle errors (e.g., show an error message)
              }

              setSubmitting(false); // Move setSubmitting(false) here to ensure it's called after async operations complete
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className='justify-content-center'>
                  <div className='d-flex border-bottom px-0 pb-1'>
                    <h4>USER INFO</h4>
                  </div>

                  <div className='mx-auto pt-2 border-bottom'>
                    <FieldGroup label='First Name' name='firstname' />
                    <FieldGroup label='Last Name' name='lastname' />
                    <FieldGroup label='Nickname' name='nickname' />
                    <FieldGroup label='email' name='email' required={true} />
                    <FieldGroup
                      label='password'
                      name='password'
                      required={true}
                      isUpdate={isUpdate}
                    />

                    <FieldGroup
                      label='Role'
                      name='role'
                      type='select'
                      required={true}
                      disabled={
                        user.user.role !== 'admin' && user.user.role !== 'owner'
                      }
                      options={options}
                    />
                    <FieldGroup
                      label='username'
                      name='username'
                      required={true}
                    />
                  </div>
                </div>
                <div className='mt-5'>
                  <button
                    type='submit'
                    className='btn btn-success rounded-0'
                    disabled={isSubmitting}
                  >
                    {isUpdate ? 'UPDATE' : 'CREATE'}
                  </button>
                  {isSubmitting && (
                    <div className='text-center'>
                      <div className='mt-4'>
                        <Loader />
                      </div>
                      <span class='mt-5 blink-text'>
                        {id ? 'Updating...' : 'Creating...'}
                        <span class='dots'></span>
                      </span>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

const FieldGroup = ({
  label,
  name,
  type = 'text',
  options = [],
  required = false,
  isUpdate = false,
  disabled = false, // Added isUpdate with a default value of false
}) => (
  <div className='mt-3'>
    <div className='mb-3'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3 text-end'>
            <label htmlFor={name} className='form-label pt-2'>
              {label}
            </label>
          </div>
          <div className='col-md-8'>
            {type === 'select' ? (
              <Field as='select' className='form-control' id={name} name={name}>
                {options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </Field>
            ) : (
              <Field
                type={type}
                className='form-control'
                id={name}
                name={name}
                placeholder={
                  name === 'password' && isUpdate
                    ? 'Leave blank to keep current password'
                    : required
                    ? 'Required'
                    : ''
                }
              />
            )}
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

export default CreateEditUser;
