const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Функция для подключения к базе данных
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wishflick', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB подключена: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`Ошибка подключения к MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;