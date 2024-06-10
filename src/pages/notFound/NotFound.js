import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.scss';

const NotFound = () => {
  return (
    <div
      style={{ textAlign: 'center', marginTop: '50px' }}
      className='not-found'
    >
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The page you are looking for does not exist or another error occurred.
      </p>
      <Link to='/'>Go back to the homepage</Link>
    </div>
  );
};

export default NotFound;
