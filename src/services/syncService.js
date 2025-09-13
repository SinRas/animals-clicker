// Service for syncing click data with Express server

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// New function to send individual animal clicks
export const sendAnimalClick = async (animalId) => {
  try {
    console.log('Sending individual click for:', animalId);
    
    const response = await fetch(`${API_BASE_URL}/animals/${animalId}/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return { success: true, data: result };
    
  } catch (error) {
    console.error('Click send error:', error);
    return { success: false, error: error.message };
  }
};

// Function to get global animal counts from server
export const getGlobalCounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/counts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return { success: true, data: result.data };
    
  } catch (error) {
    console.error('Get global counts error:', error);
    return { success: false, error: error.message };
  }
};

// Function to get click statistics
export const getClickStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/animals/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return { success: true, data: result.data };
    
  } catch (error) {
    console.error('Get stats error:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to get local click statistics
export const getLocalClickStats = (clickData) => {
  const totalClicks = Object.values(clickData).reduce((sum, count) => sum + count, 0);
  const animalCounts = Object.entries(clickData).map(([animal, count]) => ({
    animal,
    count
  })).sort((a, b) => b.count - a.count);
  
  return {
    totalClicks,
    animalCounts,
    mostClickedAnimal: animalCounts[0]?.animal || null,
    leastClickedAnimal: animalCounts[animalCounts.length - 1]?.animal || null
  };
};
