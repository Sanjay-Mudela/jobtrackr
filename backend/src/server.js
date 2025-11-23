const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config(); // Load .env variables

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow frontend to call backend

// Test route
app.get('/', (req, res) => {
  res.send('JobTrackr Backend Running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
