const express = require('express');
const router = express.Router();
const {
  getAllGames,
  getFeaturedGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} = require('../controllers/gameController');

// 定义游戏路由
router
  .route('/')
  .get(getAllGames)
  .post(createGame);

router.route('/featured').get(getFeaturedGames);

router
  .route('/:id')
  .get(getGameById)
  .put(updateGame)
  .delete(deleteGame);

module.exports = router;