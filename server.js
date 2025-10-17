import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to fetch exercises
app.get('/api/exercises', async (req, res) => {
  const { muscle, difficulty } = req.query;

  if (!muscle) {
    return res.status(400).json({ error: 'Muscle parameter is required' });
  }

  try {
    const url = new URL('https://api.api-ninjas.com/v1/exercises');
    url.searchParams.append('muscle', muscle);
    
    // Add difficulty filter if provided
    if (difficulty && difficulty !== 'all') {
      url.searchParams.append('difficulty', difficulty);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ 
      error: 'Failed to fetch exercises',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FitPlan API server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 FitPlan API server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/exercises`);
});
