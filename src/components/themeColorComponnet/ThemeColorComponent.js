import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/theme/ThemeContext';
import { localhost } from '../../config/config'; // Make sure this contains a complete URL, e.g., 'http://localhost:3000'
import { useAlertContext } from '../../context/alert/AlertState';
import Alerts from '../../components/Alerts';
import './themeColorComponent.scss';

const ThemeColorComponent = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { setAlert } = useAlertContext();
  const [error, setError] = useState();
  const [isDarkTheme, setIsDarkTheme] = useState(
    theme.headerColor === '#fff' ? false : true
  );

  const applyTheme = async (selectedPalette) => {
    try {
      await axios.post(`${localhost}/theme`, selectedPalette);
      setTheme(selectedPalette);
    } catch (error) {
      console.error('Failed to update theme:', error);
      setError(true);
      setAlert('Failed to update theme', 'danger');
    }
  };

  useEffect(() => {
    setError(false);
  }, []);

  useEffect(() => {
    if (theme.headerColor === '#fff') {
      setIsDarkTheme(false);
    } else {
      setIsDarkTheme(true);
    }
  }, [theme]);

  const handleThemeChange = () => {
    const newTheme = !isDarkTheme
      ? {
          headerColor: '#14252d',
          footerColor: '#14252d',
          headerTextColor: '#fff',
          footerTextColor: '#fff',
        }
      : {
          headerColor: '#fff',
          footerColor: '#ebebeb',
          headerTextColor: '#495f69',
          footerTextColor: '#555555',
        };

    setIsDarkTheme(!isDarkTheme);
    applyTheme(newTheme);
  };

  return (
    <div className='text-center mt-4'>
      {error && <Alerts />}
      <h4 className='my-2 mb-4'>Theme</h4>
      <div className='d-flex justify-content-center align-items-center'>
        <span className='me-2' style={{ fontWeight: 'bold' }}>
          Light
        </span>
        <label className='switch'>
          <input
            type='checkbox'
            checked={isDarkTheme}
            onChange={handleThemeChange}
          />
          <span className='slider'></span>
        </label>
        <span className='ms-2' style={{ fontWeight: 'bold' }}>
          Dark
        </span>
      </div>
    </div>
  );
};

export default ThemeColorComponent;
