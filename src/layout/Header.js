import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import { useLocation } from 'react-router-dom';
import './style/header.scss';
import CustomSearch from '../components/CustomSearch';
import { useRouteContext } from '../context/route/RouteProvider';
import Loader from '../components/loader/Loader';

const Header = ({ handleClick, isActive }) => {
  const { state } = useRouteContext();

  const { headersData } = state;

  const { routes, buttons, logoImgPath } = headersData;
  const { pathname } = useLocation();

  const moveLeftOnActive = {
    left: isActive ? '10px' : '-6px',
  };

  const CustomLink = ({ to, children }) => {
    const handleClick = (event) => {
      event.preventDefault(); // Prevent Link default behavior
      window.location.href = to; // Manually change the location to force reload
    };

    return (
      <Link to={to} onClick={handleClick}>
        {children}
      </Link>
    );
  };

  return (
    <header
      className='header'
      style={{
        borderBottom: pathname !== '/' && logoImgPath && '1px solid #dedede',
      }}
    >
      {logoImgPath && (
        <div className='d-flex justify-content-between'>
          <div className='col-sm d-flex'>
            <div
              className={`hamburger-menu`}
              style={moveLeftOnActive}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <span className={`bar bar-top ${isActive ? 'animate0' : ''}`} />
              <span className={`bar bar-middle ${isActive ? 'hide' : ''}`} />
              <span
                className={`bar bar-bottom ${isActive ? 'animate2' : ''}`}
              />
            </div>
            {logoImgPath && (
              <>
                <CustomLink to={'/'}>
                  <img
                    src={logoImgPath ? logoImgPath : null}
                    alt='Logo'
                    className='d-inline-block align-top mt-1 logo'
                  />
                </CustomLink>
                <Navbar />
              </>
            )}
          </div>

          {pathname !== '/' ? <CustomSearch type={'custom-search'} /> : null}

          <div className='row align-items-center justify-content-end'>
            <div className='col-sm d-flex'>
              <div className='cta-buttons d-flex'>
                <button
                  type='button'
                  className=''
                  onClick={() => (window.location.href = '/' + routes?.shop)}
                >
                  {routes?.shop}
                </button>
                <button
                  type='button'
                  className='button1'
                  onClick={() =>
                    (window.location.href = '/' + buttons?.button1)
                  }
                >
                  {/* Donat e*/}
                  {buttons?.button1}
                </button>
                <button
                  type='button'
                  className='button2 btn-last'
                  onClick={() =>
                    (window.location.href = '/' + buttons?.button2)
                  }
                >
                  {buttons?.button2}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
