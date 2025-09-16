const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// @route   GET api/wishlists
// @desc    Получение всех публичных вишлистов
// @access  Public
router.get('/', async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ isPublic: true })
      .populate('user', ['username', 'avatar'])
      .sort({ createdAt: -1 });
    res.json(wishlists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/wishlists/user/:userId
// @desc    Получение всех публичных вишлистов пользователя
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const wishlists = await Wishlist.find({
      user: req.params.userId,
      isPublic: true
    })
      .populate('user', ['username', 'avatar'])
      .sort({ createdAt: -1 });
    res.json(wishlists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/wishlists/my
// @desc    Получение всех вишлистов текущего пользователя
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(wishlists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/wishlists/:id
// @desc    Получение вишлиста по ID
// @access  Public/Private (зависит от публичности вишлиста)
router.get('/:id', async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate('user', ['username', 'avatar', 'bio', 'socialLinks']);

    if (!wishlist) {
      return res.status(404).json({ msg: 'Вишлист не найден' });
    }

    // Проверка доступа к приватному вишлисту
    if (!wishlist.isPublic) {
      const token = req.header('x-auth-token');
      
      if (!token) {
        return res.status(401).json({ msg: 'Нет доступа к приватному вишлисту' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (wishlist.user._id.toString() !== decoded.id) {
          return res.status(401).json({ msg: 'Нет доступа к приватному вишлисту' });
        }
      } catch (err) {
        return res.status(401).json({ msg: 'Токен недействителен' });
      }
    }

    res.json(wishlist);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Вишлист не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/wishlists
// @desc    Создание нового вишлиста
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Название вишлиста обязательно').not().isEmpty(),
      check('title', 'Название не может быть длиннее 100 символов').isLength({ max: 100 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, isPublic, category, tags } = req.body;

      // Создание нового вишлиста
      const newWishlist = new Wishlist({
        user: req.user.id,
        title,
        description,
        isPublic: isPublic !== undefined ? isPublic : true,
        category,
        tags
      });

      const wishlist = await newWishlist.save();
      res.json(wishlist);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  }
);

// @route   PUT api/wishlists/:id
// @desc    Обновление вишлиста
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Название не может быть длиннее 100 символов').isLength({ max: 100 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let wishlist = await Wishlist.findById(req.params.id);

      if (!wishlist) {
        return res.status(404).json({ msg: 'Вишлист не найден' });
      }

      // Проверка владельца
      if (wishlist.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Нет прав на редактирование' });
      }

      const { title, description, isPublic, category, tags } = req.body;

      // Обновление полей
      if (title) wishlist.title = title;
      if (description !== undefined) wishlist.description = description;
      if (isPublic !== undefined) wishlist.isPublic = isPublic;
      if (category) wishlist.category = category;
      if (tags) wishlist.tags = tags;

      await wishlist.save();
      res.json(wishlist);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Вишлист не найден' });
      }
      res.status(500).send('Ошибка сервера');
    }
  }
);

// @route   DELETE api/wishlists/:id
// @desc    Удаление вишлиста
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({ msg: 'Вишлист не найден' });
    }

    // Проверка владельца
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Нет прав на удаление' });
    }

    await wishlist.remove();
    res.json({ msg: 'Вишлист удален' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Вишлист не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   POST api/wishlists/:id/items
// @desc    Добавление нового желания в вишлист
// @access  Private
router.post(
  '/:id/items',
  [
    auth,
    [
      check('name', 'Название желания обязательно').not().isEmpty(),
      check('price', 'Стоимость обязательна').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const wishlist = await Wishlist.findById(req.params.id);

      if (!wishlist) {
        return res.status(404).json({ msg: 'Вишлист не найден' });
      }

      // Проверка владельца
      if (wishlist.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Нет прав на редактирование' });
      }

      const {
        name,
        description,
        price,
        currency,
        image,
        link,
        priority
      } = req.body;

      // Создание нового желания
      const newItem = {
        name,
        description,
        price,
        currency: currency || 'RUB',
        image,
        link,
        priority: priority || 'medium'
      };

      wishlist.items.unshift(newItem);
      await wishlist.save();

      res.json(wishlist);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Вишлист не найден' });
      }
      res.status(500).send('Ошибка сервера');
    }
  }
);

// @route   PUT api/wishlists/:id/items/:itemId
// @desc    Обновление желания в вишлисте
// @access  Private
router.put('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({ msg: 'Вишлист не найден' });
    }

    // Проверка владельца
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Нет прав на редактирование' });
    }

    // Поиск желания
    const itemIndex = wishlist.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Желание не найдено' });
    }

    const {
      name,
      description,
      price,
      currency,
      image,
      link,
      priority,
      status,
      purchaseProof
    } = req.body;

    // Обновление полей
    if (name) wishlist.items[itemIndex].name = name;
    if (description !== undefined) wishlist.items[itemIndex].description = description;
    if (price) wishlist.items[itemIndex].price = price;
    if (currency) wishlist.items[itemIndex].currency = currency;
    if (image) wishlist.items[itemIndex].image = image;
    if (link) wishlist.items[itemIndex].link = link;
    if (priority) wishlist.items[itemIndex].priority = priority;
    if (status) wishlist.items[itemIndex].status = status;
    if (purchaseProof) wishlist.items[itemIndex].purchaseProof = purchaseProof;

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Вишлист или желание не найдены' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   DELETE api/wishlists/:id/items/:itemId
// @desc    Удаление желания из вишлиста
// @access  Private
router.delete('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({ msg: 'Вишлист не найден' });
    }

    // Проверка владельца
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Нет прав на удаление' });
    }

    // Поиск и удаление желания
    const itemIndex = wishlist.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Желание не найдено' });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.json(wishlist);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Вишлист или желание не найдены' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;