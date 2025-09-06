import React from 'react';
import './ClickCounter.css';

const ClickCounter = ({ totalClicks }) => {
  return (
    <div className="click-counter">
      <div className="counter-label">Total Clicks</div>
      <div className="counter-value">{totalClicks.toLocaleString()}</div>
    </div>
  );
};

export default ClickCounter;
