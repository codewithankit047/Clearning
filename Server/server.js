const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const ss = require('socket.io-stream');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

const rooms = {};

io.on('connection', (socket) => {
  const userId = uuidv4();
  socket.emit('user-connected', { userId });

  socket.on('sender-create-room', () => {
    const roomId = uuidv4();
    rooms[roomId] = { sender: userId, receiver: null, progress: 0 };
    socket.emit('room-created', { roomId });
  });

  socket.on('receiver-join-room', (data) => {
    const roomId = data.roomId;
    if (rooms[roomId] && rooms[roomId].sender !== userId && rooms[roomId].receiver === null) {
      rooms[roomId].receiver = userId;
      socket.join(roomId);
      socket.to(roomId).emit('receiver-joined');
    } else {
      socket.emit('invalid-room');
    }
  });

  ss(socket).on('file-upload', (stream, data) => {
    const roomId = data.receiverId;

    if (rooms[roomId] && rooms[roomId].sender === userId) {
      const uploadStream = ss.createStream();
      stream.pipe(uploadStream);

      // Emit progress updates to the sender and receiver
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        rooms[roomId].progress = progress;
        io.to(roomId).emit('file-upload-progress', { progress });

        if (progress >= 100) {
          clearInterval(interval);
          io.to(roomId).emit('file-upload-complete');
        }
      }, 200);
    }
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      if (rooms[roomId].sender === userId || rooms[roomId].receiver === userId) {
        delete rooms[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
