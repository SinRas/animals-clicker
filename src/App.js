import React, { useState, useEffect } from 'react';
import './App.css';
import AnimalIcon from './components/AnimalIcon';
import ClickCounter from './components/ClickCounter';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sendAnimalClick } from './services/syncService';

const ANIMALS = [
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'dog', name: 'Dog', emoji: '🐶' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰' }
];

function App() {
  const [clicks, setClicks] = useLocalStorage('animalClicks', {});
  const [totalClicks, setTotalClicks] = useState(0);

  // Calculate total clicks whenever clicks change
  useEffect(() => {
    const total = Object.values(clicks).reduce((sum, count) => sum + count, 0);
    setTotalClicks(total);
  }, [clicks]);

  const handleAnimalClick = async (animalId) => {
    // Update local state immediately for responsive UI
    setClicks(prevClicks => ({
      ...prevClicks,
      [animalId]: (prevClicks[animalId] || 0) + 1
    }));

    // Send click to server
    try {
      await sendAnimalClick(animalId);
    } catch (error) {
      console.error('Failed to send click to server:', error);
      // Optionally show user feedback for failed server communication
    }
  };

  const resetClicks = () => {
    setClicks({});
    setTotalClicks(0);
  };

  return (
    <div className="app">
      <div className="click-counter">
        <div className="animal-counts">
          {ANIMALS.map(animal => (
            <ClickCounter 
            key={animal.id}
            clickCount={clicks[animal.id] || 0} 
            animal={animal} />
          ))}
        </div>
      </div>
      
      <header className="app-header">
        <h1>Animals Clicker</h1>
        <p>Click on the animals below to count your clicks!</p>
      </header>

      <main className="app-main">
        <div className="animals-grid">
          {ANIMALS.map(animal => (
            <AnimalIcon
              key={animal.id}
              animal={animal}
              clickCount={clicks[animal.id] || 0}
              onClick={() => handleAnimalClick(animal.id)}
            />
          ))}
        </div>
        
      </main>
    </div>
  );
}

export default App;
