const News = require('../models/News');

// 获取所有新闻
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ publishDate: -1 });
    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
    });
  }
};

// 获取精选新闻
exports.getFeaturedNews = async (req, res) => {
  try {
    const news = await News.find({ isFeatured: true }).sort({ publishDate: -1 });
    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
    });
  }
};

// 获取单个新闻
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: '新闻不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
    });
  }
};

// 创建新闻
exports.createNews = async (req, res) => {
  try {
    const news = await News.create(req.body);

    res.status(201).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '创建新闻失败',
    });
  }
};

// 更新新闻
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        error: '新闻不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '更新新闻失败',
    });
  }
};

// 删除新闻
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: '新闻不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '删除新闻失败',
    });
  }
};