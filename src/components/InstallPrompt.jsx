import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const { isInstallable, installApp } = usePWAInstall();

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="install-prompt">
      <div className="install-content">
        <div className="install-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div className="install-text">
          <h3>Install App</h3>
          <p>Add to home screen for offline access</p>
        </div>
        <button className="install-btn" onClick={installApp}>
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
