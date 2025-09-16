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
  const [totalClicks, setTotalClicks] = useState(0);
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState("idle"); // 'idle', 'syncing', 'success', 'error'

  // Calculate total clicks whenever clicks change
  useEffect(() => {
    const total = Object.values(clicks).reduce((sum, count) => sum + count, 0);
    setTotalClicks(total);
  }, [clicks]);

  // Set up automatic sync every 13 seconds
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      await handleSync();
    }, 13000); // 13 seconds

    // Initial sync after 1 second
    const initialSync = setTimeout(() => {
      handleSync();
    }, 1000);

    return () => {
      clearInterval(syncInterval);
      clearTimeout(initialSync);
    };
  }, [clicks]);

  const handleAnimalClick = (animalId) => {
    setClicks((prevClicks) => ({
      ...prevClicks,
      [animalId]: (prevClicks[animalId] || 0) + 1,
    }));
  };

  const handleSync = async () => {
    setSyncStatus("syncing");
    try {
      const result = await syncWithServer(clicks);
      if (result.success) {
        setLastSync(new Date());
        setSyncStatus("success");
      } else {
        setSyncStatus("error");
      }
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");
    }
  };

  const resetClicks = () => {
    setClicks({});
    setTotalClicks(0);
  };

  return (
    <main>
      <section className="global-stats">
        {ANIMALS.map((animal) => (
          <ClickCounter
            key={animal.id}
            clickCount={clicks[animal.id]}
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
