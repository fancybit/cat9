const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '璇疯緭鍏ユ父鎴忓悕绉?],
    trim: true,
  },
  description: {
    type: String,
    required: [true, '璇疯緭鍏ユ父鎴忔弿杩?],
    trim: true,
  },
  category: {
    type: String,
    required: [true, '璇疯緭鍏ユ父鎴忓垎绫?],
    trim: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/600x400.png?text=Game+Image',
  },
  url: {
    type: String,
    required: [true, '璇疯緭鍏ユ父鎴忛摼鎺?],
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  nftCollections: [
    {
      name: String,
      address: String,
      description: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Game', GameSchema);
