// Service for syncing click data with server
// This is designed to be easily adaptable for Next.js backend integration

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const syncWithServer = async (clickData) => {
  try {
    // For now, simulate API call since no backend exists yet
    // When you add Next.js backend, replace this with actual API call
    
    console.log('Syncing data with server:', clickData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate API call - replace with actual fetch when backend is ready
    /*
    const response = await fetch(`${API_BASE_URL}/sync-clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clicks: clickData,
        timestamp: new Date().toISOString(),
        userId: 'anonymous' // You can implement user authentication later
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return { success: true, data: result };
    */
    
    // For now, just simulate success
    return { success: true, data: { message: 'Data synced successfully' } };
    
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to get click statistics
export const getClickStats = (clickData) => {
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
