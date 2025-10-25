import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import chatRoute from './routes/chatRoute.js';

const app = express();

// Parse JSON bodies
app.use(express.json());

// Simple request logger to help debug incoming API calls
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send message', (data) => {
    // send the message to ALL connected clients (including the sender)
    io.emit('receive message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


//Using routes:
app.use('/api/v1/chat', chatRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
