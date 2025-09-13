const express = require('express');
const cors = require('cors');
const redis = require('redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Redis client setup
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Animal types (matching frontend)
const ANIMAL_IDS = ['cat', 'dog', 'rabbit'];

// Helper function to get Redis key for animal count
const getAnimalKey = (animalId) => `animals-clicker:${animalId}:count`;

// Helper function to get Redis key for total clicks
const getTotalKey = () => 'animals-clicker:total:clicks';

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get global animal counts
app.get('/api/animals/counts', async (req, res) => {
  try {
    const counts = {};
    let totalClicks = 0;

    // Get counts for each animal
    for (const animalId of ANIMAL_IDS) {
      const count = await redisClient.get(getAnimalKey(animalId));
      counts[animalId] = parseInt(count) || 0;
      totalClicks += counts[animalId];
    }

    res.json({
      success: true,
      data: {
        animalCounts: counts,
        totalClicks,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching animal counts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch animal counts'
    });
  }
});

// Handle individual animal click
app.post('/api/animals/:animalId/click', async (req, res) => {
  try {
    const { animalId } = req.params;
    
    // Validate animal ID
    if (!ANIMAL_IDS.includes(animalId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid animal ID. Must be one of: ${ANIMAL_IDS.join(', ')}`
      });
    }

    // Increment the count for this animal
    const newCount = await redisClient.incr(getAnimalKey(animalId));
    
    // Also increment total clicks
    await redisClient.incr(getTotalKey());

    res.json({
      success: true,
      data: {
        animalId,
        count: newCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error handling animal click:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process animal click'
    });
  }
});

// Sync multiple clicks at once (for batch operations)
app.post('/api/animals/sync', async (req, res) => {
  try {
    const { clicks } = req.body;
    
    if (!clicks || typeof clicks !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid clicks data. Expected an object with animal counts.'
      });
    }

    const results = {};
    let totalIncrements = 0;

    // Process each animal's clicks
    for (const [animalId, clickCount] of Object.entries(clicks)) {
      if (ANIMAL_IDS.includes(animalId) && typeof clickCount === 'number' && clickCount > 0) {
        const newCount = await redisClient.incrBy(getAnimalKey(animalId), clickCount);
        results[animalId] = newCount;
        totalIncrements += clickCount;
      }
    }

    // Update total clicks
    if (totalIncrements > 0) {
      await redisClient.incrBy(getTotalKey(), totalIncrements);
    }

    res.json({
      success: true,
      data: {
        updatedCounts: results,
        totalIncrements,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error syncing clicks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync clicks'
    });
  }
});

// Get click statistics
app.get('/api/animals/stats', async (req, res) => {
  try {
    const counts = {};
    let totalClicks = 0;

    // Get counts for each animal
    for (const animalId of ANIMAL_IDS) {
      const count = await redisClient.get(getAnimalKey(animalId));
      counts[animalId] = parseInt(count) || 0;
      totalClicks += counts[animalId];
    }

    // Calculate statistics
    const animalCounts = Object.entries(counts).map(([animal, count]) => ({
      animal,
      count
    })).sort((a, b) => b.count - a.count);

    const stats = {
      totalClicks,
      animalCounts,
      mostClickedAnimal: animalCounts[0]?.animal || null,
      leastClickedAnimal: animalCounts[animalCounts.length - 1]?.animal || null,
      averageClicksPerAnimal: totalClicks / ANIMAL_IDS.length,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching click statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch click statistics'
    });
  }
});

// Reset all counts (admin endpoint)
app.post('/api/animals/reset', async (req, res) => {
  try {
    // Reset all animal counts
    for (const animal of ANIMAL_IDS) {
      await redisClient.del(getAnimalKey(animal));
    }
    
    // Reset total clicks
    await redisClient.del(getTotalKey());

    res.json({
      success: true,
      data: {
        message: 'All animal counts have been reset',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error resetting counts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset counts'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await redisClient.quit();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Animals Clicker Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base: http://localhost:${PORT}/api`);
});
