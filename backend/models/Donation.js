const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wishlistItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist.items'
  },
  amount: {
    type: Number,
    required: [true, 'Пожалуйста, укажите сумму доната']
  },
  currency: {
    type: String,
    enum: ['RUB', 'USD', 'EUR'],
    default: 'RUB'
  },
  message: {
    type: String,
    maxlength: [200, 'Сообщение не может быть длиннее 200 символов']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'crypto', 'other'],
    default: 'card'
  },
  paymentId: String,
  fee: {
    type: Number,
    default: 0
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', DonationSchema);