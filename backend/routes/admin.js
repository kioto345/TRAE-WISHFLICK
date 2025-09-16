const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Donation = require('../models/Donation');

// Middleware для проверки прав администратора
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен. Требуются права администратора' });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// @route   GET api/admin/users
// @desc    Получение списка всех пользователей
// @access  Admin
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/admin/users/:id
// @desc    Получение информации о пользователе
// @access  Admin
router.get('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Получаем вишлисты пользователя
    const wishlists = await Wishlist.find({ user: req.params.id });

    // Получаем полученные донаты
    const receivedDonations = await Donation.find({ recipient: req.params.id })
      .populate('donor', ['username', 'avatar'])
      .sort({ createdAt: -1 })
      .limit(10);

    // Получаем отправленные донаты
    const sentDonations = await Donation.find({ donor: req.params.id })
      .populate('recipient', ['username', 'avatar'])
      .sort({ createdAt: -1 })
      .limit(10);

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
          count: await Donation.countDocuments({ recipient: req.params.id }),
          total: (await Donation.find({ recipient: req.params.id })).reduce(
            (total, donation) => total + donation.amount,
            0
          )
        },
        sentDonations: {
          count: await Donation.countDocuments({ donor: req.params.id }),
          total: (await Donation.find({ donor: req.params.id })).reduce(
            (total, donation) => total + donation.amount,
            0
          )
        }
      },
      recentActivity: {
        receivedDonations,
        sentDonations
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

// @route   PUT api/admin/users/:id
// @desc    Обновление информации о пользователе
// @access  Admin
router.put('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const {
      username,
      email,
      role,
      isVerified,
      isActive,
      balance
    } = req.body;

    // Создаем объект с полями для обновления
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (isVerified !== undefined) updateFields.isVerified = isVerified;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (balance !== undefined) updateFields.balance = balance;

    // Проверяем, не занято ли имя пользователя или email
    if (username || email) {
      const query = {};
      if (username) query.username = username;
      if (email) query.email = email;

      const existingUser = await User.findOne(query);
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ msg: 'Имя пользователя или email уже заняты' });
      }
    }

    // Обновляем пользователя
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/admin/wishlists
// @desc    Получение списка всех вишлистов
// @access  Admin
router.get('/wishlists', [auth, adminAuth], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const wishlists = await Wishlist.find()
      .populate('user', ['username', 'avatar'])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Wishlist.countDocuments();

    res.json({
      wishlists,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/admin/donations
// @desc    Получение списка всех донатов
// @access  Admin
router.get('/donations', [auth, adminAuth], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const donations = await Donation.find()
      .populate('donor', ['username', 'avatar'])
      .populate('recipient', ['username', 'avatar'])
      .populate('wishlistItem', ['name', 'image'])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments();

    res.json({
      donations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/admin/stats
// @desc    Получение статистики сервиса
// @access  Admin
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    // Общая статистика
    const totalUsers = await User.countDocuments();
    const totalWishlists = await Wishlist.countDocuments();
    const totalDonations = await Donation.countDocuments();

    // Сумма всех донатов
    const donations = await Donation.find();
    const totalDonationAmount = donations.reduce(
      (total, donation) => total + donation.amount,
      0
    );

    // Статистика по новым пользователям
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfDay }
    });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: startOfWeek }
    });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Статистика по донатам
    const donationsToday = await Donation.find({
      createdAt: { $gte: startOfDay }
    });
    const donationsThisWeek = await Donation.find({
      createdAt: { $gte: startOfWeek }
    });
    const donationsThisMonth = await Donation.find({
      createdAt: { $gte: startOfMonth }
    });

    const donationsTodayAmount = donationsToday.reduce(
      (total, donation) => total + donation.amount,
      0
    );
    const donationsThisWeekAmount = donationsThisWeek.reduce(
      (total, donation) => total + donation.amount,
      0
    );
    const donationsThisMonthAmount = donationsThisMonth.reduce(
      (total, donation) => total + donation.amount,
      0
    );

    res.json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth
      },
      wishlists: {
        total: totalWishlists
      },
      donations: {
        total: totalDonations,
        totalAmount: totalDonationAmount,
        today: {
          count: donationsToday.length,
          amount: donationsTodayAmount
        },
        thisWeek: {
          count: donationsThisWeek.length,
          amount: donationsThisWeekAmount
        },
        thisMonth: {
          count: donationsThisMonth.length,
          amount: donationsThisMonthAmount
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;