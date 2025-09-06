import React from 'react';
import './AnimalIcon.css';

const AnimalIcon = ({ animal, clickCount, onClick }) => {
  return (
    <div className="animal-icon" onClick={onClick}>
      <div className="animal-emoji">{animal.emoji}</div>
      <div className="animal-name">{animal.name}</div>
      <div className="click-count">{clickCount} clicks</div>
    </div>
  );
};

export default AnimalIcon;
