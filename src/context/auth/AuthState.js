import React, { useReducer, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  SET_LOADING,
  SET_SUCCESS,
  SET_ERROR,
} from '../types';
import { localhost } from '../../config/config';
import { useNavigation } from '../../hooks/useNavigation';
import { useAlertContext } from '../alert/AlertState';
import { complexString } from '../../utils/complexString';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

// Local storage

const AuthState = (props) => {
  const { setAlert } = useAlertContext();

  const initialState = {
    isAuthenticated: false,
    loading: true,
    user: {},
    users: null,
    isAdmin: false,
    currentUser: {},
    error: null,
    success: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const navigate = useNavigation();

  const setLoading = (data) => {
    dispatch({
      type: SET_LOADING,
      payload: data,
    });
  };

  // Load User
  const loadUser = async (token) => {
    // Inside your loadUser function
    try {
      // Assuming the token is stored in state.user.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${localhost}/user`, config);

      console.log(res);

      dispatch({
        type: USER_LOADED,
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Login User
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      dispatch({
        type: SET_LOADING,
        payload: true,
      });

      const res = await axios.post(`${localhost}/user/login`, formData, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.data,
      });
    } catch (err) {
      console.log(err);
      console.log(err.message);
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.error,
      });
    } finally {
      navigate(`/admin/dashboard`);
    }
  };

  // Add this function inside your AuthState component

  const registerUser = async (userData) => {
    clearErrors();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.user.token}`, // Use the admin's token from state
        },
      };

      const res = await axios.post(`${localhost}/user`, userData, config);

      dispatch({
        type: SET_SUCCESS,
        payload: res.data.message,
      });

      console.log(res.data.message);
      // Handle successful registration (e.g., display a message, update state if necessary)
    } catch (err) {
      dispatch({
        type: SET_SUCCESS,
        payload: err.message,
      });
    }
    if (state.user.user.role !== 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/users');
    }
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
    clearErrors();
  };

  const deleteUser = async (userId, listUsers) => {
    clearErrors();
    try {
      // Optional: Add a token or authorization header if needed
      const token = state.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.delete(`${localhost}/user/${userId}`, config);

      dispatch({
        type: SET_SUCCESS,
        payload: res.data.message,
      });

      listUsers();

      // Navigate to dashboard or login page after successful registration
      // Optional: Redirect or load users again
    } catch (err) {
      console.error(err.message);
      dispatch({
        type: SET_ERROR,
        payload: err.message,
      });
    } finally {
    }
  };

  const updateUser = async (userId, userData) => {
    clearErrors();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.user.token}`, // Assuming you're using Bearer token authentication
        },
      };

      // Make a PUT request to your backend endpoint
      const res = await axios.put(
        `${localhost}/user/${userId}`,
        userData,
        config
      );

      // Assuming your backend sends back the updated user data

      // Optionally, you can return the updated user data for further processing
      dispatch({
        type: SET_SUCCESS,
        payload: res.data.message,
      });
      /* return response.data; */
    } catch (error) {
      console.error(
        'Error updating user:',
        error.response ? error.response.data : error.message
      );
      // Optionally, throw the error or handle it based on your error handling strategy
      throw error;
    }
    if (state.user.user.role !== 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/users');
    }
  };

  const { error, success } = state;
  useEffect(() => {
    if (error) {
      setAlert(error, 'danger');
    }
    if (success) {
      setAlert(success, 'success');
    }
  }, [error, success]);

  // Logout

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  // set token on initial app loading

  // 'watch' state.token and set headers and local storage on any change
  useEffect(() => {
    if (state.user) {
      const token = state.user.token;
      setAuthToken(token);
      /*  loadUser(token); */
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        users: state.users,
        error: state.error,
        success: state.success,
        currentUser: state.currentUser,
        deleteUser,
        loadUser,
        login,
        logout,
        clearErrors,
        registerUser,
        updateUser,
        dispatch,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
