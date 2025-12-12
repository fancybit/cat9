const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '璇疯緭鍏ユ柊闂绘爣棰?],
    trim: true,
  },
  content: {
    type: String,
    required: [true, '璇疯緭鍏ユ柊闂诲唴瀹?],
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, '璇疯緭鍏ユ柊闂绘憳瑕?],
    trim: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/600x400.png?text=News+Image',
  },
  category: {
    type: String,
    required: [true, '璇疯緭鍏ユ柊闂诲垎绫?],
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
    default: '鐜勭帀閫嶆父',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('News', NewsSchema);
