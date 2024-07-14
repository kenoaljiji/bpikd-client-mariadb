import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { localhost } from '../../config/config';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [maintenance, setMaintenance] = useState(false);

  const [theme, setTheme] = useState({
    headerColor: '#fff',
    footerColor: '#ebebeb',
    headerTextColor: '#495f69',
    footerTextColor: '#555555',
  });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await axios.get(`${localhost}/theme`);
        setTheme(response.data);
      } catch (error) {
        console.error('Failed to fetch theme:', error);
      }
    };
    fetchTheme();

    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(`${localhost}/theme/maintenance`);
        setMaintenance(response.data.maintenance);
      } catch (error) {
        console.error('Failed to fetch maintenance mode:', error);
      }
    };
    fetchMaintenance();
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, maintenance, setTheme, setMaintenance }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
