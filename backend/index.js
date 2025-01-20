// Import the required libraries
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Set up Socket.IO on the server
const io = socketIo(server);

// Define a simple route for the home page
app.get('/', (req, res) => {
  res.send('<h1>Hello, Socket.IO Server!</h1>');
});

// Handle client connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for a 'message' event from clients
  socket.on('update-pos', (data) => {
    console.log('Received message:', data);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server and listen on a port
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
