const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '请输入新闻标题'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, '请输入新闻内容'],
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, '请输入新闻摘要'],
    trim: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/600x400.png?text=News+Image',
  },
  category: {
    type: String,
    required: [true, '请输入新闻分类'],
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    default: '玄玉逍游',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('News', NewsSchema);