import React, { useReducer, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { useAuthContext } from '../auth/AuthState';
import globalReducer from './globalReducer';
import { localhost } from '../../config/config';
import { NavigationType, useNavigate } from 'react-router-dom';
import {
  GET_PARTNERS_DATA,
  LIST_AUTHORS,
  LIST_POSTS,
  LIST_POSTS_FAIL,
  LIST_SINGLE_POST,
  LIST_SINGLE_POST_FAIL,
  SET_CATEGORY,
  GET_VIDEOS_DATA,
  PROGRESS_UPLOAD,
} from '../types';
import { useAlertContext } from '../alert/AlertState';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

// Provider Component

// Helper functions for local storage

export const GlobalState = ({ children }) => {
  // Initial State

  const authorsLocalStorage = localStorage.getItem('authors');

  const initialState = {
    loading: false,
    posts: [],
    singlePost: {},
    authors: authorsLocalStorage ? JSON.parse(authorsLocalStorage) : [{}],
    success: null,
    error: null,
    searchTerm: '',
    searchResult: '',
    category: 'Person of Interest',
    partners: [],
    progress: 0,
    videosData: {
      index: 0,
      videos: [],
    },
  };
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const navigate = useNavigate();

  const { user } = useAuthContext();

  const { setAlert } = useAlertContext();

  const changeThemeColor = () => {};

  const listPosts = async (setLoading) => {
    setLoading(true); // Control loading state globally or locally
    try {
      const response = await axios.get(`${localhost}/post/news`);
      if (response.data && response.data.length > 0) {
        dispatch({ type: LIST_POSTS, payload: response.data });
      } else {
        dispatch({ type: LIST_POSTS, payload: [] }); // Ensure empty data is handled gracefully
        setAlert('No posts available', 'info'); // Optionally set an alert if no data
      }
    } catch (error) {
      dispatch({ type: LIST_POSTS_FAIL, payload: error.message });
      setAlert(error.message, 'danger'); // Display any errors as alerts
    } finally {
      setLoading(false);
    }
  };

  const listPages = async (setLoading, term) => {
    const category = term.toLowerCase();
    setLoading(true); // Control loading state globally or locally
    try {
      const res = await axios.get(`${localhost}/post/page/${category}`);

      dispatch({
        type: LIST_SINGLE_POST,
        payload: res.data,
      });
    } catch (error) {
      setAlert(error.message, 'error'); // Display any errors as alerts
    } finally {
      setLoading(false);
    }
  };

  const getVideosData = async (data) => {
    console.log(data);
    dispatch({
      type: GET_VIDEOS_DATA,
      payload: data,
    });
  };

  const listAuthors = async (setLoading) => {
    setLoading(true);
    try {
      const response = await axios.get(`${localhost}/post/persons/basic`);
      const authorsData = Array.isArray(response.data) ? response.data : [];

      dispatch({ type: LIST_AUTHORS, payload: authorsData });
      if (authorsData.length === 0) {
        setAlert('No authors found', 'danger');
      }
    } catch (error) {
      console.error('Failed to fetch authors:', 'danger');
      dispatch({ type: LIST_AUTHORS, payload: [] }); // Ensure payload is always an array
      setAlert('Error fetching authors. ' + error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const listPersonsData = async () => {
    try {
      const response = await axios.get(`${localhost}/post/persons/basic`);
      const authorsData = Array.isArray(response.data) ? response.data : [];

      dispatch({ type: LIST_AUTHORS, payload: authorsData });
      if (authorsData.length === 0) {
        setAlert('No authors found', 'danger');
      }

      console.log(response);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      dispatch({ type: LIST_AUTHORS, payload: [] }); // Ensure payload is always an array
      setAlert('Error fetching authors. ' + error.message, 'danger');
    } finally {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let deviceInfo = null;

        if (navigator.userAgentData) {
          // Get high-entropy values
          const ua = await navigator.userAgentData.getHighEntropyValues([
            'architecture',
            'model',
            'platform',
            'platformVersion',
            'fullVersionList',
          ]);
          deviceInfo = ua['model'] ? ua['model'] : null;
        } else {
          console.error(
            'navigator.userAgentData is not supported in this browser.'
          );
        }

        // Send device information to the backend
        const res = await axios.post(`${localhost}/visitors`, {
          params: deviceInfo,
        });
      } catch (error) {
        setAlert(error.message, 'danger');
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchData();
  }, []);

  const getPostById = async (
    id,
    slugRoute = 'news',
    setIsLoading,
    title = ''
  ) => {
    try {
      setIsLoading && setIsLoading(true);
      const res = await axios.get(`${localhost}/post/${slugRoute}/${id}`);

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
    setIsLoading && setIsLoading(false);
    if (title !== '') {
      // Navigate to the news detail page with the shortened title
      navigate(`/news/${title}`);
    }
  };

  const createPersonsPost = async (
    data,
    uploadedFiles,
    featuredImage,
    setIsLoading,
    abortController // Pass this controller from the component
  ) => {
    const formData = new FormData();

    // Append uploaded files and featured image to formData
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      files.forEach(({ file }) => {
        formData.append(key, file, file.name);
      });
    });

    if (featuredImage !== '') {
      formData.append('featuredImage', featuredImage, featuredImage.name);
    }

    formData.append('data', JSON.stringify(data));

    const { title } = data;
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${localhost}/post/persons/${title}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Assume `user.token` is available
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch({ type: PROGRESS_UPLOAD, payload: percentCompleted });
          },
          signal: abortController.signal, // Use AbortController signal
        }
      );

      setAlert('Post created successfully', 'success');

      navigate('/admin/posts');
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Upload canceled');
      } else {
        console.log(error);
        setAlert(error.message, 'danger');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPartnersData = async (setLoading) => {
    setLoading(true); // Control loading state globally or locally
    try {
      const res = await axios.get(`${localhost}/post/partners`);

      console.log(res.data);

      dispatch({
        type: GET_PARTNERS_DATA,
        payload: res.data.results,
      });
    } catch (error) {
      setAlert(error.message, 'error'); // Display any errors as alerts
    } finally {
      setLoading(false);
    }
  };

  const createNewsAndPagePost = async (
    data,
    featuredImage,
    setIsLoading,
    abortController
  ) => {
    const category = data.category?.toLowerCase();
    const formData = new FormData();

    if (featuredImage !== '') {
      formData.append('featuredImage', featuredImage, featuredImage.name);
    }

    formData.append('data', JSON.stringify(data));

    // Append files to formData

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${localhost}/post/${category}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Assume `user.token` is available
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch({ type: PROGRESS_UPLOAD, payload: percentCompleted });
          },
          signal: abortController.signal,
        }
      );

      setAlert('Post created', 'success');
    } catch (error) {
      console.log(error);
      setAlert(error.message, 'danger');
    }

    setIsLoading(false);
    navigate('/admin/posts');
  };

  const editPost = async (id, data) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.data.token,
        },
        credentials: 'include',
      };
      const res = await axios.put(
        `${localhost}/admin/posts/${id}`,
        data,
        config
      );

      dispatch({
        type: 'SUCCESS_MESSAGE',
        payload: res.status === 200 && 'Wort hinzugefügt',
      });
    } catch (error) {
      dispatch({
        type: 'EDIT_POST_FAIL',
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
    navigate.push('/dashboard');
  };

  const deletePost = async (id) => {
    try {
      setSmallLoading();
      const config = {
        headers: {
          Authorization: user.data.token,
        },
      };

      const res = await axios.delete(`${localhost}/admin/posts/${id}`, config);
      console.log(res);

      dispatch({
        type: 'DELETE_POST',
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: 'DELETE_POST_FAIL',
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  const searchPosts = async (searchTerm, limit = 50) => {
    try {
      dispatch({
        type: 'SET_SMALL_LOADING',
      });
      const url = `${localhost}/search?limit=${limit}&word=${searchTerm}`;
      const res = await axios.get(url);

      dispatch({
        type: 'SEARCH_WORDS',
        payload: res.data.data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const setCategory = (category) => {
    dispatch({ type: SET_CATEGORY, payload: category });
  };
  const resetProgressUpload = () => {
    dispatch({ type: PROGRESS_UPLOAD, payload: 0 });
  };

  const setSmallLoading = () => dispatch({ type: 'SET_SMALL_LOADING' });

  return (
    <GlobalContext.Provider
      value={{
        searchPosts,
        createPersonsPost,
        getPostById,
        deletePost,
        editPost,
        listAuthors,
        createNewsAndPagePost,
        listPosts,
        setCategory,
        listPersonsData,
        listPages,
        getPartnersData,
        dispatch,
        getVideosData,
        resetProgressUpload,
        partners: state.partners,
        progress: state.progress,
        videosData: state.videosData,
        authors: state.authors,
        error: state.error,
        category: state.category,
        loading: state.loading,
        searchTerm: state.searchTerm,
        searchResult: state.searchResult,
        posts: state.posts,
        singlePost: state.singlePost,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
