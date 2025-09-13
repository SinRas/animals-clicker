import React from 'react';
import './ClickCounter.css';

const ClickCounter = ({ clickCount, animal }) => {
  return (
          <div key={animal.id} className="animal-count">
            <span className="animal-emoji">{animal.emoji + ` ${animal.name} `}</span>
            <span className="animal-count-number">{clickCount}</span>
          </div>
        )};
export default ClickCounter;
