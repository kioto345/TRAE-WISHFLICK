const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Подключение к MongoDB
const connectDB = require('./config/db');
connectDB();

// Определение маршрутов API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/wishlists', require('./routes/wishlists'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/blogger', require('./routes/blogger'));
app.use('/api/admin', require('./routes/admin'));

// Обработка Socket.io соединений
io.on('connection', (socket) => {
  console.log('Новое соединение Socket.io:', socket.id);

  socket.on('disconnect', () => {
    console.log('Соединение Socket.io закрыто:', socket.id);
  });

  // Обработка событий в реальном времени
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Пользователь ${socket.id} присоединился к комнате ${roomId}`);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`Пользователь ${socket.id} покинул комнату ${roomId}`);
  });

  socket.on('new_donation', (data) => {
    io.to(data.userId).emit('donation_received', data);
  });
});

// Обслуживание статических файлов в production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так на сервере!' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));