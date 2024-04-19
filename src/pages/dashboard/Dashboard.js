import React, { useEffect } from 'react';
import UsersIcon from '../../icons/UsersIcon';
import PostsIcon from '../../icons/PostsIcon';
import FooterIcon from '../../icons/FooterIcon';
import HeaderIcon from '../../icons/HeaderIcon';
import SortPersonIcon from '../../icons/SortPersonIcon';
import './dashboard.scss';
import { useAuthContext } from '../../context/auth/AuthState';

import { Link } from 'react-router-dom';
import ProfileIcon from '../../icons/ProfileIcon';
import Alerts from '../../components/Alerts';

const Dashboard = () => {
  const { user, error, success } = useAuthContext();

  return (
    <div className='container my-5 text-center dashboard'>
      {success && <Alerts />}
      {error && <Alerts />}
      <h2 className='pt-3'>Dashboard</h2>
      <div className='grid mt-5'>
        {user.user.role !== 'admin' ? (
          <Link to={'/admin/users/create-edit/' + user.user._id}>
            <ProfileIcon />
          </Link>
        ) : (
          <Link to='/admin/users'>
            <UsersIcon />
          </Link>
        )}

        <Link to='/admin/posts'>
          <PostsIcon />
        </Link>
        <Link to='/admin/header-items'>
          <HeaderIcon />
        </Link>
        <Link to='/admin/footer-items'>
          <FooterIcon />
        </Link>
      </div>
      <div>
        <Link to='/admin/sort-person'>
          <SortPersonIcon />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
