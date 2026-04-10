import React from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';
import './UpdateNotification.css';

const UpdateNotification = () => {
  const { updateAvailable, updateServiceWorker } = useServiceWorker();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="update-notification">
      <div className="update-content">
        <div className="update-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="update-text">
          <h3>Update Available</h3>
          <p>A new version is ready</p>
        </div>
        <button className="update-btn" onClick={updateServiceWorker}>
          Update Now
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;
