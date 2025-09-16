const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Регистрация пользователя
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Имя пользователя обязательно').not().isEmpty(),
    check('email', 'Пожалуйста, укажите корректный email').isEmail(),
    check('password', 'Пароль должен быть не менее 6 символов').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      // Проверка существования пользователя
      let userByEmail = await User.findOne({ email });
      let userByUsername = await User.findOne({ username });

      if (userByEmail) {
        return res.status(400).json({ msg: 'Пользователь с таким email уже существует' });
      }

      if (userByUsername) {
        return res.status(400).json({ msg: 'Пользователь с таким именем уже существует' });
      }

      // Создание нового пользователя
      const user = new User({
        username,
        email,
        password,
        role: role || 'user'
      });

      // Сохранение пользователя
      await user.save();

      // Создание JWT токена
      const token = user.getSignedJwtToken();

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  }
);

// @route   POST api/auth/login
// @desc    Аутентификация пользователя и получение токена
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Пожалуйста, укажите корректный email').isEmail(),
    check('password', 'Пароль обязателен').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Проверка существования пользователя
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(400).json({ msg: 'Неверные учетные данные' });
      }

      // Проверка пароля
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Неверные учетные данные' });
      }

      // Создание JWT токена
      const token = user.getSignedJwtToken();

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  }
);

// @route   GET api/auth/me
// @desc    Получение данных текущего пользователя
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;