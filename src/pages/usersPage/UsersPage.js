import React, { useEffect, useState } from 'react';
import UsersTable from '../../components/usersTable/UsersTable';
import { useAuthContext } from '../../context/auth/AuthState';
import Alerts from '../../components/Alerts';
import Loader from '../../components/loader/Loader';
import { localhost } from '../../config/config';
import axios from 'axios';
import { SET_USERS } from '../../context/types';

const UsersPage = () => {
  const { success, error, user, dispatch } = useAuthContext();

  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Assuming you store the admin token in state.user.token
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${localhost}/user/list`, config);

      dispatch({
        type: SET_USERS,
        payload: res.data.data, // Assuming the list of users is in res.data.data
      });
    } catch (err) {
      console.error(err);
      // Optionally handle errors, e.g., dispatch an error action
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className='users-page text-center'>
      <div className='container mt-5'>
        {success && <Alerts />}
        <h2 className='my-5'>Users</h2>
      </div>
      {loading ? (
        <div className='container'>
          <Loader />
        </div>
      ) : (
        <UsersTable loadUsers={loadUsers} />
      )}
    </div>
  );
};

export default UsersPage;
