// eslint-disable-next-line
import {} from '../types';

const previewReducers = (state, action) => {
  // eslint-disable-next-line
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'TOGGLE_PREVIEW_MODE':
      return {
        ...state,
        isPreview: action.payload,
      };

    case 'LIST_AUTHORS_PREVIEW':
      return {
        ...state,
        loading: false,
        authors: action.payload || [],
      };

    case 'LIST_POSTS_PREVIEW':
      return {
        ...state,
        loading: false,
        posts: action.payload || [],
        singlePost: {},
      };

    case 'SINGLE_POST_PREVIEW':
      return {
        ...state,
        loading: false,
        singlePost: action.payload,
      };
    case 'PAGE_POST_PREVIEW':
      return {
        ...state,
        loading: false,
        singlePost: action.payload,
      };

    case 'GET_PARTNERS_DATA_PREVIEW':
      return {
        ...state,
        partners: action.payload,
        loading: false,
      };
    case 'COUNT_VISITORS':
      return {
        ...state,
        visitorsCout: action.payload,
      };
    case 'GET_VIDEOS_DATA_PREVIEW':
      return {
        ...state,
        videosData: action.payload,
      };
  }
};

export default previewReducers;
