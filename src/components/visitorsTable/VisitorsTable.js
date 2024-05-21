import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { localhost } from '../../config/config';
import Loader from '../loader/Loader';
import './visitorsTable.scss';
import { useAlertContext } from '../../context/alert/AlertState';
import Alerts from '../Alerts';
import ConfirmationModal from '../confirmationModal/ConfirmationModal';

function VisitorsTable() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const { setAlert } = useAlertContext();

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${localhost}/visitors/all`); // Adjust this URL to your API endpoint
      setVisitors(res.data);
    } catch (error) {
      console.error('Error fetching visitor data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const deleteVisitor = async (visitorId) => {
    try {
      await axios.delete(`${localhost}/visitors/${visitorId}`);
      const newVisitors = visitors.filter(
        (visitor) => visitor.id !== visitorId
      );
      setVisitors(newVisitors);
      setAlert(`Visitor with ID ${visitorId} has been deleted.`, 'success');
    } catch (error) {
      console.error('Error deleting visitor data:', error);
      setAlert('Failed to delete visitor.', 'danger');
    }
  };

  // Call this when the delete button for a single user is clicked
  const handleDeleteClick = (id) => {
    setIsModalOpen(true);
    setModalContent({
      message: `Are you sure you want to delete visitor`,
      onConfirm: () => {
        deleteVisitor(id);
      },
    });
  };

  function formatDate(dateString) {
    if (dateString) {
      const date = new Date(dateString);
      return date.toISOString().replace('T', ' ').slice(0, 19);
    }
  }

  return (
    <div className='container my-5 visitors'>
      <div className='my-2'>
        <Alerts />
      </div>
      <div className='text-center'>
        <h2>Visitor Log</h2>
      </div>
      <table className='table table-striped'>
        <thead>
          <tr>
            {/*   <th>ID</th> */}
            <th>IP Address</th>
            <th>Browser</th>
            <th>Os</th>
            <th>Device</th>
            <th>Visit Count</th>
            <th>Last Visit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className='pt-2'>
              <td>
                <Loader />
              </td>
            </tr>
          ) : (
            visitors?.map((visitor) => (
              <tr key={visitor.id}>
                {/*  <td>{visitor.id}</td> */}
                <td>{visitor.ip_address}</td>
                <td>{visitor.browser_name}</td>
                <td>{visitor.os}</td>
                {visitor.is_desktop !== 0 && (
                  <td>
                    <span>Desktop: {visitor.device}</span>
                  </td>
                )}
                {visitor.is_mobile !== 0 && (
                  <td>
                    <span>Mobile: {visitor.device}</span>
                  </td>
                )}
                {visitor.is_tablet !== 0 && (
                  <td>
                    <span>Tablet: {visitor.device}</span>
                  </td>
                )}

                {/*  {visitor.is_tablet && <td>Tablet: {visitor.device}</td>}
                {visitor.is_desktop && <td>Desktop: {visitor.device}</td>} */}

                <td>{visitor.count}</td>
                <td>{visitor && formatDate(visitor?.last_visit)}</td>
                <td>
                  <div className='action-icons'>
                    <i
                      className='fa fa-trash'
                      onClick={() => handleDeleteClick(visitor.id)}
                    ></i>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className='mt-4'>
        <div classNmae=''>
          {loading && (
            <div>
              <Loader />
            </div>
          )}
        </div>
        <Alerts />
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
}

export default VisitorsTable;
