const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Donation = require('../models/Donation');

// Middleware для проверки прав блогера
const bloggerAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (user.role !== 'blogger' && user.role !== 'admin')) {
      return res.status(403).json({ msg: 'Доступ запрещен. Требуются права блогера' });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// @route   GET api/blogger/dashboard
// @desc    Получение данных для дашборда блогера
// @access  Blogger
router.get('/dashboard', [auth, bloggerAuth], async (req, res) => {
  try {
    // Получаем пользователя
    const user = await User.findById(req.user.id).select('-password');

    // Получаем вишлисты пользователя
    const wishlists = await Wishlist.find({ user: req.user.id });

    // Получаем полученные донаты
    const receivedDonations = await Donation.find({ recipient: req.user.id })
      .populate('donor', ['username', 'avatar'])
      .sort({ createdAt: -1 });

    // Статистика по донатам
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Донаты за сегодня, неделю, месяц
    const donationsToday = receivedDonations.filter(
      donation => new Date(donation.createdAt) >= startOfDay
    );
    const donationsThisWeek = receivedDonations.filter(
      donation => new Date(donation.createdAt) >= startOfWeek
    );
    const donationsThisMonth = receivedDonations.filter(
      donation => new Date(donation.createdAt) >= startOfMonth
    );

    // Суммы донатов
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
    const totalDonationAmount = receivedDonations.reduce(
      (total, donation) => total + donation.amount,
      0
    );

    // Топ доноров
    const donorMap = {};
    receivedDonations.forEach(donation => {
      if (!donation.isAnonymous && donation.donor) {
        const donorId = donation.donor._id.toString();
        if (!donorMap[donorId]) {
          donorMap[donorId] = {
            donor: {
              _id: donation.donor._id,
              username: donation.donor.username,
              avatar: donation.donor.avatar
            },
            totalAmount: 0,
            count: 0
          };
        }
        donorMap[donorId].totalAmount += donation.amount;
        donorMap[donorId].count += 1;
      }
    });

    const topDonors = Object.values(donorMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    // Топ желаний по донатам
    const wishlistItemMap = {};
    receivedDonations.forEach(donation => {
      if (donation.wishlistItem) {
        const itemId = donation.wishlistItem._id.toString();
        if (!wishlistItemMap[itemId]) {
          wishlistItemMap[itemId] = {
            item: donation.wishlistItem,
            totalAmount: 0,
            count: 0
          };
        }
        wishlistItemMap[itemId].totalAmount += donation.amount;
        wishlistItemMap[itemId].count += 1;
      }
    });

    const topWishlistItems = Object.values(wishlistItemMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    // Формируем объект дашборда
    const dashboard = {
      user,
      stats: {
        totalWishlists: wishlists.length,
        totalWishlistItems: wishlists.reduce(
          (total, wishlist) => total + wishlist.items.length,
          0
        ),
        donations: {
          total: {
            count: receivedDonations.length,
            amount: totalDonationAmount
          },
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
      },
      topDonors,
      topWishlistItems,
      recentDonations: receivedDonations.slice(0, 10)
    };

    res.json(dashboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/blogger/donations/chart
// @desc    Получение данных для графика донатов
// @access  Blogger
router.get('/donations/chart', [auth, bloggerAuth], async (req, res) => {
  try {
    const period = req.query.period || 'month'; // day, week, month, year
    const now = new Date();
    let startDate;
    let groupFormat;

    // Определяем начальную дату и формат группировки в зависимости от периода
    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        groupFormat = { hour: { $hour: '$createdAt' } };
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default: // month
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    // Получаем донаты за выбранный период
    const donations = await Donation.find({
      recipient: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Группируем донаты по дате
    const chartData = [];
    if (period === 'day') {
      // Для дня группируем по часам
      for (let i = 0; i < 24; i++) {
        const hourDonations = donations.filter(donation => {
          const donationDate = new Date(donation.createdAt);
          return donationDate.getHours() === i;
        });

        const amount = hourDonations.reduce(
          (total, donation) => total + donation.amount,
          0
        );

        chartData.push({
          label: `${i}:00`,
          count: hourDonations.length,
          amount
        });
      }
    } else if (period === 'week' || period === 'month') {
      // Для недели и месяца группируем по дням
      const dateMap = {};
      donations.forEach(donation => {
        const date = new Date(donation.createdAt);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

        if (!dateMap[dateStr]) {
          dateMap[dateStr] = {
            count: 0,
            amount: 0
          };
        }

        dateMap[dateStr].count += 1;
        dateMap[dateStr].amount += donation.amount;
      });

      // Заполняем все дни в выбранном периоде
      const days = (period === 'week') ? 7 : 30;
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        chartData.push({
          label: dateStr,
          count: dateMap[dateStr] ? dateMap[dateStr].count : 0,
          amount: dateMap[dateStr] ? dateMap[dateStr].amount : 0
        });
      }
    } else if (period === 'year') {
      // Для года группируем по месяцам
      const monthMap = {};
      donations.forEach(donation => {
        const date = new Date(donation.createdAt);
        const monthStr = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!monthMap[monthStr]) {
          monthMap[monthStr] = {
            count: 0,
            amount: 0
          };
        }

        monthMap[monthStr].count += 1;
        monthMap[monthStr].amount += donation.amount;
      });

      // Заполняем все месяцы в году
      for (let i = 0; i < 12; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        const monthStr = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const monthNames = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        chartData.push({
          label: monthNames[date.getMonth()],
          count: monthMap[monthStr] ? monthMap[monthStr].count : 0,
          amount: monthMap[monthStr] ? monthMap[monthStr].amount : 0
        });
      }
    }

    res.json({
      period,
      data: chartData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/blogger/wishlists/stats
// @desc    Получение статистики по вишлистам
// @access  Blogger
router.get('/wishlists/stats', [auth, bloggerAuth], async (req, res) => {
  try {
    // Получаем вишлисты пользователя
    const wishlists = await Wishlist.find({ user: req.user.id });

    // Статистика по вишлистам
    const wishlistStats = wishlists.map(wishlist => {
      // Считаем общую сумму донатов по всем желаниям в вишлисте
      const totalDonationAmount = wishlist.items.reduce(
        (total, item) => total + item.currentAmount,
        0
      );

      // Считаем общее количество донатов
      const totalDonationsCount = wishlist.items.reduce(
        (total, item) => total + item.donations.length,
        0
      );

      // Считаем процент выполнения вишлиста
      const totalPrice = wishlist.items.reduce(
        (total, item) => total + item.price,
        0
      );

      const completionPercentage = totalPrice > 0
        ? Math.round((totalDonationAmount / totalPrice) * 100)
        : 0;

      // Считаем количество выполненных желаний
      const completedItemsCount = wishlist.items.filter(
        item => item.status === 'completed'
      ).length;

      return {
        _id: wishlist._id,
        title: wishlist.title,
        isPublic: wishlist.isPublic,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
        itemsCount: wishlist.items.length,
        completedItemsCount,
        totalPrice,
        totalDonationAmount,
        totalDonationsCount,
        completionPercentage
      };
    });

    res.json(wishlistStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/blogger/donors
// @desc    Получение списка доноров
// @access  Blogger
router.get('/donors', [auth, bloggerAuth], async (req, res) => {
  try {
    // Получаем полученные донаты
    const receivedDonations = await Donation.find({ recipient: req.user.id })
      .populate('donor', ['username', 'avatar'])
      .sort({ createdAt: -1 });

    // Группируем донаты по донорам
    const donorMap = {};
    receivedDonations.forEach(donation => {
      if (!donation.isAnonymous && donation.donor) {
        const donorId = donation.donor._id.toString();
        if (!donorMap[donorId]) {
          donorMap[donorId] = {
            donor: {
              _id: donation.donor._id,
              username: donation.donor.username,
              avatar: donation.donor.avatar
            },
            totalAmount: 0,
            count: 0,
            firstDonation: donation.createdAt,
            lastDonation: donation.createdAt,
            donations: []
          };
        }

        donorMap[donorId].totalAmount += donation.amount;
        donorMap[donorId].count += 1;
        donorMap[donorId].donations.push({
          _id: donation._id,
          amount: donation.amount,
          message: donation.message,
          createdAt: donation.createdAt,
          wishlistItem: donation.wishlistItem
        });

        // Обновляем даты первого и последнего доната
        if (new Date(donation.createdAt) < new Date(donorMap[donorId].firstDonation)) {
          donorMap[donorId].firstDonation = donation.createdAt;
        }
        if (new Date(donation.createdAt) > new Date(donorMap[donorId].lastDonation)) {
          donorMap[donorId].lastDonation = donation.createdAt;
        }
      }
    });

    // Считаем количество анонимных донатов
    const anonymousDonations = receivedDonations.filter(donation => donation.isAnonymous);
    const anonymousStats = {
      count: anonymousDonations.length,
      totalAmount: anonymousDonations.reduce(
        (total, donation) => total + donation.amount,
        0
      )
    };

    // Сортируем доноров по сумме донатов
    const donors = Object.values(donorMap).sort((a, b) => b.totalAmount - a.totalAmount);

    res.json({
      donors,
      anonymous: anonymousStats,
      total: {
        count: receivedDonations.length,
        amount: receivedDonations.reduce(
          (total, donation) => total + donation.amount,
          0
        )
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;