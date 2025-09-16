const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// @route   GET api/feed/popular
// @desc    Получение популярных желаний
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    // Находим все публичные вишлисты
    const wishlists = await Wishlist.find({ isPublic: true })
      .populate('user', ['username', 'avatar'])
      .sort({ createdAt: -1 });

    // Извлекаем все желания из вишлистов
    let allItems = [];
    wishlists.forEach(wishlist => {
      wishlist.items.forEach(item => {
        if (item.status === 'active') {
          allItems.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            currency: item.currency,
            image: item.image,
            link: item.link,
            priority: item.priority,
            currentAmount: item.currentAmount,
            donationsCount: item.donations.length,
            createdAt: item.createdAt,
            wishlistId: wishlist._id,
            wishlistTitle: wishlist.title,
            user: wishlist.user
          });
        }
      });
    });

    // Сортируем по количеству донатов (популярности)
    allItems.sort((a, b) => b.donationsCount - a.donationsCount);

    // Ограничиваем количество результатов
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const popularItems = allItems.slice(0, limit);

    res.json(popularItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/feed/new
// @desc    Получение новых желаний
// @access  Public
router.get('/new', async (req, res) => {
  try {
    // Находим все публичные вишлисты
    const wishlists = await Wishlist.find({ isPublic: true })
      .populate('user', ['username', 'avatar'])
      .sort({ createdAt: -1 });

    // Извлекаем все желания из вишлистов
    let allItems = [];
    wishlists.forEach(wishlist => {
      wishlist.items.forEach(item => {
        if (item.status === 'active') {
          allItems.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            currency: item.currency,
            image: item.image,
            link: item.link,
            priority: item.priority,
            currentAmount: item.currentAmount,
            donationsCount: item.donations.length,
            createdAt: item.createdAt,
            wishlistId: wishlist._id,
            wishlistTitle: wishlist.title,
            user: wishlist.user
          });
        }
      });
    });

    // Сортируем по дате создания (новые сначала)
    allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Ограничиваем количество результатов
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const newItems = allItems.slice(0, limit);

    res.json(newItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/feed/category/:category
// @desc    Получение желаний по категории
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    // Находим все публичные вишлисты в указанной категории
    const wishlists = await Wishlist.find({
      isPublic: true,
      category: req.params.category
    })
      .populate('user', ['username', 'avatar'])
      .sort({ createdAt: -1 });

    // Извлекаем все желания из вишлистов
    let allItems = [];
    wishlists.forEach(wishlist => {
      wishlist.items.forEach(item => {
        if (item.status === 'active') {
          allItems.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            currency: item.currency,
            image: item.image,
            link: item.link,
            priority: item.priority,
            currentAmount: item.currentAmount,
            donationsCount: item.donations.length,
            createdAt: item.createdAt,
            wishlistId: wishlist._id,
            wishlistTitle: wishlist.title,
            user: wishlist.user
          });
        }
      });
    });

    // Сортируем по дате создания (новые сначала)
    allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Ограничиваем количество результатов
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const categoryItems = allItems.slice(0, limit);

    res.json(categoryItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/feed/search
// @desc    Поиск желаний по ключевому слову
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ msg: 'Необходимо указать поисковый запрос' });
    }

    // Находим все публичные вишлисты
    const wishlists = await Wishlist.find({ isPublic: true })
      .populate('user', ['username', 'avatar'])
      .sort({ createdAt: -1 });

    // Извлекаем все желания из вишлистов и фильтруем по поисковому запросу
    let allItems = [];
    wishlists.forEach(wishlist => {
      wishlist.items.forEach(item => {
        if (
          item.status === 'active' &&
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(searchQuery.toLowerCase())))
        ) {
          allItems.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            currency: item.currency,
            image: item.image,
            link: item.link,
            priority: item.priority,
            currentAmount: item.currentAmount,
            donationsCount: item.donations.length,
            createdAt: item.createdAt,
            wishlistId: wishlist._id,
            wishlistTitle: wishlist.title,
            user: wishlist.user
          });
        }
      });
    });

    // Сортируем по релевантности (количество совпадений в названии и описании)
    allItems.sort((a, b) => {
      const aRelevance =
        (a.name.toLowerCase().match(new RegExp(searchQuery.toLowerCase(), 'g')) || []).length +
        ((a.description &&
          a.description.toLowerCase().match(new RegExp(searchQuery.toLowerCase(), 'g'))) ||
          []).length;

      const bRelevance =
        (b.name.toLowerCase().match(new RegExp(searchQuery.toLowerCase(), 'g')) || []).length +
        ((b.description &&
          b.description.toLowerCase().match(new RegExp(searchQuery.toLowerCase(), 'g'))) ||
          []).length;

      return bRelevance - aRelevance;
    });

    // Ограничиваем количество результатов
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const searchResults = allItems.slice(0, limit);

    res.json(searchResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;