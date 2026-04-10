import React, { useState, useEffect } from 'react';

export const useServiceWorker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            }
          });
        });
      });

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const updateServiceWorker = () => {
    if (!registration || !registration.waiting) {
      return;
    }
    
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  };

  return {
    updateAvailable,
    registration,
    updateServiceWorker
  };
};

export default useServiceWorker;
