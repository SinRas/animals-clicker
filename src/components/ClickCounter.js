import React from 'react';
import './ClickCounter.css';

const ANIMALS = [
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'dog', name: 'Dog', emoji: '🐶' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰' }
];

const ClickCounter = ({ clicks }) => {
  return (
    <>
      <div className="animal-counts">
        {ANIMALS.map(animal => (
          <div key={animal.id} className="animal-count">
            <span className="animal-emoji">{animal.emoji + ` ${animal.name} `}</span>
            <span className="animal-count-number">{clicks[animal.id] || 0}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClickCounter;
