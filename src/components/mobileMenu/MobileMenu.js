import React, { useEffect } from 'react';
import './mobileMenu.scss';
import { Link } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
import { useRouteContext } from '../../context/route/RouteProvider';
import transformPath from '../../utils/transformPath';
const MobileMenu = ({ isActive, setIsActive }) => {
  const { state } = useRouteContext();

  const { headersData } = state;
  const { routes, buttons } = headersData;
  const { pathname } = useLocation();

  useEffect(() => {
    setIsActive(false);
  }, [pathname]);

  return (
    <div
      className={`overlay ${isActive ? 'show' : ''}`}
      onClick={(e) => {
        setIsActive(false);
      }}
    >
      <div
        className={`fullscreenmenu ${isActive ? 'show' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`hamburger-menu active-close `}
          onClick={(e) => {
            e.stopPropagation();
            setIsActive(false);
          }}
        >
          <span className={`bar bar-top`} />
          <span className={`bar bar-bottom`} />
        </div>

        <ul>
          <li style={{ textAlign: 'left' }}>
            <Link to={transformPath(routes.person)}>{routes.person}</Link>
          </li>
          <li>
            <Link to={transformPath(routes.soon)}>{routes.soon}</Link>
          </li>
          <li>
            <Link to={transformPath(routes.news)}>{routes.news}</Link>
          </li>
          <li>
            <Link to={transformPath(routes.about)}>{routes.about}</Link>
          </li>
          <li>
            <Link to={transformPath(routes.partners)}>{routes.partners}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
