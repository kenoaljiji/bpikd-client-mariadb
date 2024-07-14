import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './loginpage.scss';
import { useAuthContext } from '../../context/auth/AuthState';

import Alerts from '../../components/Alerts';
import AuthHeader from '../../layout/AuthHeader';

const LoginPage = () => {
  const { login, error, logout, clearErrors, isAuthenticated } =
    useAuthContext();

  useEffect(() => {
    if (!error) {
      logout();
    }
    if (isAuthenticated) {
      clearErrors();
    }
    //eslint-disable-next-line
  }, [error]);

  return (
    <div>
      <AuthHeader />
      <div className='login-page my-5'>
        <h2 className='mb-5 text-center font-weight-bold '>Login User</h2>
        <div className='container'>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={Yup.object({
              username: Yup.string().required('Username is required'),
              password: Yup.string().required('Password is required'),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setTimeout(() => {
                login(values);
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className='row justify-content-center'>
                  <div className='col-md-6'>
                    {error && <Alerts />}
                    <div className='mb-3'>
                      <div className='d-flex gap-3'>
                        <label htmlFor='username' className='form-label pt-2'>
                          Username
                        </label>
                        <div className='w-100'>
                          <Field
                            type='text'
                            className='form-control'
                            id='username'
                            name='username'
                          />
                          <ErrorMessage
                            name='username'
                            component='div'
                            className='text-danger pt-2'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='mb-3'>
                      <div className='d-flex gap-3'>
                        <label htmlFor='password' className='form-label pt-2'>
                          Password
                        </label>
                        <div className='w-100'>
                          <Field
                            type='password'
                            className='form-control'
                            id='password'
                            name='password'
                          />
                          <ErrorMessage
                            name='password'
                            component='div'
                            className='text-danger mt-1'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='text-center mt-5'>
                      <button
                        style={{ width: '120px' }}
                        type='submit'
                        className='btn btn-primary'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
