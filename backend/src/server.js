const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(express.json()); // Parses JSON body
app.use(cors()); // Allow frontend access

// Test route
app.get('/', (req, res) => {
  res.send('JobTrackr Backend Running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
