import React, { useState, useEffect } from "react";
import "./App.css";
import AnimalIcon from "./components/AnimalIcon";
import ClickCounter from "./components/ClickCounter";
import SyncStatus from "./components/SyncStatus";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { syncWithServer } from "./services/syncService";

const ANIMALS = [
  { id: "cat", name: "Cat", emoji: "🐱" },
  { id: "dog", name: "Dog", emoji: "🐶" },
  { id: "rabbit", name: "Rabbit", emoji: "🐰" },
];

function App() {
  const [clicks, setClicks] = useLocalStorage("animalClicks", {});
  const [totalClicks, setTotalClicks] = useState({});
  
  // Set up automatic sync every 13 seconds
  useEffect(() => {
    const counter = setInterval(async () => {
      await updateTotalClicksAsync();
    }, 13000);

    updateTotalClicksAsync()
    return () => clearInterval(counter);
     }, []);

  const handleAnimalClick = async (animalId) => {
    setClicks((prevClicks) => ({
      ...prevClicks,
      [animalId]: (prevClicks[animalId] || 0) + 1,
    }));

    const response = await fetch("/click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [animalId]: 1 }) });
    setTotalClicks(await response.json());
  };

  const updateTotalClicksAsync = async () => {
    const response = await fetch("/click", { method: "GET" });
    setTotalClicks(await response.json())
  };

  return (
    <main>
      <section className="global-stats">
        {ANIMALS.map((animal) => (
          <ClickCounter
            clickCount={totalClicks[animal.id] || 0}
            animal={animal}
          />
        ))}
      </section>
      <section className="app-content">
        <h1>Animals Clicker</h1>
        <p>Click on the animals below to count your clicks!</p>
      </section>
      <section className="local-stats">
          {ANIMALS.map((animal) => (
            <AnimalIcon
              animal={animal}
              clickCount={clicks[animal.id] || 0}
              onClick={() => handleAnimalClick(animal.id)}
            />
          ))}
      </section>
    </main>
  );
}

export default App;
