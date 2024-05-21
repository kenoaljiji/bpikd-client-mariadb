import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { routeReducer } from './routeReducer';
import { useAlertContext } from '../alert/AlertState';
import axios from 'axios';
import { localhost } from '../../config/config';
import { useAuthContext } from '../auth/AuthState';
import { GET_HEADER_CONFIG } from '../types';

const RouteContext = createContext();

export const useRouteContext = () => useContext(RouteContext);

export const RouteProvider = ({ children }) => {
  const initialState = {
    headersData: {
      routes: {
        person: 'Person of Interest',
        news: 'News',
        about: 'About',
        partners: 'Partners',
        shop: 'Shop',
        soon: 'Coming',
      },
      buttons: {
        button1: 'Donate',
        button2: 'Submit',
      },
      logoImgPath: '',
    },
    textTrack: {
      isPlaying: false,
      active: false,
      text: 'SOME RANDOM TEXT',
    },
    loading: false,
  };
  const { user } = useAuthContext();
  const [state, dispatch] = useReducer(routeReducer, initialState);
  const { setAlert, alerts } = useAlertContext();

  const getTextSettings = useCallback(async () => {
    try {
      const res = await axios.get(`${localhost}/settings`);

      dispatch({
        type: 'GET_TEXT_SETTINGS_DATA',
        payload: res.data,
      });

      console.log(res);
    } catch (error) {
      setAlert(error.message, 'danger');
    }
  }, [dispatch]);

  useEffect(() => {
    getTextSettings();
  }, []);

  useEffect(() => {
    loadHeaderConfig();
  }, []);

  useEffect(() => {
    console.log(state.textTrack);
  }, [state.textTrack]);

  const changeHeaderAndRoutes = async (values, setLoading) => {
    const formData = new FormData();
    formData.append('routes', JSON.stringify(values.routes));
    formData.append('buttons', JSON.stringify(values.buttons));

    if (values.logoImgPath instanceof File) {
      console.log(values.logoImgPath);
      // It's a File object
      formData.append('logoImg', values.logoImgPath, values.logoImgPath.name);
    }

    /*  for (let [key, value] of formData.entries()) {
      console.log(key, value);
    } */

    try {
      setLoading(true);
      const res = await axios.post(
        `${localhost}/header/updateHeader`,
        formData,
        {
          headers: {
            Authorization: user.token, // Assuming 'user.token' is your auth token
          },
        }
      );

      loadHeaderConfig();
      setAlert('Header updated successfully', 'success');
    } catch (error) {
      console.error('Error updating header:', error);
      setAlert('Error updating header', 'danger');
    }
    setLoading(false);
  };

  const loadHeaderConfig = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(`${localhost}/header/getHeader`);

      dispatch({
        type: GET_HEADER_CONFIG,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to load header configuration',
      });
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  return (
    <RouteContext.Provider
      value={{
        state,
        dispatch,
        changeHeaderAndRoutes,
        loadHeaderConfig,
        getTextSettings,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};
