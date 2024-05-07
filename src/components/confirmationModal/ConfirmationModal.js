import React from 'react';
import './confirmationModal.scss';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  // Construct the message as a React component

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modalData' onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>{' '}
        <button
          className='btn btn-primary me-2'
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Yes, Delete
        </button>
        <button className='btn btn-danger' onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
