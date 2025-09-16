const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Donation = require('../models/Donation');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');

// @route   POST api/donations
// @desc    Создание нового доната
// @access  Private/Public
router.post(
  '/',
  [
    check('recipient', 'ID получателя обязателен').not().isEmpty(),
    check('amount', 'Сумма доната обязательна').isNumeric(),
    check('amount', 'Сумма доната должна быть больше 0').custom(value => value > 0)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        recipient,
        wishlistItem,
        amount,
        currency,
        message,
        paymentMethod,
        paymentId,
        isAnonymous
      } = req.body;

      // Проверка существования получателя
      const recipientUser = await User.findById(recipient);
      if (!recipientUser) {
        return res.status(404).json({ msg: 'Получатель не найден' });
      }

      // Проверка существования желания, если указано
      if (wishlistItem) {
        const wishlist = await Wishlist.findOne({
          'items._id': wishlistItem
        });

        if (!wishlist) {
          return res.status(404).json({ msg: 'Желание не найдено' });
        }

        // Находим желание в вишлисте
        const item = wishlist.items.find(
          item => item._id.toString() === wishlistItem
        );

        if (!item) {
          return res.status(404).json({ msg: 'Желание не найдено' });
        }

        // Проверка статуса желания
        if (item.status !== 'active') {
          return res.status(400).json({ msg: 'Это желание больше не принимает донаты' });
        }
      }

      // Создание нового доната
      const newDonation = new Donation({
        donor: req.user ? req.user.id : null,
        recipient,
        wishlistItem,
        amount,
        currency: currency || 'RUB',
        message,
        paymentMethod: paymentMethod || 'card',
        paymentId,
        isAnonymous: isAnonymous || false,
        status: 'pending'
      });

      const donation = await newDonation.save();

      // Если есть желание, обновляем текущую сумму
      if (wishlistItem) {
        const wishlist = await Wishlist.findOne({
          'items._id': wishlistItem
        });

        const itemIndex = wishlist.items.findIndex(
          item => item._id.toString() === wishlistItem
        );

        wishlist.items[itemIndex].currentAmount += amount;

        // Добавляем донат в список донатов желания
        wishlist.items[itemIndex].donations.push({
          user: req.user ? req.user.id : null,
          amount,
          message,
          date: Date.now()
        });

        // Если желание полностью профинансировано, меняем статус
        if (wishlist.items[itemIndex].currentAmount >= wishlist.items[itemIndex].price) {
          wishlist.items[itemIndex].status = 'funded';
        }

        await wishlist.save();
      }

      res.json(donation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  }
);

// @route   GET api/donations/received
// @desc    Получение всех полученных донатов
// @access  Private
router.get('/received', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ recipient: req.user.id })
      .populate('donor', ['username', 'avatar'])
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/donations/sent
// @desc    Получение всех отправленных донатов
// @access  Private
router.get('/sent', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('recipient', ['username', 'avatar'])
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// @route   GET api/donations/:id
// @desc    Получение доната по ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', ['username', 'avatar'])
      .populate('recipient', ['username', 'avatar']);

    if (!donation) {
      return res.status(404).json({ msg: 'Донат не найден' });
    }

    // Проверка прав доступа
    if (
      donation.donor.toString() !== req.user.id &&
      donation.recipient.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'Нет прав на просмотр' });
    }

    res.json(donation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Донат не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// @route   PUT api/donations/:id/status
// @desc    Обновление статуса доната
// @access  Private (только для админов)
router.put(
  '/:id/status',
  [
    auth,
    check('status', 'Статус обязателен').isIn([
      'pending',
      'completed',
      'failed',
      'refunded'
    ])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Проверка прав администратора
      if (req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Нет прав на изменение статуса' });
      }

      const donation = await Donation.findById(req.params.id);

      if (!donation) {
        return res.status(404).json({ msg: 'Донат не найден' });
      }

      donation.status = req.body.status;
      await donation.save();

      // Если статус изменен на completed, обновляем баланс получателя
      if (req.body.status === 'completed') {
        const recipient = await User.findById(donation.recipient);
        recipient.balance += donation.amount - donation.fee;
        await recipient.save();
      }

      res.json(donation);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Донат не найден' });
      }
      res.status(500).send('Ошибка сервера');
    }
  }
);

module.exports = router;