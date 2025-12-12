const News = require('../models/News');

// 鑾峰彇鎵€鏈夋柊闂?exports.getAllNews = async (req, res) => {
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
      error: '鏈嶅姟鍣ㄩ敊璇?,
    });
  }
};

// 鑾峰彇鐗硅壊鏂伴椈
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
      error: '鏈嶅姟鍣ㄩ敊璇?,
    });
  }
};

// 鑾峰彇鍗曚釜鏂伴椈
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: '鏂伴椈涓嶅瓨鍦?,
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
      error: '鏈嶅姟鍣ㄩ敊璇?,
    });
  }
};

// 鍒涘缓鏂伴椈
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
      error: '鍒涘缓鏂伴椈澶辫触',
    });
  }
};

// 鏇存柊鏂伴椈
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        error: '鏂伴椈涓嶅瓨鍦?,
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
      error: '鏇存柊鏂伴椈澶辫触',
    });
  }
};

// 鍒犻櫎鏂伴椈
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: '鏂伴椈涓嶅瓨鍦?,
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
      error: '鍒犻櫎鏂伴椈澶辫触',
    });
  }
};
