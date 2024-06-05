import React from 'react';
import axios from 'axios';
import { localhost } from '../../config/config';

const DownloadBackup = () => {
  const handleDownload = async () => {
    try {
      const response = await axios({
        url: `${localhost}/download/db-backup`, // Updated for best practice
        method: 'GET',
        responseType: 'blob', // Important for files
      });

      console.log(response);

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
        alert('Failed to download backup');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download backup');
    }
  };

  return <button onClick={handleDownload}>Download db backup</button>;
};

export default DownloadBackup;
