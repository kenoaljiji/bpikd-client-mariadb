import React from 'react';
import UsersIcon from '../../icons/UsersIcon';
import PostsIcon from '../../icons/PostsIcon';
import FooterIcon from '../../icons/FooterIcon';
import HeaderIcon from '../../icons/HeaderIcon';
import SortPersonIcon from '../../icons/SortPersonIcon';
import IPtrackIcon from '../../icons/IPtrackIcon';
import './dashboard.scss';
import { useAuthContext } from '../../context/auth/AuthState';
import { Link } from 'react-router-dom';
import ProfileIcon from '../../icons/ProfileIcon';
import Alerts from '../../components/Alerts';
import ThemeColorComponent from '../../components/themeColorComponnet/ThemeColorComponent';
import MaintenanceComponent from '../../components/maintenanceComponent.js/MaintenanceComponent';
import BackupIcon from '../../icons/BackupIcon';

const Dashboard = () => {
  const { user, error, success } = useAuthContext();

  return (
    <div className='container my-5 text-center dashboard'>
      {success && <Alerts />}
      {error && <Alerts />}
      <h2 className='py-3'>Dashboard</h2>
      <ThemeColorComponent />
      <div className='grid mt-5'>
        {user.user.role === 'admin' || user.user.role === 'owner' ? (
          <Link to='/admin/users'>
            <UsersIcon />
          </Link>
        ) : (
          <Link to={'/admin/users/create-edit/' + user.user.id}>
            <ProfileIcon />
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
      <div className='d-flex justify-content-center' style={{ gap: '55px' }}>
        <Link to='/admin/sort-person'>
          <SortPersonIcon />
        </Link>

        <Link to='/admin/ip-visitors'>
          <IPtrackIcon />
        </Link>
        <Link to='/admin/backup'>
          <BackupIcon />
        </Link>
      </div>
      <MaintenanceComponent />
    </div>
  );
};

export default Dashboard;
