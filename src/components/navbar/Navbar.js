// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss'; // Import your SCSS module
import transformPath from '../../utils/transformPath';
import { useRouteContext } from '../../context/route/RouteProvider';

const Navbar = () => {
  const { state } = useRouteContext();

  const { headersData } = state;
  const { routes, buttons } = headersData;

  return (
    <div className={styles.navbar}>
      <ul className={styles['navbar-list']}>
        <li className={styles['navbar-item']}>
          <Link
            to={transformPath(routes.person)}
            className={styles['navbar-link']}
          >
            {routes.person}
          </Link>
        </li>
        <li className={styles['navbar-item']}>
          <Link
            to={transformPath(routes.soon)}
            className={styles['navbar-link']}
          >
            {routes.soon}
          </Link>
        </li>
        <li className={styles['navbar-item']}>
          <Link
            to={transformPath(routes.news)}
            className={styles['navbar-link']}
          >
            {routes.news}
          </Link>
        </li>
        <li className={styles['navbar-item']}>
          <Link
            to={transformPath(routes.about)}
            className={styles['navbar-link']}
          >
            {routes.about}
          </Link>
        </li>
        <li className={styles['navbar-item']}>
          <Link
            to={transformPath(routes.partners)}
            className={styles['navbar-link']}
          >
            {routes.partners}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
