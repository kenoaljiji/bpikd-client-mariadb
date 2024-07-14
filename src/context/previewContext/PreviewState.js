import React, { useReducer, useContext, createContext } from 'react';

import previewReducers from './previewContext';
import { useNavigate } from 'react-router-dom';
import { SET_CATEGORY } from '../types';

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

    state.isPreview && (await navigate('/admin/post/preview'));
  };

  const togglePreviewMode = (bol) => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE', payload: bol });
  };

  const previewNewsAndPagePost = async (data) => {
    dispatch({
      type: 'PAGE_POST_PREVIEW',
      payload: data,
    });

    state.isPreview && (await navigate('/admin/news-page/preview'));
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
