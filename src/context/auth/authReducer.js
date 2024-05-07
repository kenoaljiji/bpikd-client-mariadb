import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  SET_LOADING,
  SET_USERS,
  SET_SUCCESS,
  SET_ERROR,
} from '../types';

const authReducer = (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        currentUser: action.payload,
      };

    case SET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: { ...action.payload },
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        users: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null,
        users: [],
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        success: null,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_SUCCESS:
      return {
        ...state,
        success: action.payload, // Set the success message
        error: null,
      };
    case SET_ERROR:
      return {
        ...state,
        loading: false,
        success: null, // Set the success message
        error: action.payload,
      };

    default:
      throw new Error(`Unsupported type of: ${action.type}`);
  }
};

export default authReducer;
