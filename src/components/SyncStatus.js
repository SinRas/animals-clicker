import React from 'react';
import './SyncStatus.css';

const SyncStatus = ({ status, lastSync, onManualSync }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'syncing':
        return '🔄';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '💾';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return 'Synced';
      case 'error':
        return 'Sync Failed';
      default:
        return 'Ready';
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  return (
    <div className="sync-status">
      <div className="sync-info">
        <span className="sync-icon">{getStatusIcon()}</span>
        <span className="sync-text">{getStatusText()}</span>
      </div>
      <div className="last-sync">
        Last sync: {formatLastSync(lastSync)}
      </div>
      <button 
        className="manual-sync-button" 
        onClick={onManualSync}
        disabled={status === 'syncing'}
      >
        Sync Now
      </button>
    </div>
  );
};

export default SyncStatus;
