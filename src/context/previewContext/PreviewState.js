import React, { useReducer, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { useAuthContext } from '../auth/AuthState';
import { localhost } from '../../config/config';
import previewReducers from './previewContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { SET_CATEGORY } from '../types';
import { useAlertContext } from '../alert/AlertState';

const PreviewContext = createContext();

export const usePreviewContext = () => useContext(PreviewContext);

// Provider Component

export const PreviewState = ({ children }) => {
  // Initial State

  const initialState = {
    loading: false,
    posts: [],
    singlePost: {},
    authors: [{}],
    category: 'Preview',
    isPreview: false,
  };
  const [state, dispatch] = useReducer(previewReducers, initialState);

  const navigate = useNavigate();
  const getVideosData = async (data) => {};

  const listAuthors = async (setLoading) => {};

  const listPersonsData = async () => {};

  const previewSinglePost = async (data) => {
    dispatch({
      type: 'SINGLE_POST_PREVIEW',
      payload: data,
    });

    await navigate('/admin/post/preview');
  };

  const togglePreviewMode = (bol) => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE', payload: bol });
  };

  const previewNewsAndPagePost = async (data) => {
    dispatch({
      type: 'PAGE_POST_PREVIEW',
      payload: data,
    });

    await navigate('/admin/news-page/preview');
  };

  const setCategory = (category) => {
    dispatch({ type: SET_CATEGORY, payload: category });
  };

  return (
    <PreviewContext.Provider
      value={{
        previewSinglePost,
        listAuthors,
        previewNewsAndPagePost,
        setCategory,
        listPersonsData,
        dispatch,
        getVideosData,
        togglePreviewMode,
        authors: state.authors,
        loading: state.loading,
        posts: state.posts,
        singlePost: state.singlePost,
        isPreview: state.isPreview,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};
