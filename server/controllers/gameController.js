const dal = require('../dal');

// 鑾峰彇鎵€鏈夋父鎴?exports.getAllGames = async (req, res) => {
  try {
    const games = await dal.getAllGames();
    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '鏈嶅姟鍣ㄩ敊璇?,
    });
  }
};

// 鑾峰彇鐗硅壊娓告垙
exports.getFeaturedGames = async (req, res) => {
  try {
    const games = await dal.getFeaturedGames();
    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '鏈嶅姟鍣ㄩ敊璇?,
    });
  }
};

// 鑾峰彇鍗曚釜娓告垙
exports.getGameById = async (req, res) => {
  try {
    const game = await dal.getGameById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        error: '娓告垙涓嶅瓨鍦?,
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
      error: '鏈嶅姟鍣ㄩ敊璇?,
    });
  }
};

// 鍒涘缓鏂版父鎴?exports.createGame = async (req, res) => {
  try {
    const game = await dal.createGame(req.body);

    res.status(201).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '鍒涘缓娓告垙澶辫触',
    });
  }
};

// 鏇存柊娓告垙
exports.updateGame = async (req, res) => {
  try {
    const game = await dal.updateGame(req.params.id, req.body);

    if (!game) {
      return res.status(404).json({
        success: false,
        error: '娓告垙涓嶅瓨鍦?,
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
      error: '鏇存柊娓告垙澶辫触',
    });
  }
};

// 鍒犻櫎娓告垙
exports.deleteGame = async (req, res) => {
  try {
    const success = await dal.deleteGame(req.params.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: '娓告垙涓嶅瓨鍦?,
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
      error: '鍒犻櫎娓告垙澶辫触',
    });
  }
};
