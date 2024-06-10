// Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss'; // Import your SCSS module
import transformPath from '../../utils/transformPath';
import { useRouteContext } from '../../context/route/RouteProvider';
import { ThemeContext } from '../../context/theme/ThemeContext';

const Navbar = () => {
  const { state } = useRouteContext();
  const { theme } = useContext(ThemeContext);

  const { headersData } = state;
  const { routes } = headersData;

  const CustomLink = ({ to, children }) => {
    const handleClick = (event) => {
      event.preventDefault(); // Prevent Link default behavior
      window.location.href = to; // Manually change the location to force reload
    };

    return (
      <Link
        to={to}
        onClick={handleClick}
        className={styles['navbar-link']}
        style={{ color: theme.headerTextColor }}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className={styles.navbar}>
      <ul className={styles['navbar-list']}>
        <li className={styles['navbar-item']}>
          <CustomLink to={'/' + transformPath(routes.person)}>
            {routes.person}
          </CustomLink>
        </li>
        <li className={styles['navbar-item']}>
          <CustomLink to={'/' + transformPath(routes.soon)}>
            {routes.soon}
          </CustomLink>
        </li>
        <li className={styles['navbar-item']}>
          <CustomLink to={'/' + transformPath(routes.news)}>
            {routes.news}
          </CustomLink>
        </li>
        <li className={styles['navbar-item']}>
          <CustomLink to={'/' + transformPath(routes.about)}>
            {routes.about}
          </CustomLink>
        </li>
        <li className={styles['navbar-item']}>
          <CustomLink to={'/' + transformPath(routes.partners)}>
            {routes.partners}
          </CustomLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
