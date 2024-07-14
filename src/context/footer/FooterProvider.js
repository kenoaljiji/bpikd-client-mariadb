import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { routeReducer } from './footerReducer';
import { useAlertContext } from '../alert/AlertState';
import { useAuthContext } from '../auth/AuthState';
import axios from 'axios';
import { localhost } from '../../config/config';
import { LIST_POSTS_FAIL } from '../types';

const FooterContext = createContext();

export const useFooterContext = () => useContext(FooterContext);

/* const footerConfig = JSON.parse(localStorage.getItem('footerConfig')); */

export const FooterProvaider = ({ children }) => {
  const initialState = {
    footerCompanies: [],
    loading: false,
  };
  const [state, dispatch] = useReducer(routeReducer, initialState);

  const { user } = useAuthContext();

  const { setAlert } = useAlertContext();

  useEffect(() => {
    getFooterData();
    //eslint-disable-next-line
  }, []);

  const changeFooter = async (footerCompanies, setLoading) => {
    console.log('Submitting the following company data:', footerCompanies);
    const formData = new FormData();

    // Append the stringified version of companies data
    formData.append('companies', JSON.stringify(footerCompanies));

    // Append files only if they are present and are a Blob (or File, which inherits Blob)
    footerCompanies.forEach((company, index) => {
      if (company.file && company.file instanceof Blob) {
        formData.append(
          `companyImage-${index}`,
          company.file,
          company.file.name
        );
      }
    });

    // Debug: Log all formData entries
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}: ${value instanceof Blob ? `File; size=${value.size}` : value}`
      );
    }

    try {
      setLoading(true);
      const response = await axios.post(`${localhost}/footer`, formData, {
        headers: {
          Authorization: user.token, // Assuming 'user.token' is your auth token
        },
      });
      console.log('Server response:', response.data);
      setAlert('Footer updated successfully', 'success');
      getFooterData(); // Refresh footer data from the server
    } catch (error) {
      setAlert(
        error.response.data.message
          ? error.response.data.message
          : 'Error updating footer',
        'danger'
      );
    }
    setLoading(false);
  };

  const getFooterData = async () => {
    try {
      const res = await axios.get(`${localhost}/footer`);

      dispatch({
        type: 'GET_FOOTER_DATA',
        payload: res.data.footerCompanies,
      });
    } catch (error) {
      dispatch({
        type: LIST_POSTS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  return (
    <FooterContext.Provider
      value={{
        footerCompanies: state.footerCompanies,
        loading: state.loading,
        dispatch,
        getFooterData,
        changeFooter,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
};
