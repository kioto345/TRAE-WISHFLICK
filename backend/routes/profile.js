const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Donation = require('../models/Donation');

// @route   GET api/profile/me
// @desc    Получение профиля текущего пользователя
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Получаем пользователя без пароля
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Получаем вишлисты пользователя
    const wishlists = await Wishlist.find({ user: req.user.id });

    // Получаем полученные донаты
    const receivedDonations = await Donation.find({ recipient: req.user.id })
      .populate('donor', ['username', 'avatar'])
      .populate('wishlistItem', ['name', 'image']);

    // Получаем отправленные донаты
    const sentDonations = await Donation.find({ donor: req.user.id })
      .populate('recipient', ['username', 'avatar'])
      .populate('wishlistItem', ['name', 'image']);

    // Формируем объект профиля
    const profile = {
      user,
      wishlists,
      stats: {
        totalWishlists: wishlists.length,
        totalWishlistItems: wishlists.reduce(
          (total, wishlist) => total + wishlist.items.length,
          0
        ),
        receivedDonations: {
          count: receivedDonations.length,
          total: receivedDonations.reduce(
            (total, donation) => total + donation.amount,
            0
          )
        },
        sentDonations: {
          count: sentDonations.length,
          total: sentDonations.reduce(
            (total, donation) => total + donation.amount,
            0
          )
        }
      }
    };

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Получение профиля пользователя по ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    // Получаем пользователя без пароля
    const user = await User.findById(req.params.user_id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Получаем публичные вишлисты пользователя
    const wishlists = await Wishlist.find({
      user: req.params.user_id,
      isPublic: true
    });

    // Формируем объект публичного профиля
    const profile = {
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        socialLinks: user.socialLinks,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt
      },
      wishlists,
      stats: {
        totalWishlists: wishlists.length,
        totalWishlistItems: wishlists.reduce(
          (total, wishlist) => total + wishlist.items.length,
          0
        )
      }
    };

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   PUT api/profile
// @desc    Обновление профиля пользователя
// @access  Private
router.put('/', auth, async (req, res) => {
  const {
    username,
    avatar,
    bio,
    socialLinks
  } = req.body;

  // Создаем объект профиля
  const profileFields = {};
  if (username) profileFields.username = username;
  if (avatar) profileFields.avatar = avatar;
  if (bio) profileFields.bio = bio;
  if (socialLinks) profileFields.socialLinks = socialLinks;

  try {
    // Проверяем, не занято ли имя пользователя
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ msg: 'Имя пользователя уже занято' });
      }
    }

    // Обновляем профиль
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/profile/donations/received
// @desc    Получение полученных донатов
// @access  Private
router.get('/donations/received', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ recipient: req.user.id })
      .populate('donor', ['username', 'avatar'])
      .populate('wishlistItem', ['name', 'image'])
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/profile/donations/sent
// @desc    Получение отправленных донатов
// @access  Private
router.get('/donations/sent', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('recipient', ['username', 'avatar'])
      .populate('wishlistItem', ['name', 'image'])
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/profile/balance
// @desc    Получение баланса пользователя
// @access  Private
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('balance');

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    res.json(user.balance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;