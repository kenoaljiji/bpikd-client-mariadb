import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { localhost } from '../../config/config';
import { useAlertContext } from '../../context/alert/AlertState';
import './backupPage.scss';
import Alerts from '../../components/Alerts';
import Loader from '../../components/loader/Loader';

const BackupPage = () => {
  const { setAlert } = useAlertContext();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBackend, setIsBackend] = useState(false);

  const apiBaseUrl = `${window.location.origin}/api`;

  const url = new URL(apiBaseUrl, window.location.origin);

  console.log(url.host);

  /* const protocol = url.protocol === 'https:' ? 'ws:' : 'ws:'; */

  const getWebSocketUrl = () => {
    const url = new URL(apiBaseUrl, window.location.origin);
    const protocol = url.protocol === 'https:' ? 'ws:' : 'ws:';
    return `${protocol}//${url.host}/api/download/ws/progress`;
  };
  const handleDbDownload = async () => {
    setIsBackend(false);
    setLoading(true);
    try {
      const response = await axios({
        url: `${localhost}/download/backup`,
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
    setIsBackend(true);
    setLoading(true);
    setProgress(0);

    const ws = new WebSocket(`wss://${url.host}/api/download/ws/progress`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.progress !== undefined) {
        console.log(progress);
        setProgress(data.progress);
      }
      if (data.message) {
        ws.close();
        downloadBackup(data.path);
      }
      if (data.error) {
        console.error('Backup error:', data.error);
        ws.close();
        setAlert('Failed to create backup', 'danger');
        setLoading(false);
      }
    };

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    const downloadBackup = async (path) => {
      try {
        const response = await axios({
          url: `${localhost}/download/backend`,
          method: 'GET',
          responseType: 'blob',
        });

        setAlert('Backup Created Successfully', 'success');

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'backend-archive.zip');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoading(false);
      } catch (error) {
        console.error('Download failed:', error);
        setAlert('Failed to download backup', 'danger');
        setLoading(false);
      }
    };
  };

  const handleReactDownload = async () => {
    setIsBackend(false);
    setLoading(true);
    const downloadUrl = localhost + '/download/react-build';

    try {
      const response = await axios({
        method: 'get',
        url: downloadUrl,
        responseType: 'blob', // important for handling the binary data response
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'build.zip'); // This sets the filename for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setAlert('Backup Created Successfully', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      setAlert('Failed to download backup', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(progress);
  }, [progress]);

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
            {isBackend && (
              <div className='mt-3'>
                <p>Progress: {progress}%</p>
                <progress value={progress} max='100'></progress>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupPage;
