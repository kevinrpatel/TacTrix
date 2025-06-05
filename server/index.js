const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for Vercel frontend
const io = new Server(server, {
  cors: {
    origin: ["https://tac-trix.vercel.app"], // ✅ your Vercel frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Optional static files
app.use(express.static('public'));
app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create_room', ({ roomcode, player1_id }) => {
    socket.join(roomcode);
    console.log(`Room ${roomcode} created by ${player1_id}`);
    io.to(roomcode).emit('room_created', { roomcode, player1_id });
  });

  socket.on('join_room', ({ roomcode, player2_id }) => {
    const rooms = io.sockets.adapter.rooms;
    if (rooms.has(roomcode)) {
      socket.join(roomcode);
      console.log(`Player ${player2_id} joined room ${roomcode}`);
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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
