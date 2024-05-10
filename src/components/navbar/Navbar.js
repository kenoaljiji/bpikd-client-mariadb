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

  const CustomLink = ({ to, children }) => {
    const handleClick = (event) => {
      event.preventDefault(); // Prevent Link default behavior
      window.location.href = to; // Manually change the location to force reload
    };

    return (
      <Link to={to} onClick={handleClick} className={styles['navbar-link']}>
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

/*  <div className={styles.navbar}>
   <ul className={styles['navbar-list']}>
     <li className={styles['navbar-item']}>
       <Link
         to={transformPath(routes.person)}
         className={styles['navbar-link']}
       >
         {routes.person}
       </Link>
       <CustomLink to={transformPath(routes.person)}>
         {routes.person}
       </CustomLink>
     </li>
     <li className={styles['navbar-item']}>
       <Link to={transformPath(routes.soon)} className={styles['navbar-link']}>
         {routes.soon}
       </Link>
     </li>
     <li className={styles['navbar-item']}>
       <Link to={transformPath(routes.news)} className={styles['navbar-link']}>
         {routes.news}
       </Link>
     </li>
     <li className={styles['navbar-item']}>
       <Link to={transformPath(routes.about)} className={styles['navbar-link']}>
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
 </div>; */
