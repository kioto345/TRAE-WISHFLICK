const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Пожалуйста, укажите название вишлиста'],
    trim: true,
    maxlength: [100, 'Название не может быть длиннее 100 символов']
  },
  description: {
    type: String,
    maxlength: [500, 'Описание не может быть длиннее 500 символов']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  items: [
    {
      name: {
        type: String,
        required: [true, 'Пожалуйста, укажите название желания'],
        trim: true,
        maxlength: [100, 'Название не может быть длиннее 100 символов']
      },
      description: {
        type: String,
        maxlength: [500, 'Описание не может быть длиннее 500 символов']
      },
      price: {
        type: Number,
        required: [true, 'Пожалуйста, укажите стоимость']
      },
      currency: {
        type: String,
        enum: ['RUB', 'USD', 'EUR'],
        default: 'RUB'
      },
      image: String,
      link: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      status: {
        type: String,
        enum: ['active', 'funded', 'purchased', 'cancelled'],
        default: 'active'
      },
      currentAmount: {
        type: Number,
        default: 0
      },
      donations: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          amount: Number,
          message: String,
          date: {
            type: Date,
            default: Date.now
          }
        }
      ],
      purchaseProof: {
        image: String,
        description: String,
        date: Date
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  tags: [String],
  category: {
    type: String,
    enum: [
      'Игры',
      'Электроника',
      'Одежда',
      'Книги',
      'Стриминг',
      'Хобби',
      'Другое'
    ],
    default: 'Другое'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Обновление даты изменения перед сохранением
WishlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Wishlist', WishlistSchema);