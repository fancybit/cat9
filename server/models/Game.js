const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请输入游戏名称'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, '请输入游戏描述'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, '请输入游戏分类'],
    trim: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/600x400.png?text=Game+Image',
  },
  url: {
    type: String,
    required: [true, '请输入游戏链接'],
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