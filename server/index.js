const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
   // origin: "http://localhost:5173", // React app port
    origin: "https://tactrix.vercel.app", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create_room', ({ roomcode, player1_id }) => {
    socket.join(roomcode);
    console.log(`Socket ${socket.id} created and joined room ${roomcode}`);
    io.to(roomcode).emit('room_created', { roomcode, player1_id });
  });

  socket.on('join_room', ({ roomcode, player2_id }) => {
    const rooms = io.sockets.adapter.rooms;
    if (rooms.has(roomcode)) {
      socket.join(roomcode);
      console.log(`Socket ${socket.id} joined room ${roomcode}`);
      io.to(roomcode).emit('player_joined', { roomcode, player2_id });
    } else {
      socket.emit('error_message', `Room ${roomcode} does not exist.`);
    }
  });

  socket.on('message', ({ roomcode, message }) => {
    console.log(`Message in room ${roomcode}:`, message);
    io.to(roomcode).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
