import React from 'react';
import './ClickCounter.css';

const ClickCounter = ({ clickCount, animal }) => {
  return (
    <>
      <div className="animal-counts">
        {ANIMALS.map(animal => (
          <div key={animal.id} className="animal-count">
            <span className="animal-emoji">{animal.emoji + ` ${animal.name} `}</span>
            <span className="animal-count-number">{clickCount}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClickCounter;
