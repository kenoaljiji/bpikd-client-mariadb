import React, { useEffect, useState } from 'react';
import '../styles/tables.scss';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthState';
import ConfirmationModal from '../confirmationModal/ConfirmationModal';
import { localhost } from '../../config/config';
import axios from 'axios';
import { SET_ERROR, SET_SUCCESS } from '../../context/types';
import { complexString } from '../../utils/complexString';

const UsersTable = ({ loadUsers }) => {
  const { users, user, deleteUser, clearErrors, dispatch } = useAuthContext();
  const userId = user.user.id;
  const loggedInUserRole = user.user.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const deleteSelectedUsers = async () => {
    clearErrors();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token, // Use the admin's token from state
        },
        data: {
          userIds: selectedUserIds, // Pass the user IDs to delete here
        },
      };

      const res = await axios.delete(`${localhost}/delete-multiply`, config);

      dispatch({
        type: SET_SUCCESS,
        payload: res.data.message,
      });
      setSelectedUserIds([]); // Clear the selected user IDs
      loadUsers();
      // Handle successful operation (e.g., display a message, update state if necessary)
    } catch (err) {
      dispatch({
        type: SET_ERROR,
        payload: err.message,
      });
      // Handle error (e.g., display error message)
    }

    setIsModalOpen(false); // Close the modal after action
  };

  // Function to handle selecting/deselecting a user checkbox
  const handleSelectUser = (userId) => {
    const isSelected = selectedUserIds.includes(userId);
    setSelectedUserIds(
      isSelected
        ? selectedUserIds.filter((id) => id !== userId)
        : [...selectedUserIds, userId]
    );
  };

  // Call this when the delete button for a single user is clicked
  const handleDeleteClick = (user) => {
    setIsModalOpen(true);
    setModalContent({
      message: `Are you sure you want to delete ${user.firstname} ${user.lastname}`,
      onConfirm: () => {
        deleteUser(user.id, loadUsers);
      },
    });
  };

  // Call this when the bulk delete button is clicked
  const handleBulkDeleteClick = () => {
    setIsModalOpen(true);
    setModalContent({
      message: `Are you sure you want to delete these ${selectedUserIds.length} users?`,
      onConfirm: () => deleteSelectedUsers(),
    });
  };

  // Debouncing searchTerm
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay in ms

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const displayUsersBasedOnRole = (users) => {
    if (loggedInUserRole === 'owner') {
      return users; // Owners see everyone
    } else if (['admin'].includes(loggedInUserRole)) {
      return users.filter((user) => ['admin', 'editor'].includes(user.role)); // Admins and Editors see only Admins and Editors
    } else {
      return []; // For safety, if role isn't recognized, show no one (or handle as appropriate)
    }
  };

  // Filtering users based on search term and role
  const filteredUsers =
    debouncedSearchTerm.length >= 3
      ? displayUsersBasedOnRole(users).filter(
          (user) =>
            user.firstname
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            user.lastname
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            user.username
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
        )
      : displayUsersBasedOnRole(users);
  // Function to handle selecting/deselecting a user

  const navigate = useNavigate();
  // Function to handle deleting selected users

  return (
    <div className='custom-table mt-5'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <button
            className='btn btn-success'
            onClick={() => navigate('create-edit')}
          >
            <i className='fa-solid fa-plus'></i> Add User
          </button>
          <div className='search-bar'>
            <input
              type='text'
              className='form-control'
              placeholder='Search Users...'
              style={{ border: '1px solid #093A41' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className='text-white p-2' style={{ background: '#093A41' }}>
              <i className='fa-solid fa-magnifying-glass'></i>
            </span>
          </div>
        </div>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Role</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Nickname</th>
              <th>Username</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers?.length > 0 ? (
              filteredUsers?.map((user) => (
                <tr key={user.id}>
                  <td className='ps-4 text-start d-flex'>
                    <input
                      className='me-2'
                      type='checkbox'
                      onChange={() => handleSelectUser(user.id)}
                      checked={selectedUserIds.includes(user.id)}
                      disabled={user.id === userId}
                    />
                    <span>{user.role}</span>

                    <div className='action-icons'>
                      <i
                        className='fa fa-edit'
                        onClick={() =>
                          navigate(`/admin/users/create-edit/${user.id}`)
                        }
                      ></i>

                      {/* Delete Icon: Only show if the current user is not the owner and not the same as the logged-in user */}
                      {user.id !== userId && (
                        <i
                          className='fa fa-trash'
                          onClick={() => handleDeleteClick(user)}
                        ></i>
                      )}
                    </div>
                  </td>

                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.nickname}</td>
                  <td>{user.username}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' style={{ textAlign: 'center' }}>
                  Cannot find user
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className='d-flex justify-content-start'>
          {selectedUserIds?.length > 0 && (
            <button
              className='btn btn-sm btn-danger'
              onClick={handleBulkDeleteClick}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={modalContent.onConfirm}
          message={modalContent.message}
        />
      )}
    </div>
  );
};

export default UsersTable;
