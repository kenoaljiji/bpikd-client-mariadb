export const routeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_FOOTER_COMPANIES':
      const newState = {
        ...state,
        footerCompanies: action.payload,
        loading: false,
      };

      return newState;
    case 'GET_FOOTER_DATA':
      return {
        ...state,
        footerCompanies: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};
