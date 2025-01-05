// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');  // Import CORS

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Enable CORS for requests coming from http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',  // Allow only the React app to make requests
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

let clients = [];

io.on('connection', (socket) => {
  clients.push(socket.id);
  console.log('New client connected:', socket.id);

  // Broadcasting to all clients except the sender
  socket.on('signal', (data) => {
    io.to(data.target).emit('signal', {
      source: socket.id,
      signal: data.signal,
    });
  });

  socket.on('disconnect', () => {
    clients = clients.filter((client) => client !== socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Signaling server running on http://localhost:5000');
});
