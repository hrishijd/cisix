// Import the express module
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define a route that listens for GET requests on the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
