import axios from 'axios';
import React, { useState } from 'react';
import { localhost } from '../../config/config';
import { useAlertContext } from '../../context/alert/AlertState';
import './backupPage.scss';
import Alerts from '../../components/Alerts';
import Loader from '../../components/loader/Loader';

const BackupPage = () => {
  const [loading, setLoading] = useState();
  const { setAlert } = useAlertContext();
  const handleDbDownload = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: `${localhost}/download/db-backup`,
        method: 'GET',
        responseType: 'blob', // Important for files
      });

      setAlert('Backup Created Successufully', 'success');

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: 'application/octet-stream',
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'db_backup.sql';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setAlert('Failed to create backup', 'danger');
      }
    } catch (error) {
      console.error('Download failed:', error);
      setAlert('Failed to create backup', 'danger');
    }
    setLoading(false);
  };
  const handleBackendDownload = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: `${localhost}/download/backend`,
        method: 'GET',
        responseType: 'blob',
      });

      setAlert('Backup Created Successufully', 'success');

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'project-backup.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
      setAlert('Failed to create backup', 'danger');
    }
    setLoading(false);
  };
  const handleReactDownload = () => {
    setLoading(true);

    const downloadUrl = '/download-react-build';

    axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'blob', // important for handling the binary data response
    })
      .then((response) => {
        setLoading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'react_build.zip'); // This sets the filename for the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setAlert('Backup Created Successufully', 'success');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Download failed:', error);
        setAlert('Failed to download backup', 'danger');
      });
  };

  return (
    <div className='container backup-page text-center mt-5'>
      <div className='my-4'>
        <Alerts />
      </div>
      <h2>Backup Download</h2>

      <div className='backup mt-5'>
        <div className='backup-item' onClick={handleDbDownload}>
          <i className='fa-solid fa-download fa-2x'></i>
          <span>MARIADB</span>
        </div>
        <div className='backup-item' onClick={handleBackendDownload}>
          <i className='fa-solid fa-download fa-2x'></i>
          <span>BACKEND</span>
        </div>
        <div className='backup-item' onClick={handleReactDownload}>
          <i className='fa-solid fa-download fa-2x'></i>
          <span>FRONTEND</span>
        </div>
      </div>
      <div className='mt-4'>
        {loading && (
          <div className='text-center'>
            <div className='mt-4'>
              <Loader />
            </div>
            <span class='mt-5 blink-text'>
              Creating backup
              <span class='dots'></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupPage;
