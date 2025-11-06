const Game = require('../models/Game');

// 获取所有游戏
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
    });
  }
};

// 获取特色游戏
exports.getFeaturedGames = async (req, res) => {
  try {
    const games = await Game.find({ isFeatured: true });
    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
    });
  }
};

// 获取单个游戏
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        error: '游戏不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
    });
  }
};

// 创建新游戏
exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);

    res.status(201).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '创建游戏失败',
    });
  }
};

// 更新游戏
exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        error: '游戏不存在',
      });
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '更新游戏失败',
    });
  }
};

// 删除游戏
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        error: '游戏不存在',
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
      error: '删除游戏失败',
    });
  }
};