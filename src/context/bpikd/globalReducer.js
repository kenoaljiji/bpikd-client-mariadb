// eslint-disable-next-line
import {
  LIST_AUTHORS,
  LIST_POSTS,
  LIST_POSTS_FAIL,
  LIST_SINGLE_POST,
  LIST_SINGLE_POST_FAIL,
  SET_CATEGORY,
  SET_ERROR,
  SET_SUCCESS,
} from "../types";

const globalReducers = (state, action) => {
  // eslint-disable-next-line
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case LIST_AUTHORS:
      return {
        ...state,
        loading: false,
        authors: action.payload || [],
      };

    case LIST_POSTS:
      return {
        ...state,
        loading: false,
        posts: action.payload || [],
        singlePost: {},
      };
    case LIST_POSTS_FAIL:
      return {
        ...state,
        posts: [],
        error: action.payload,
        success: null,
        loading: false,
      };
    case LIST_SINGLE_POST:
      return {
        ...state,
        error: null,
        loading: false,
        singlePost: action.payload,
      };

    case LIST_SINGLE_POST_FAIL:
      return {
        ...state,
        singlePost: [],
        error: action.payload,
        success: null,
        loading: false,
      };
    case SET_CATEGORY:
      return {
        ...state,
        category: action.payload,
        loading: false,
      };

    case "SEARCH_QUERY":
      return {
        ...state,
        searchTerm: action.payload,
        loading: false,
      };

    case "SEARCH_WORDS":
      return {
        ...state,
        loading: false,
        searchResult: action.payload,
      };
    case SET_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
        error: null,
      };
    case SET_ERROR:
      return {
        ...state,
        loading: false,
        success: null,
        error: action.payload,
      };
  }
};

export default globalReducers;
