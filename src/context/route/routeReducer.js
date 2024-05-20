import { GET_HEADER_CONFIG } from '../types';

export const routeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case GET_HEADER_CONFIG:
      return {
        ...state,
        headersData: { ...action.payload },
        loading: false,
      };
    case 'UPDATE_ROUTE_PATHS':
      const newState = {
        ...state,
        /* routes: { ...state.routes, ...action.payload.routes },
        buttons: { ...state.buttons, ...action.payload.buttons }, */
        headersData: action.payload,
        loading: false,
      };

      return newState;

    case 'GET_TEXT_SETTINGS_DATA':
      return {
        ...state,
        textTrack: action.payload,
        loading: false,
      };
    case 'GET_THEME_DATA':
      return {
        ...state,
        themeColor: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
